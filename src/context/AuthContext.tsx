import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  enrollInCourse: (courseId: string) => Promise<void>;
  updateUserProgress: (lessonId: string, completed: boolean) => Promise<void>;
  hasAccessToCourse: (courseId: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('auth_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);
      
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters long.');
      }
      
      const response = await apiService.register(email, password, name);
      
      localStorage.setItem('auth_token', response.token);
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await apiService.enrollInCourse(courseId);
      await refreshUser();
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  };

  const updateUserProgress = async (lessonId: string, completed: boolean) => {
    if (!user) return;

    try {
      await apiService.updateProgress(lessonId, completed);
      await refreshUser();
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const hasAccessToCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const response = await apiService.checkCourseAccess(courseId);
      return response.hasAccess;
    } catch (error) {
      console.error('Access check error:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('User refresh error:', error);
    }
  };

  const getAllUsers = (): User[] => {
    // Mock implementation for admin dashboard
    return [
      {
        id: '1',
        email: 'admin@cosmic.com',
        name: 'Admin User',
        role: 'admin',
        enrolledCourses: [],
        completedLessons: [],
        badges: [],
        xp: 0,
        level: 1,
        createdAt: new Date()
      },
      {
        id: '2',
        email: 'user@cosmic.com',
        name: 'Student User',
        role: 'student',
        enrolledCourses: ['1'],
        completedLessons: ['1-1'],
        badges: [],
        xp: 150,
        level: 2,
        createdAt: new Date()
      }
    ];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading,
      enrollInCourse,
      updateUserProgress,
      hasAccessToCourse,
      refreshUser,
      getAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};