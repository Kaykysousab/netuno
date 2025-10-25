import React from 'react';
import { motion } from 'framer-motion';
import { CourseCard } from './CourseCard';
import { Course } from '../../types';

interface CourseGridProps {
  courses: Course[];
  onEnroll: (courseId: string) => void;
  onCourseSelect: (course: Course) => void;
  enrolledCourses?: string[];
}

export const CourseGrid: React.FC<CourseGridProps> = ({ 
  courses, 
  onEnroll, 
  onCourseSelect,
  enrolledCourses = [] 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <CourseCard
            course={course}
            onEnroll={onEnroll}
            onCourseSelect={onCourseSelect}
            isEnrolled={enrolledCourses.includes(course.id)}
          />
        </motion.div>
      ))}
    </div>
  );
};