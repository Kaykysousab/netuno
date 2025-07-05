import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';
import { StorageManager } from '../utils/storage';
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
          // Validate token and get user data
          const userData = localStorage.getItem('user_data');
          if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Demo credentials check
      if (email === 'admin@cosmic.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'admin@cosmic.com',
          name: 'Admin User',
          role: 'admin',
          enrolledCourses: [],
          completedLessons: [],
          badges: [],
          xp: 0,
          level: 1,
          createdAt: new Date()
        };
        
        localStorage.setItem('auth_token', 'demo-admin-token');
        localStorage.setItem('user_data', JSON.stringify(adminUser));
        setUser(adminUser);
        return true;
      }
      
      if (email === 'user@cosmic.com' && password === 'user123') {
        const studentUser: User = {
          id: 'student-1',
          email: 'user@cosmic.com',
          name: 'Student User',
          role: 'student',
          enrolledCourses: ['1'],
          completedLessons: ['1-1'],
          badges: [],
          xp: 150,
          level: 2,
          createdAt: new Date()
        };
        
        localStorage.setItem('auth_token', 'demo-student-token');
        localStorage.setItem('user_data', JSON.stringify(studentUser));
        setUser(studentUser);
        return true;
      }

      // Check if user exists in storage
      const users = StorageManager.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        // In a real app, you would verify the password hash
        const token = `token-${existingUser.id}-${Date.now()}`;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(existingUser));
        setUser(existingUser);
        return true;
      }
      
      return false;
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

      // Check if user already exists
      const users = StorageManager.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('User already exists with this email.');
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'student',
        enrolledCourses: [],
        completedLessons: [],
        badges: [],
        xp: 0,
        level: 1,
        createdAt: new Date()
      };

      // Save to storage
      users.push(newUser);
      StorageManager.saveUsers(users);

      // Set auth data
      const token = `token-${newUser.id}-${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      setUser(newUser);
      
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
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Add enrollment to storage
      StorageManager.addEnrollment(user.id, courseId);
      
      // Update user's enrolled courses
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId]
      };
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      // Update users in storage
      const users = StorageManager.getUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        StorageManager.saveUsers(users);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  };

  const updateUserProgress = async (lessonId: string, completed: boolean) => {
    if (!user) return;

    try {
      StorageManager.updateLessonProgress(user.id, lessonId, completed);
      
      // Update user state
      const updatedCompletedLessons = completed 
        ? [...user.completedLessons, lessonId]
        : user.completedLessons.filter(id => id !== lessonId);
      
      const updatedUser = {
        ...user,
        completedLessons: updatedCompletedLessons,
        xp: completed ? user.xp + 10 : Math.max(0, user.xp - 10)
      };
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const hasAccessToCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return StorageManager.isUserEnrolled(user.id, courseId);
    } catch (error) {
      console.error('Access check error:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const users = StorageManager.getUsers();
      const updatedUser = users.find(u => u.id === user.id);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('User refresh error:', error);
    }
  };

  const getAllUsers = (): User[] => {
    return StorageManager.getUsers();
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