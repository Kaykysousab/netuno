import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award, 
  CheckCircle,
  ArrowLeft,
  Crown,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';
import { ProgressBar } from '../gamification/ProgressBar';
import { PaymentModal } from '../payment/PaymentModal';
import { LockedCourseOverlay } from './LockedCourseOverlay';
import { useAuth } from '../../context/AuthContext';
import { SupabaseService } from '../../services/supabaseService';
import type { Course as SupaCourse, Lesson } from '../../lib/supabase';

interface CourseDetailProps {
  course: SupaCourse;
  onBack: () => void;
  onStartCourse: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onBack,
  onStartCourse
}) => {
  const { user, hasAccessToCourse } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProgress, setUserProgress] = useState<any[]>([]);

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Load lessons
        const courseLessons = await SupabaseService.getCourseLessons(course.id);
        setLessons(courseLessons || []);

        // Check access if user is logged in
        if (user) {
          const access = await hasAccessToCourse(course.id);
          setHasAccess(access);

          if (access) {
            const progress = await SupabaseService.getUserProgress(user.id);
            setUserProgress(progress || []);
          }
        }
      } catch (error) {
        console.error('Error loading course data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [course.id, user, hasAccessToCourse]);

  const completedLessons = userProgress.filter(p => 
    lessons.some(lesson => lesson.id === p.lesson_id) && p.completed
  );
  const progress = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  const handleEnroll = () => {
    if (!user) {
      // Redirect to login or show auth modal
      return;
    }

    if (course.price === 0) {
      // Free course - enroll directly
      handlePaymentSuccess();
    } else {
      // Paid course - show payment modal
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      if (user) {
        await SupabaseService.enrollInCourse(user.id, course.id);
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'curriculum', label: 'Conteúdo' },
    { id: 'reviews', label: 'Avaliações' }
  ];

  const mockReviews = [
    {
      id: '1',
      userName: 'Ana Silva',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 5,
      comment: 'Curso excelente! Aprendi muito e consegui aplicar no meu trabalho.',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userName: 'Carlos Santos',
      userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      rating: 4,
      comment: 'Muito bom conteúdo, professor explica muito bem.',
      createdAt: new Date('2024-01-10')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={onBack}
            icon={ArrowLeft}
            size="sm"
          >
            Voltar aos Cursos
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            
            {/* Course Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative rounded-xl overflow-hidden mb-6">
                <img
                  src={course.thumbnail || 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {course.is_premium && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Crown size={16} />
                      <span>Premium</span>
                    </div>
                  </div>
                )}

                {!hasAccess && course.price > 0 && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Lock size={16} />
                      <span>Bloqueado</span>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {course.category}
                  </span>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {course.title}
                  </h1>
                  <p className="text-gray-200">
                    {course.description}
                  </p>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-cosmic-900 rounded-lg p-4 border border-cosmic-700">
                  <div className="flex items-center space-x-2 text-purple-400 mb-1">
                    <Clock size={16} />
                    <span className="text-sm">Duração</span>
                  </div>
                  <div className="text-white font-semibold">{course.duration}</div>
                </div>
                
                <div className="bg-cosmic-900 rounded-lg p-4 border border-cosmic-700">
                  <div className="flex items-center space-x-2 text-purple-400 mb-1">
                    <Users size={16} />
                    <span className="text-sm">Alunos</span>
                  </div>
                  <div className="text-white font-semibold">{course.enrolled_count.toLocaleString()}</div>
                </div>
                
                <div className="bg-cosmic-900 rounded-lg p-4 border border-cosmic-700">
                  <div className="flex items-center space-x-2 text-purple-400 mb-1">
                    <Star size={16} />
                    <span className="text-sm">Avaliação</span>
                  </div>
                  <div className="text-white font-semibold">{course.rating} ⭐</div>
                </div>
                
                <div className="bg-cosmic-900 rounded-lg p-4 border border-cosmic-700">
                  <div className="flex items-center space-x-2 text-purple-400 mb-1">
                    <BookOpen size={16} />
                    <span className="text-sm">Aulas</span>
                  </div>
                  <div className="text-white font-semibold">{lessons.length}</div>
                </div>
              </div>

              {/* Progress Bar for Enrolled Users */}
              {hasAccess && (
                <motion.div
                  className="bg-cosmic-900 rounded-lg p-4 border border-cosmic-700 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Seu Progresso</span>
                    <span className="text-purple-400 font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <ProgressBar
                    current={completedLessons.length}
                    total={lessons.length}
                    showPercentage={false}
                  />
                </motion.div>
              )}
            </motion.div>

            {/* Tabs */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex space-x-1 bg-cosmic-900 rounded-lg p-1 border border-cosmic-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-purple-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-cosmic-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700">
                    <h3 className="text-xl font-bold text-white mb-4">Sobre o Curso</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      {course.description}
                    </p>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">O que você vai aprender</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {course.skills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-400" />
                          <span className="text-gray-300">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700">
                    <h3 className="text-xl font-bold text-white mb-4">Instrutor</h3>
                    <div className="flex items-center space-x-4">
                      <img
                        src={course.instructor_avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={course.instructor}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-white">{course.instructor}</h4>
                        <p className="text-gray-400">Especialista em {course.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700 relative">
                  <h3 className="text-xl font-bold text-white mb-6">Conteúdo do Curso</h3>
                  
                  {!hasAccess && course.price > 0 && (
                    <LockedCourseOverlay
                      courseName={course.title}
                      price={course.price}
                      onPurchase={() => setShowPaymentModal(true)}
                    />
                  )}
                  
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => {
                      const isCompleted = userProgress.some(p => p.lesson_id === lesson.id && p.completed);
                      
                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center space-x-4 p-4 bg-cosmic-800 rounded-lg ${
                            !hasAccess && course.price > 0 ? 'opacity-50' : ''
                          }`}
                        >
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' : hasAccess ? 'bg-cosmic-700' : 'bg-red-500'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle size={16} className="text-white" />
                            ) : hasAccess ? (
                              <Play size={16} className="text-gray-400" />
                            ) : (
                              <Lock size={16} className="text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">{lesson.title}</h4>
                            <p className="text-sm text-gray-400">{lesson.description}</p>
                          </div>
                          <div className="text-sm text-gray-400">{lesson.duration}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700">
                    <h3 className="text-xl font-bold text-white mb-4">Avaliações dos Alunos</h3>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="text-4xl font-bold text-white">{course.rating}</div>
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={`${
                                i < Math.floor(course.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-400">{course.review_count} avaliações</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-white">{review.userName}</h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={`${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300 mb-2">{review.comment}</p>
                            <p className="text-sm text-gray-400">
                              {review.createdAt.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Enrollment Card */}
            <motion.div
              className="bg-cosmic-900 rounded-xl p-6 border border-cosmic-700 sticky top-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  {course.price === 0 ? 'Gratuito' : `R$ ${course.price.toFixed(2)}`}
                </div>
                {course.price > 0 && (
                  <p className="text-gray-400 text-sm">Pagamento único</p>
                )}
              </div>

              {hasAccess ? (
                <div className="space-y-4">
                  <Button
                    className="w-full"
                    onClick={onStartCourse}
                    icon={Play}
                  >
                    {progress > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
                  </Button>
                  
                  {progress > 0 && (
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-2">Progresso atual</p>
                      <div className="text-lg font-semibold text-purple-400">
                        {Math.round(progress)}% concluído
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleEnroll}
                >
                  {course.price === 0 ? 'Inscrever-se Gratuitamente' : 'Comprar Curso'}
                </Button>
              )}

              <div className="mt-6 space-y-3 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Award size={16} />
                  <span>Certificado de conclusão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>Acesso vitalício</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users size={16} />
                  <span>Suporte da comunidade</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};