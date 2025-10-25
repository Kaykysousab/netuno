import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Users, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { AuthModal } from '../auth/AuthModal';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';

interface HeroProps {
  onNavigate: (view: 'home' | 'courses' | 'course-detail' | 'course-player' | 'dashboard', course?: Course) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  // Floating planet animations
  const planetVariants = {
    float: {
      y: [-10, 10, -10],
      x: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  const handleStartJourney = () => {
    if (user) {
      onNavigate('dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleExploreCourses = () => {
    onNavigate('courses');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic-gradient">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Planets */}
        <motion.div
          className="absolute top-20 left-10 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"
          variants={planetVariants}
          animate="float"
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-500/15 rounded-full blur-xl"
          variants={planetVariants}
          animate="float"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl"
          variants={planetVariants}
          animate="float"
          transition={{ delay: 2 }}
        />
        
        {/* Twinkling Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Launch Your
            <motion.span
              className="block bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              Cosmic Journey
            </motion.span>
            of Learning
          </h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Join thousands of students exploring the universe of knowledge through 
            interactive courses, gamified learning, and cosmic rewards.
          </motion.p>

          {/* Stats */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Users size={20} className="text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50K+</div>
                <div className="text-sm">Active Learners</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <BookOpen size={20} className="text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">200+</div>
                <div className="text-sm">Expert Courses</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <Star size={20} className="text-yellow-400 fill-current" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="text-sm">Average Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={handleStartJourney}
            >
              <Sparkles className="mr-2" />
              {user ? 'Continue Learning' : 'Start Your Journey'}
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg"
              onClick={handleExploreCourses}
            >
              <Play className="mr-2" />
              Explore Courses
            </Button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {[
              {
                icon: '🎮',
                title: 'Gamified Learning',
                description: 'Earn XP, unlock badges, and level up your skills'
              },
              {
                icon: '🚀',
                title: 'Interactive Content',
                description: 'Hands-on projects and real-world applications'
              },
              {
                icon: '👥',
                title: 'Community Driven',
                description: 'Learn with peers and expert mentors'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-cosmic-800/30 backdrop-blur-sm border border-cosmic-700/50 rounded-xl p-6 hover:bg-cosmic-800/50 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />
    </section>
  );
};