import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../../types';

interface BadgeDisplayProps {
  badges: Badge[];
  earnedBadgeIds?: string[];
  showAll?: boolean;
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  earnedBadgeIds = [], 
  showAll = false 
}) => {
  const displayBadges = showAll ? badges : badges.slice(0, 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayBadges.map((badge) => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        
        return (
          <motion.div
            key={badge.id}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              isEarned
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-cosmic-700 bg-cosmic-800/50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Badge Icon */}
            <div className={`text-4xl mb-2 transition-all duration-300 ${
              isEarned ? 'grayscale-0' : 'grayscale opacity-50'
            }`}>
              {badge.icon}
            </div>
            
            {/* Badge Info */}
            <h4 className={`font-semibold text-sm mb-1 ${
              isEarned ? 'text-white' : 'text-gray-400'
            }`}>
              {badge.name}
            </h4>
            
            <p className={`text-xs leading-tight ${
              isEarned ? 'text-gray-300' : 'text-gray-500'
            }`}>
              {badge.description}
            </p>

            {/* Earned Indicator */}
            {isEarned && (
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}

            {/* Progress Ring for Locked Badges */}
            {!isEarned && (
              <div className="absolute inset-0 rounded-xl bg-cosmic-900/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-cosmic-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-cosmic-400 text-xs">🔒</span>
                  </div>
                  <p className="text-xs text-cosmic-400">
                    {badge.requirement}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};