import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  BookOpen, 
  Clock, 
  Award,
  ArrowLeft,
  Download,
  ExternalLink
} from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { QuizComponent } from './QuizComponent';
import { Button } from '../common/Button';
import { ProgressBar } from '../gamification/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import type { Course as SupaCourse, Lesson } from '../../lib/supabase';

interface CoursePlayerProps {
  course: SupaCourse;
  onBack: () => void;
  onProgress: (lessonId: string, completed: boolean) => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ 
  course, 
  onBack, 
  onProgress 
}) => {
  const { user, updateUserProgress } = useAuth();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Mock lessons for now - in real app, these would come from Supabase
  useEffect(() => {
    // Mock lessons data
    const mockLessons: Lesson[] = [
      {
        id: '1',
        course_id: course.id,
        title: 'Introdução ao Curso',
        description: 'Visão geral do que você vai aprender',
        video_url: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '15 min',
        order_index: 0,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        course_id: course.id,
        title: 'Conceitos Fundamentais',
        description: 'Entendendo os conceitos básicos',
        video_url: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        duration: '20 min',
        order_index: 1,
        created_at: new Date().toISOString()
      }
    ];
    setLessons(mockLessons);
  }, [course.id]);

  const currentLesson = lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === lessons.length - 1;
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  const handleVideoComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      const newCompleted = [...completedLessons, currentLesson.id];
      setCompletedLessons(newCompleted);
      onProgress(currentLesson.id, true);
      updateUserProgress?.(currentLesson.id, true);
    }
  };

  const handleQuizComplete = (score: number, passed: boolean) => {
    setShowQuiz(false);
    if (passed && !isLastLesson) {
      // Auto advance to next lesson
      setTimeout(() => {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }, 2000);
    }
  };

  const handleLessonSelect = (index: number) => {
    // Check if lesson is unlocked
    if (index === 0 || completedLessons.includes(lessons[index - 1].id)) {
      setCurrentLessonIndex(index);
      setShowQuiz(false);
    }
  };

  const isLessonUnlocked = (index: number) => {
    return index === 0 || completedLessons.includes(lessons[index - 1].id);
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-cosmic-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              icon={ArrowLeft}
              size="sm"
            >
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">{course.title}</h1>
              <p className="text-gray-400">{currentLesson.title}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Progresso do Curso</div>
            <div className="text-lg font-semibold text-purple-400">
              {Math.round(progress)}% Completo
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <VideoPlayer
                videoUrl={currentLesson.video_url || 'https://www.youtube.com/watch?v=Tn6-PIqc4UM'}
                title={currentLesson.title}
                onProgress={(progress) => {
                  // Track video progress
                }}
                onComplete={handleVideoComplete}
              />
            </motion.div>

            {/* Lesson Info */}
            <motion.div
              className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {currentLesson.title}
                  </h2>
                  <p className="text-gray-400 mb-4">
                    {currentLesson.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{currentLesson.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen size={16} />
                      <span>Aula {currentLessonIndex + 1} de {lessons.length}</span>
                    </div>
                  </div>
                </div>
                
                {isLessonCompleted(currentLesson.id) && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">Concluída</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              className="flex justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                variant="outline"
                onClick={() => handleLessonSelect(Math.max(0, currentLessonIndex - 1))}
                disabled={currentLessonIndex === 0}
              >
                Aula Anterior
              </Button>
              
              <Button
                onClick={() => {
                  if (!isLastLesson) {
                    handleLessonSelect(currentLessonIndex + 1);
                  }
                }}
                disabled={!isLessonUnlocked(currentLessonIndex + 1) && !isLastLesson}
              >
                {isLastLesson ? 'Curso Concluído' : 'Próxima Aula'}
              </Button>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Course Progress */}
            <motion.div
              className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Progresso do Curso
              </h3>
              <ProgressBar
                current={completedLessons.length}
                total={lessons.length}
                label="Aulas Concluídas"
                color="purple"
              />
              
              {progress === 100 && (
                <motion.div
                  className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center space-x-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Award size={20} className="text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    Curso Concluído!
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Lesson List */}
            <motion.div
              className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Conteúdo do Curso
              </h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isUnlocked = isLessonUnlocked(index);
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isCurrent = index === currentLessonIndex;
                  
                  return (
                    <motion.button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(index)}
                      disabled={!isUnlocked}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                        isCurrent
                          ? 'bg-purple-500/20 border border-purple-500/50'
                          : isUnlocked
                          ? 'bg-cosmic-800 hover:bg-cosmic-700 border border-transparent'
                          : 'bg-cosmic-800/50 border border-transparent opacity-50 cursor-not-allowed'
                      }`}
                      whileHover={isUnlocked ? { scale: 1.02 } : {}}
                      whileTap={isUnlocked ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-purple-500 text-white'
                            : isUnlocked
                            ? 'bg-cosmic-700 text-gray-400'
                            : 'bg-cosmic-700 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle size={16} />
                          ) : !isUnlocked ? (
                            <Lock size={16} />
                          ) : (
                            <Play size={16} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${
                            isCurrent ? 'text-purple-300' : isUnlocked ? 'text-white' : 'text-gray-500'
                          }`}>
                            {lesson.title}
                          </div>
                          <div className={`text-xs ${
                            isUnlocked ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {lesson.duration}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};