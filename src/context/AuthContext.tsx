import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { SupabaseService } from '../services/supabaseService';
import { StorageManager } from '../utils/storage';
import type { Profile } from '../lib/supabase';
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

// Helper function to convert Profile to User
const profileToUser = (profile: Profile): User => {
  const userProgress = StorageManager.getUserProgress(profile.id);
  
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar_url,
    role: profile.role as 'student' | 'instructor' | 'admin',
    enrolledCourses: userProgress.enrolledCourses || [],
    completedLessons: userProgress.completedLessons || [],
    badges: userProgress.badges || [],
    xp: profile.xp || 0,
    level: profile.level || 1,
    createdAt: new Date(profile.created_at || Date.now()),
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const profile = await SupabaseService.getCurrentUser();
        if (profile) {
          const fullUser = profileToUser(profile);
          setUser(fullUser);
        }
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await SupabaseService.getCurrentUser();
          if (profile) {
            const fullUser = profileToUser(profile);
            setUser(fullUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await SupabaseService.signIn(email, password);
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
      
      // Validate password length before attempting registration
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters long.');
      }
      
      await SupabaseService.signUp(email, password, name);
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
      
      // Re-throw the error so it can be handled by the component
      if (error.message.includes('Password should be at least 6 characters') || 
          error.message.includes('weak_password')) {
        throw new Error('Password should be at least 6 characters long.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await SupabaseService.signOut();
      setUser(null);
      StorageManager.clearCurrentUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      await SupabaseService.enrollInCourse(user.id, courseId);
      
      // Update local storage
      const userProgress = StorageManager.getUserProgress(user.id);
      if (!userProgress.enrolledCourses.includes(courseId)) {
        userProgress.enrolledCourses.push(courseId);
        StorageManager.saveUserProgress(user.id, userProgress);
      }
      
      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Enrollment error:', error);
      throw error;
    }
  };

  const updateUserProgress = async (lessonId: string, completed: boolean) => {
    if (!user) return;

    try {
      await SupabaseService.updateLessonProgress(user.id, lessonId, completed);
      
      // Update local storage
      const userProgress = StorageManager.getUserProgress(user.id);
      if (completed && !userProgress.completedLessons.includes(lessonId)) {
        userProgress.completedLessons.push(lessonId);
        
        // Update XP
        const newXP = user.xp + 10;
        const newLevel = Math.floor(newXP / 100) + 1;
        
        userProgress.xp = newXP;
        userProgress.level = Math.max(user.level, newLevel);
        
        StorageManager.saveUserProgress(user.id, userProgress);
        
        // Update Supabase profile
        await SupabaseService.updateProfile(user.id, {
          xp: newXP,
          level: Math.max(user.level, newLevel),
        });
        
        await refreshUser();
      }
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const hasAccessToCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await SupabaseService.hasAccessToCourse(user.id, courseId);
    } catch (error) {
      console.error('Access check error:', error);
      return false;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const updatedProfile = await SupabaseService.getCurrentUser();
      if (updatedProfile) {
        const fullUser = profileToUser(updatedProfile);
        setUser(fullUser);
      }
    } catch (error) {
      console.error('User refresh error:', error);
    }
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
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};