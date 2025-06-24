import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Star,
  Play,
  Calendar,
  Target
} from 'lucide-react';
import { Button } from '../common/Button';
import { ProgressBar } from '../gamification/ProgressBar';
import { BadgeDisplay } from '../gamification/BadgeDisplay';
import { useAuth } from '../../context/AuthContext';
import { mockCourses, mockBadges } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;

  const enrolledCourses = mockCourses.filter(course => 
    user.enrolledCourses.includes(course.id)
  );

  const stats = [
    {
      label: 'Courses Enrolled',
      value: user.enrolledCourses.length,
      icon: BookOpen,
      color: 'text-blue-400'
    },
    {
      label: 'Lessons Completed',
      value: user.completedLessons.length,
      icon: Target,
      color: 'text-green-400'
    },
    {
      label: 'XP Earned',
      value: user.xp,
      icon: Star,
      color: 'text-purple-400'
    },
    {
      label: 'Current Level',
      value: user.level,
      icon: Trophy,
      color: 'text-yellow-400'
    }
  ];

  const upcomingLessons = [
    { id: 1, title: 'Advanced React Patterns', course: 'React Fundamentals', time: '10:00 AM' },
    { id: 2, title: 'Type Guards in TypeScript', course: 'Advanced TypeScript', time: '2:00 PM' },
    { id: 3, title: 'User Research Methods', course: 'UI/UX Design', time: '4:30 PM' },
  ];

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
            Welcome back, {user.name}! 🚀
          </h1>
          <p className="text-gray-400">Continue your cosmic learning journey</p>
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
              <h2 className="text-xl font-bold text-white mb-6">Continue Learning</h2>
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((course, index) => (
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
                        current={Math.floor(Math.random() * 8) + 2}
                        total={10}
                        className="mt-2"
                        showPercentage={false}
                      />
                    </div>
                    <Button size="sm" icon={Play}>
                      Continue
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              className="bg-cosmic-900 border border-cosmic-700 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Your Achievements</h2>
              <BadgeDisplay
                badges={mockBadges}
                earnedBadgeIds={user.badges.map(b => b.id)}
              />
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
              <h3 className="text-lg font-bold text-white mb-4">Level Progress</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  Level {user.level}
                </div>
                <div className="text-sm text-gray-400">
                  {user.xp} / {(user.level + 1) * 100} XP
                </div>
              </div>
              <ProgressBar
                current={user.xp}
                total={(user.level + 1) * 100}
                showPercentage={false}
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                {((user.level + 1) * 100) - user.xp} XP to next level
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
                <h3 className="text-lg font-bold text-white">Today's Schedule</h3>
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
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Clock className="mr-2" size={16} />
                  Study Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <TrendingUp className="mr-2" size={16} />
                  Progress Report
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BookOpen className="mr-2" size={16} />
                  Browse Courses
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};