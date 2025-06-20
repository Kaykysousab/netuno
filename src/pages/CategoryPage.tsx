import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCoursesByCategory } from '../data/storage';
import type { Course } from '../types';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCourses = () => {
      try {
        if (category) {
          const categoryCourses = getCoursesByCategory(category);
          setCourses(categoryCourses);
        }
      } catch (error) {
        console.error(`Failed to fetch courses for category ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchCourses();
  }, [category]);
  
  const getCategoryTitle = () => {
    switch (category) {
      case 'cybersecurity':
        return 'Cibersegurança';
      case 'computing':
        return 'Informática Básica';
      case 'frontend':
        return 'Desenvolvimento Frontend';
      default:
        return 'Cursos';
    }
  };
  
  const getCategoryDescription = () => {
    switch (category) {
      case 'cybersecurity':
        return 'Domine a arte de proteger sistemas, redes e programas de ataques digitais. Aprenda sobre fundamentos de segurança, hacking ético e defesa cibernética.';
      case 'computing':
        return 'Construa uma base sólida em informática básica. De sistemas operacionais a software de produtividade, aprenda as habilidades essenciais para o mundo digital.';
      case 'frontend':
        return 'Crie sites bonitos e interativos com HTML, CSS e JavaScript. Domine frameworks modernos e técnicas de design responsivo.';
      default:
        return 'Explore nossa ampla gama de cursos de tecnologia.';
    }
  };
  
  return (
    <div>
      <section className="mb-12">
        <div className="bg-secondary/50 p-8 rounded-lg border border-primary/30 mb-12">
          <h1 className="text-3xl font-bold text-primary mb-4">Cursos de {getCategoryTitle()}</h1>
          <p className="text-text-secondary">
            {getCategoryDescription()}
          </p>
        </div>
      </section>
      
      <section>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-primary">Carregando cursos...</div>
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-text-secondary mb-4">Nenhum curso encontrado para esta categoria.</p>
            <a 
              href="/"
              className="inline-block px-4 py-2 bg-primary/20 rounded text-primary hover:bg-primary/30 transition-colors"
            >
              Voltar ao Início
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;