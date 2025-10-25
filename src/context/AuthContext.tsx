import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';
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
  purchaseCourse: (courseId: string) => Promise<boolean>;
  updateUserAchievements: () => void;
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
      
      // Demo credentials check with proper password validation
      if (email === 'admin@cosmic.com') {
        const isValidPassword = await bcrypt.compare(password, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8u'); // admin123
        if (isValidPassword) {
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
            createdAt: new Date(),
            purchasedCourses: []
          };
          
          localStorage.setItem('auth_token', 'demo-admin-token');
          localStorage.setItem('user_data', JSON.stringify(adminUser));
          setUser(adminUser);
          return true;
        }
      }
      
      if (email === 'user@cosmic.com') {
        const isValidPassword = await bcrypt.compare(password, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8u'); // user123
        if (isValidPassword) {
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
            createdAt: new Date(),
            purchasedCourses: ['1']
          };
          
          localStorage.setItem('auth_token', 'demo-student-token');
          localStorage.setItem('user_data', JSON.stringify(studentUser));
          setUser(studentUser);
          return true;
        }
      }

      // Check stored users with proper password validation
      const users = StorageManager.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser && existingUser.passwordHash) {
        const isValidPassword = await bcrypt.compare(password, existingUser.passwordHash);
        if (isValidPassword) {
          const token = `token-${existingUser.id}-${Date.now()}`;
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user_data', JSON.stringify(existingUser));
          setUser(existingUser);
          return true;
        }
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
        throw new Error('A senha deve ter pelo menos 6 caracteres.');
      }

      // Check if user already exists
      const users = StorageManager.getUsers();
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        throw new Error('Já existe um usuário com este email.');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

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
        createdAt: new Date(),
        passwordHash,
        purchasedCourses: []
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

  const purchaseCourse = async (courseId: string): Promise<boolean> => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Add to purchased courses
      const updatedUser = {
        ...user,
        purchasedCourses: [...(user.purchasedCourses || []), courseId],
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

      // Add enrollment record
      StorageManager.addEnrollment(user.id, courseId);
      
      return true;
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      // Only allow enrollment if course is purchased or free
      const courses = StorageManager.getCourses();
      const course = courses.find(c => c.id === courseId);
      
      if (!course) throw new Error('Course not found');
      
      // If course is paid, check if user has purchased it
      if (course.price > 0 && !user.purchasedCourses?.includes(courseId)) {
        throw new Error('Course must be purchased first');
      }

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
      
      const xpGain = completed ? 10 : 0;
      const newXp = completed ? user.xp + xpGain : Math.max(0, user.xp - 10);
      const newLevel = Math.floor(newXp / 100) + 1;
      
      const updatedUser = {
        ...user,
        completedLessons: updatedCompletedLessons,
        xp: newXp,
        level: newLevel
      };
      
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      // Update achievements
      updateUserAchievements();
    } catch (error) {
      console.error('Progress update error:', error);
    }
  };

  const updateUserAchievements = () => {
    if (!user) return;

    const newBadges = [];
    const currentBadgeIds = user.badges.map(b => b.id);

    // First Steps - Complete first lesson
    if (user.completedLessons.length >= 1 && !currentBadgeIds.includes('first-steps')) {
      newBadges.push({
        id: 'first-steps',
        name: 'Primeiros Passos',
        description: 'Complete sua primeira aula',
        icon: '🎯',
        color: 'blue',
        requirement: 'Complete 1 aula',
        earnedAt: new Date()
      });
    }

    // Early Bird - Join platform
    if (!currentBadgeIds.includes('early-bird')) {
      newBadges.push({
        id: 'early-bird',
        name: 'Pioneiro',
        description: 'Seja bem-vindo à plataforma',
        icon: '🐦',
        color: 'green',
        requirement: 'Cadastre-se',
        earnedAt: new Date()
      });
    }

    // Dedicated Learner - Complete 5 lessons
    if (user.completedLessons.length >= 5 && !currentBadgeIds.includes('dedicated-learner')) {
      newBadges.push({
        id: 'dedicated-learner',
        name: 'Estudante Dedicado',
        description: 'Complete 5 aulas',
        icon: '📚',
        color: 'purple',
        requirement: 'Complete 5 aulas',
        earnedAt: new Date()
      });
    }

    // Level Up - Reach level 5
    if (user.level >= 5 && !currentBadgeIds.includes('level-up')) {
      newBadges.push({
        id: 'level-up',
        name: 'Subindo de Nível',
        description: 'Alcance o nível 5',
        icon: '⚡',
        color: 'yellow',
        requirement: 'Alcance o nível 5',
        earnedAt: new Date()
      });
    }

    // Course Collector - Purchase 3 courses
    if ((user.purchasedCourses?.length || 0) >= 3 && !currentBadgeIds.includes('course-collector')) {
      newBadges.push({
        id: 'course-collector',
        name: 'Colecionador',
        description: 'Compre 3 cursos',
        icon: '🏆',
        color: 'gold',
        requirement: 'Compre 3 cursos',
        earnedAt: new Date()
      });
    }

    // Knowledge Seeker - Reach level 10
    if (user.level >= 10 && !currentBadgeIds.includes('knowledge-seeker')) {
      newBadges.push({
        id: 'knowledge-seeker',
        name: 'Buscador do Conhecimento',
        description: 'Alcance o nível 10',
        icon: '🔍',
        color: 'indigo',
        requirement: 'Alcance o nível 10',
        earnedAt: new Date()
      });
    }

    if (newBadges.length > 0) {
      const updatedUser = {
        ...user,
        badges: [...user.badges, ...newBadges]
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

      // Show achievement notification
      newBadges.forEach(badge => {
        setTimeout(() => {
          alert(`🎉 Nova conquista desbloqueada: ${badge.name}!`);
        }, 500);
      });
    }
  };

  const hasAccessToCourse = async (courseId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const courses = StorageManager.getCourses();
      const course = courses.find(c => c.id === courseId);
      
      if (!course) return false;
      
      // Free courses are always accessible
      if (course.price === 0) return true;
      
      // Paid courses require purchase
      return user.purchasedCourses?.includes(courseId) || false;
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
      getAllUsers,
      purchaseCourse,
      updateUserAchievements
    }}>
      {children}
    </AuthContext.Provider>
  );
};