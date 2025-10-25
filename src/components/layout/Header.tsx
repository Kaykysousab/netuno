import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, X, User, LogOut, Settings, BookOpen, Home, GraduationCap } from 'lucide-react';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onNavigate: (view: 'home' | 'courses' | 'dashboard') => void;
  onShowAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onShowAuth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <motion.header 
      className="bg-cosmic-900/95 backdrop-blur-md border-b border-cosmic-800 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            onClick={() => onNavigate('home')}
          >
            <div className="w-8 h-8 bg-purple-gradient rounded-full flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Cosmic Learning
            </span>
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onNavigate('home')}
              className="text-gray-300 hover:text-purple-400 transition-colors flex items-center space-x-1"
            >
              <Home size={16} />
              <span>Início</span>
            </button>
            <button 
              onClick={() => onNavigate('courses')}
              className="text-gray-300 hover:text-purple-400 transition-colors flex items-center space-x-1"
            >
              <GraduationCap size={16} />
              <span>Cursos</span>
            </button>
            {user && (
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-gray-300 hover:text-purple-400 transition-colors"
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cosmic-800 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-gradient rounded-full flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.name}</span>
                </button>

                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-cosmic-800 rounded-lg shadow-lg border border-cosmic-700 py-2"
                  >
                    <div className="px-4 py-2 border-b border-cosmic-700">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <p className="text-xs text-purple-400">Level {user.level} • {user.xp} XP</p>
                    </div>
                    <button 
                      onClick={() => {
                        onNavigate('dashboard');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-cosmic-700 flex items-center space-x-2"
                    >
                      <Settings size={16} />
                      <span>Dashboard</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-cosmic-700 flex items-center space-x-2 text-red-400"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={onShowAuth}>
                  Entrar
                </Button>
                <Button variant="primary" size="sm" onClick={onShowAuth}>
                  Cadastrar
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-cosmic-800 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-cosmic-800"
          >
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full bg-cosmic-800 border border-cosmic-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => {
                    onNavigate('home');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-purple-400 transition-colors py-2 text-left flex items-center space-x-2"
                >
                  <Home size={16} />
                  <span>Início</span>
                </button>
                <button 
                  onClick={() => {
                    onNavigate('courses');
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-300 hover:text-purple-400 transition-colors py-2 text-left flex items-center space-x-2"
                >
                  <GraduationCap size={16} />
                  <span>Cursos</span>
                </button>
                {user && (
                  <button 
                    onClick={() => {
                      onNavigate('dashboard');
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-purple-400 transition-colors py-2 text-left"
                  >
                    Dashboard
                  </button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};