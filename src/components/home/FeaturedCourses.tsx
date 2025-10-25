import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CourseGrid } from '../courses/CourseGrid';
import { Button } from '../common/Button';
import { mockCourses } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';

interface FeaturedCoursesProps {
  onNavigate: (view: 'home' | 'courses' | 'course-detail' | 'course-player' | 'dashboard', course?: Course) => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const featuredCourses = mockCourses.slice(0, 4);

  const handleEnroll = (courseId: string) => {
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      onNavigate('course-detail', course);
    }
  };

  const handleCourseSelect = (course: Course) => {
    onNavigate('course-detail', course);
  };

  const handleViewAllCourses = () => {
    onNavigate('courses');
  };

  return (
    <section className="py-20 bg-cosmic-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Featured
            <span className="block bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Cosmic Courses
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our most popular courses designed to take your skills to the next level
          </p>
        </motion.div>

        {/* Course Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <CourseGrid
            courses={featuredCourses}
            onEnroll={handleEnroll}
            onCourseSelect={handleCourseSelect}
            enrolledCourses={user?.enrolledCourses || []}
          />
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button
            variant="outline"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleViewAllCourses}
          >
            Explore All Courses
          </Button>
        </motion.div>
      </div>
    </section>
  );
};