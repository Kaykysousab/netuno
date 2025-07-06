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
  Gift
} from 'lucide-react';
import { Button } from '../common/Button';
import { ProgressBar } from '../gamification/ProgressBar';
import { BadgeDisplay } from '../gamification/BadgeDisplay';
import { useAuth } from '../../context/AuthContext';
import { StorageManager } from '../../utils/storage';
import { mockBadges } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const { user, updateUserAchievements } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  
  useEffect(() => {
    if (user) {
      // Carregar cursos inscritos
      const courses = StorageManager.getCourses();
      const enrolled = courses.filter(course => 
        user.enrolledCourses.includes(course.id)
      );
      setEnrolledCourses(enrolled);

      // Atualizar conquistas
      updateUserAchievements();
      setUserAchievements(user.badges || []);
    }
  }, [user, updateUserAchievements]);
  
  if (!user) return null;

  const stats = [
    {
      label: 'Cursos Inscritos',
      value: user.enrolledCourses.length,
      icon: BookOpen,
      color: 'text-blue-400'
    },
    {
      label: 'Aulas Concluídas',
      value: user.completedLessons.length,
      icon: Target,
      color: 'text-green-400'
    },
    {
      label: 'XP Conquistado',
      value: user.xp,
      icon: Star,
      color: 'text-purple-400'
    },
    {
      label: 'Nível Atual',
      value: user.level,
      icon: Trophy,
      color: 'text-yellow-400'
    }
  ];

  const upcomingLessons = [
    { id: 1, title: 'Padrões Avançados do React', course: 'React Fundamentals', time: '10:00' },
    { id: 2, title: 'Type Guards no TypeScript', course: 'Advanced TypeScript', time: '14:00' },
    { id: 3, title: 'Métodos de Pesquisa UX', course: 'UI/UX Design', time: '16:30' },
  ];

  const availableBadges = [
    {
      id: 'first-steps',
      name: 'Primeiros Passos',
      description: 'Complete sua primeira aula',
      icon: '🎯',
      color: 'blue',
      requirement: 'Complete 1 aula',
      isEarned: user.completedLessons.length >= 1
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
      color: 'purple',
      requirement: 'Complete 5 aulas',
      isEarned: user.completedLessons.length >= 5
    },
    {
      id: 'level-up',
      name: 'Subindo de Nível',
      description: 'Alcance o nível 5',
      icon: '⚡',
      color: 'yellow',
      requirement: 'Alcance o nível 5',
      isEarned: user.level >= 5
    },
    {
      id: 'course-collector',
      name: 'Colecionador',
      description: 'Compre 3 cursos',
      icon: '🏆',
      color: 'gold',
      requirement: 'Compre 3 cursos',
      isEarned: (user.purchasedCourses?.length || 0) >= 3
    },
    {
      id: 'knowledge-seeker',
      name: 'Buscador do Conhecimento',
      description: 'Alcance o nível 10',
      icon: '🔍',
      color: 'indigo',
      requirement: 'Alcance o nível 10',
      isEarned: user.level >= 10
    }
  ];

  const earnedBadges = availableBadges.filter(badge => badge.isEarned);
  const nextBadge = availableBadges.find(badge => !badge.isEarned);

  return (
    <div className="min-h-screen bg-cosmic-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo de volta, {user.name}! 🚀
          </h1>
          <p className="text-gray-400">Continue sua jornada cósmica de aprendizado</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300"
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
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Continue Learning */}
            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Continue Aprendendo</h2>
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((course, index) => {
                  const progress = course.lessons.length > 0 
                    ? (user.completedLessons.filter(lessonId => 
                        course.lessons.some((lesson: any) => lesson.id === lessonId)
                      ).length / course.lessons.length) * 100 
                    : 0;

                  return (
                    <div
                      key={course.id}
                      className="flex items-center space-x-4 p-4 bg-cosmic-800 rounded-lg hover:bg-cosmic-700 transition-colors group"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
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

            {/* Achievements - FUNCIONAL */}
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

              {/* Earned Badges */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {earnedBadges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    className="bg-cosmic-800 border-2 border-purple-500/50 rounded-lg p-4 text-center"
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

              {/* Next Badge to Earn */}
              {nextBadge && (
                <div className="bg-cosmic-800/50 border border-cosmic-700 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <Target size={16} className="text-purple-400" />
                    <span>Próxima Conquista</span>
                  </h4>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl opacity-50">{nextBadge.icon}</div>
                    <div className="flex-1">
                      <h5 className="font-medium text-white">{nextBadge.name}</h5>
                      <p className="text-sm text-gray-400">{nextBadge.requirement}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-purple-400 font-medium">
                        {nextBadge.id === 'dedicated-learner' && 
                          `${user.completedLessons.length}/5 aulas`
                        }
                        {nextBadge.id === 'level-up' && 
                          `Nível ${user.level}/5`
                        }
                        {nextBadge.id === 'course-collector' && 
                          `${user.purchasedCourses?.length || 0}/3 cursos`
                        }
                        {nextBadge.id === 'knowledge-seeker' && 
                          `Nível ${user.level}/10`
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
                    🎉 Parabéns! Todas as conquistas desbloqueadas!
                  </h3>
                  <p className="text-gray-400">
                    Você é um verdadeiro mestre do aprendizado cósmico!
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Level Progress */}
            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                <Zap className="text-purple-400" size={20} />
                <span>Progresso de Nível</span>
              </h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  Nível {user.level}
                </div>
                <div className="text-sm text-gray-400">
                  {user.xp} / {user.level * 100} XP
                </div>
              </div>
              <ProgressBar
                current={user.xp % 100}
                total={100}
                showPercentage={false}
                color="purple"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                {(user.level * 100) - user.xp} XP para o próximo nível
              </p>
            </motion.div>

            {/* Today's Schedule */}
            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Agenda de Hoje</h3>
                <Calendar size={20} className="text-purple-400" />
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
                    <div className="text-xs text-purple-400 font-medium">
                      {lesson.time}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
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