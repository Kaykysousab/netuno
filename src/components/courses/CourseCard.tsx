import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Star, Crown, Play } from 'lucide-react';
import { Course } from '../../types';
import { Button } from '../common/Button';

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
  onCourseSelect: (course: Course) => void;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEnroll, 
  onCourseSelect,
  isEnrolled = false 
}) => {
  const handleCardClick = () => {
    onCourseSelect(course);
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEnroll(course.id);
  };

  return (
    <motion.div
      className="bg-cosmic-900 rounded-xl overflow-hidden border border-cosmic-700 hover:border-purple-500/50 transition-all duration-300 group cursor-pointer"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
    >
      {/* Course Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-900/80 to-transparent" />
        
        {/* Premium Badge */}
        {course.isPremium && (
          <div className="absolute top-4 right-4">
            <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
              <Crown size={12} />
              <span>Premium</span>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-purple-500/90 rounded-full p-4">
            <Play size={24} className="text-white ml-1" />
          </div>
        </div>

        {/* Level Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
            course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-purple-400 text-sm font-medium mb-2">
          {course.category}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center space-x-2 mb-4">
          <img
            src={course.instructorAvatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'}
            alt={course.instructor}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-gray-300 text-sm">{course.instructor}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>{course.enrolled_count.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span>{course.rating}</span>
            <span>({course.reviewCount})</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="bg-purple-500/10 text-purple-300 px-2 py-1 rounded text-xs"
            >
              {skill}
            </span>
          ))}
          {course.skills.length > 3 && (
            <span className="text-gray-400 text-xs">
              +{course.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            {course.price === 0 ? 'Gratuito' : `R$ ${course.price.toFixed(2)}`}
          </div>
          <Button
            variant={isEnrolled ? 'secondary' : 'primary'}
            size="sm"
            onClick={handleEnrollClick}
          >
            {isEnrolled ? 'Continuar' : 'Inscrever-se'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};