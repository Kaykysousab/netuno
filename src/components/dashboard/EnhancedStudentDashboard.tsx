import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Star,
  Play,
  Calendar,
  Target,
  Award,
  Zap,
  CheckCircle
} from 'lucide-react';
import { Button } from '../common/Button';
import { ProgressBar } from '../gamification/ProgressBar';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { studentService } from '../../services/studentService';

interface StudentStats {
  profile: any;
  enrolledCourses: number;
  completedLessons: number;
  badges: number;
  xp: number;
  level: number;
}

interface EnrolledCourse {
  id: string;
  courses: {
    id: string;
    title: string;
    instructor: string;
    thumbnail: string | null;
  };
  progress: number;
}

export const EnhancedStudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, enrollmentsData, badgesData] = await Promise.all([
        studentService.getMyStats(),
        studentService.getMyEnrollments(),
        studentService.getMyBadges()
      ]);

      setStats(statsData);
      setEnrolledCourses(enrollmentsData as any);
      setBadges(badgesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!stats?.profile) {
    return (
      <div className="min-h-screen bg-cosmic-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Perfil não encontrado</h2>
          <p className="text-gray-400">Faça login para acessar seu dashboard</p>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      label: 'Cursos Inscritos',
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: 'text-blue-400'
    },
    {
      label: 'Aulas Concluídas',
      value: stats.completedLessons,
      icon: Target,
      color: 'text-green-400'
    },
    {
      label: 'XP Conquistado',
      value: stats.xp,
      icon: Star,
      color: 'text-blue-400'
    },
    {
      label: 'Nível Atual',
      value: stats.level,
      icon: Trophy,
      color: 'text-yellow-400'
    }
  ];

  const availableBadges = [
    {
      id: 'first-steps',
      name: 'Primeiros Passos',
      description: 'Complete sua primeira aula',
      icon: '🎯',
      color: 'blue',
      requirement: 'Complete 1 aula',
      isEarned: stats.completedLessons >= 1
    },
    {
      id: 'early-bird',
      name: 'Pioneiro',
      description: 'Seja bem-vindo à plataforma',
      icon: '🐦',
      color: 'green',
      requirement: 'Cadastre-se',
      isEarned: true
    },
    {
      id: 'dedicated-learner',
      name: 'Estudante Dedicado',
      description: 'Complete 5 aulas',
      icon: '📚',
      color: 'blue',
      requirement: 'Complete 5 aulas',
      isEarned: stats.completedLessons >= 5
    },
    {
      id: 'level-up',
      name: 'Subindo de Nível',
      description: 'Alcance o nível 5',
      icon: '⚡',
      color: 'yellow',
      requirement: 'Alcance o nível 5',
      isEarned: stats.level >= 5
    },
    {
      id: 'course-collector',
      name: 'Colecionador',
      description: 'Inscreva-se em 3 cursos',
      icon: '🏆',
      color: 'gold',
      requirement: 'Inscreva-se em 3 cursos',
      isEarned: stats.enrolledCourses >= 3
    },
    {
      id: 'knowledge-seeker',
      name: 'Buscador do Conhecimento',
      description: 'Alcance o nível 10',
      icon: '🔍',
      color: 'indigo',
      requirement: 'Alcance o nível 10',
      isEarned: stats.level >= 10
    }
  ];

  const earnedBadges = availableBadges.filter(badge => badge.isEarned);
  const nextBadge = availableBadges.find(badge => !badge.isEarned);

  const upcomingLessons = [
    { id: 1, title: 'Próxima Aula Disponível', course: 'Continue Aprendendo', time: '10:00' },
    { id: 2, title: 'Revisão de Conceitos', course: 'Estudo Programado', time: '14:00' },
    { id: 3, title: 'Prática Guiada', course: 'Exercícios', time: '16:30' },
  ];

  return (
    <div className="min-h-screen bg-cosmic-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta, {stats.profile.name}!
          </h1>
          <p className="text-gray-400">Continue sua jornada de aprendizado</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cosmic-800 ${stat.color} mb-4`}>
                <stat.icon size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Continue Aprendendo</h2>
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((enrollment) => {
                  const course = enrollment.courses;
                  const progress = enrollment.progress || 0;

                  return (
                    <div
                      key={enrollment.id}
                      className="flex items-center space-x-4 p-4 bg-cosmic-800 rounded-lg hover:bg-cosmic-700 transition-colors group"
                    >
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                          <BookOpen className="text-white" size={24} />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-400">{course.instructor}</p>
                        <ProgressBar
                          current={Math.floor(progress)}
                          total={100}
                          className="mt-2"
                          showPercentage={false}
                        />
                      </div>
                      <Button size="sm" icon={Play}>
                        Continuar
                      </Button>
                    </div>
                  );
                })}

                {enrolledCourses.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen size={48} className="mx-auto mb-4 text-gray-400 opacity-50" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Nenhum curso inscrito ainda
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Explore nossos cursos e comece sua jornada de aprendizado
                    </p>
                    <Button>
                      Explorar Cursos
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <Trophy className="text-yellow-400" size={24} />
                  <span>Suas Conquistas</span>
                </h2>
                <div className="text-sm text-gray-400">
                  {earnedBadges.length} de {availableBadges.length} conquistadas
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {earnedBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className="bg-cosmic-800 border-2 border-blue-500/50 rounded-lg p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h4 className="font-semibold text-white text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-400">{badge.description}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        <CheckCircle size={12} className="mr-1" />
                        Conquistada
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {nextBadge && (
                <div className="bg-cosmic-800/50 border border-cosmic-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <Target size={16} className="text-blue-400" />
                    <span>Próxima Conquista</span>
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl opacity-50">{nextBadge.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-white">{nextBadge.name}</h5>
                      <p className="text-sm text-gray-400">{nextBadge.requirement}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-400 font-medium">
                        {nextBadge.id === 'dedicated-learner' &&
                          `${stats.completedLessons}/5 aulas`
                        }
                        {nextBadge.id === 'level-up' &&
                          `Nível ${stats.level}/5`
                        }
                        {nextBadge.id === 'course-collector' &&
                          `${stats.enrolledCourses}/3 cursos`
                        }
                        {nextBadge.id === 'knowledge-seeker' &&
                          `Nível ${stats.level}/10`
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {earnedBadges.length === availableBadges.length && (
                <div className="text-center py-6">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy size={32} className="text-yellow-400" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Parabéns! Todas as conquistas desbloqueadas!
                  </h3>
                  <p className="text-gray-400">
                    Você é um verdadeiro mestre do aprendizado!
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">

            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Zap className="text-blue-400" size={20} />
                <span>Progresso de Nível</span>
              </h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  Nível {stats.level}
                </div>
                <div className="text-sm text-gray-400">
                  {stats.xp} / {stats.level * 100} XP
                </div>
              </div>
              <ProgressBar
                current={stats.xp % 100}
                total={100}
                showPercentage={false}
                color="blue"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                {(stats.level * 100) - stats.xp} XP para o próximo nível
              </p>
            </motion.div>

            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Agenda de Hoje</h3>
                <Calendar size={20} className="text-blue-400" />
              </div>
              <div className="space-y-3">
                {upcomingLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3 bg-cosmic-800 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-white text-sm">
                        {lesson.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {lesson.course}
                      </div>
                    </div>
                    <div className="text-xs text-blue-400 font-medium">
                      {lesson.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-bold text-white mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Clock className="mr-2" size={16} />
                  Cronograma de Estudos
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="mr-2" size={16} />
                  Relatório de Progresso
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BookOpen className="mr-2" size={16} />
                  Explorar Cursos
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
