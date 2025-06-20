import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourseById, getVideosByCourseId, getUserCourseProgress } from '../data/storage';
import { useAuth } from '../context/AuthContext';
import type { Course, Video } from '../types';
import { Play, ChevronRight, Lock } from 'lucide-react';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<{ completed: number, total: number }>({ completed: 0, total: 0 });
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCourseData = () => {
      try {
        if (courseId) {
          const courseData = getCourseById(courseId);
          
          if (courseData) {
            setCourse(courseData);
            const courseVideos = getVideosByCourseId(courseId);
            setVideos(courseVideos);
            
            if (isAuthenticated && currentUser) {
              const userProgress = getUserCourseProgress(currentUser.id, courseId);
              setProgress(userProgress);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch course data for course ${courseId}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchCourseData();
  }, [courseId, currentUser, isAuthenticated]);
  
  const handleStartCourse = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (videos.length > 0) {
      navigate(`/video/${videos[0].id}`);
    }
  };
  
  const handleVideoClick = (videoId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    navigate(`/video/${videoId}`);
  };
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-primary">Carregando curso...</div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-text-secondary mb-4">Curso não encontrado</p>
        <Link 
          to="/"
          className="inline-block px-4 py-2 bg-primary/20 rounded text-primary hover:bg-primary/30 transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    );
  }
  
  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center text-text-secondary text-sm mb-4">
        <Link to="/" className="hover:text-primary">Início</Link>
        <ChevronRight size={16} className="mx-1" />
        <Link to={`/category/${course.category}`} className="hover:text-primary">{getCategoryName(course.category)}</Link>
        <ChevronRight size={16} className="mx-1" />
        <span className="text-text truncate">{course.title}</span>
      </div>
      
      <div className="bg-background-light rounded-lg overflow-hidden border border-secondary mb-8">
        <div className="relative h-64 md:h-80">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6">
            <span className="inline-block bg-primary text-black text-xs px-2 py-1 rounded mb-2">
              {getCategoryName(course.category)}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
            
            {isAuthenticated && (
              <div className="flex items-center mb-2">
                <div className="w-full max-w-xs bg-background h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm text-text-secondary">
                  {progressPercentage}% completo
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Sobre este curso</h2>
          <p className="text-text-secondary mb-6">{course.description}</p>
          
          <button
            onClick={handleStartCourse}
            className="inline-flex items-center px-6 py-3 bg-primary text-black rounded font-medium hover:bg-primary/90 transition-colors"
          >
            <Play size={18} className="mr-2" />
            {isAuthenticated ? 'Iniciar' : 'Entrar para Iniciar'} Curso
          </button>
        </div>
      </div>
      
      <div className="bg-background-light rounded-lg border border-secondary">
        <div className="p-6 border-b border-secondary">
          <h2 className="text-xl font-semibold">Conteúdo do Curso</h2>
          <p className="text-text-secondary">
            {videos.length} vídeos • {Math.round(videos.reduce((total, video) => total + video.duration, 0) / 60)} min total
          </p>
        </div>
        
        <div className="divide-y divide-secondary">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="p-4 flex items-start hover:bg-secondary/20 transition-colors cursor-pointer"
              onClick={() => handleVideoClick(video.id)}
            >
              <div className="text-primary mr-4 mt-1">
                {isAuthenticated ? (
                  <Play size={20} />
                ) : (
                  <Lock size={20} />
                )}
              </div>
              <div>
                <h3 className="font-medium mb-1">{video.title}</h3>
                <p className="text-text-secondary text-sm">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;