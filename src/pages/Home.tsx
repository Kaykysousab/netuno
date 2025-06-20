import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { getActiveCourses } from '../data/storage';
import type { Course } from '../types';

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchCourses = () => {
      try {
        const allCourses = getActiveCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  return (
    <div>
      <section className="mb-12">
        <div className="bg-secondary/50 p-8 rounded-lg border border-primary/30 text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Bem-vindo ao TechLearn</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Sua jornada para dominar a tecnologia começa aqui. Explore nossa ampla gama de cursos em 
            Cibersegurança, Informática Básica e Desenvolvimento Frontend.
          </p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 border-b border-primary/30 pb-2">
          Cursos em Destaque
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-primary">Carregando cursos...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6 border-b border-primary/30 pb-2">
          Categorias de Cursos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background-light rounded-lg p-6 border border-secondary group hover:border-primary transition-all">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Cibersegurança
            </h3>
            <p className="text-text-secondary mb-4">
              Aprenda como proteger sistemas, redes e dados de ataques digitais. 
              Domine os fundamentos de segurança e técnicas de hacking ético.
            </p>
            <a 
              href="/category/cybersecurity"
              className="inline-block px-4 py-2 bg-primary/20 rounded text-primary hover:bg-primary/30 transition-colors"
            >
              Explorar Cursos
            </a>
          </div>
          
          <div className="bg-background-light rounded-lg p-6 border border-secondary group hover:border-primary transition-all">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors flex items-center">
              <Laptop className="h-5 w-5 mr-2" />
              Informática Básica
            </h3>
            <p className="text-text-secondary mb-4">
              Domine habilidades essenciais de computação para uso diário. Aprenda sobre sistemas operacionais,
              gerenciamento de arquivos, software de produtividade e básicos da internet.
            </p>
            <a 
              href="/category/computing"
              className="inline-block px-4 py-2 bg-primary/20 rounded text-primary hover:bg-primary/30 transition-colors"
            >
              Explorar Cursos
            </a>
          </div>
          
          <div className="bg-background-light rounded-lg p-6 border border-secondary group hover:border-primary transition-all">
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Desenvolvimento Frontend
            </h3>
            <p className="text-text-secondary mb-4">
              Construa sites bonitos e interativos com HTML, CSS e JavaScript.
              Aprenda frameworks modernos e técnicas de design responsivo.
            </p>
            <a 
              href="/category/frontend"
              className="inline-block px-4 py-2 bg-primary/20 rounded text-primary hover:bg-primary/30 transition-colors"
            >
              Explorar Cursos
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;