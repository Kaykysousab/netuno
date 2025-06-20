import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'cybersecurity':
        return 'Cibersegurança';
      case 'computing':
        return 'Informática Básica';
      case 'frontend':
        return 'Frontend';
      default:
        return category;
    }
  };

  return (
    <Link 
      to={`/course/${course.id}`}
      className="bg-background-light rounded-lg overflow-hidden border border-secondary hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <span className="absolute bottom-2 left-2 bg-primary text-black text-xs px-2 py-1 rounded">
          {getCategoryName(course.category)}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-text-secondary text-sm line-clamp-2">
          {course.description}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;