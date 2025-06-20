import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserByCredentials, createUser, getUserByUsername } from '../data/storage';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsAdmin(user.isAdmin || false);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);
  
  const login = async (username: string, password: string) => {
    try {
      const user = getUserByCredentials(username, password);
      
      if (user) {
        const { password: _, ...safeUser } = user;
        const userToStore = { ...safeUser, password: '***' };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        setIsAdmin(user.isAdmin || false);
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
        
        return { success: true, message: 'Login realizado com sucesso' };
      }
      
      return { success: false, message: 'Usuário ou senha inválidos' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro durante o login' };
    }
  };
  
  const register = async (username: string, email: string, password: string) => {
    try {
      const existingUser = getUserByUsername(username);
      
      if (existingUser) {
        return { success: false, message: 'Nome de usuário já existe' };
      }
      
      const user = createUser(username, email, password);
      
      const { password: _, ...safeUser } = user;
      const userToStore = { ...safeUser, password: '***' };
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.isAdmin || false);
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      
      return { success: true, message: 'Cadastro realizado com sucesso' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Erro durante o cadastro' };
    }
  };
  
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};