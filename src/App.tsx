import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { FeaturedCourses } from './components/home/FeaturedCourses';
import { Testimonials } from './components/home/Testimonials';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { EnhancedStudentDashboard } from './components/dashboard/EnhancedStudentDashboard';
import { CourseSearch } from './components/course/CourseSearch';
import { CourseDetail } from './components/course/CourseDetail';
import { CoursePlayer } from './components/course/CoursePlayer';
import { AuthModal } from './components/auth/AuthModal';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { useAuth } from './context/AuthContext';
import { mockCourses } from './data/mockData';
import { Course } from './types';

type ViewType = 'home' | 'courses' | 'course-detail' | 'course-player' | 'dashboard';

const HomePage: React.FC<{ onNavigate: (view: ViewType, course?: Course) => void }> = ({ onNavigate }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Hero onNavigate={onNavigate} />
    <FeaturedCourses onNavigate={onNavigate} />
    <Testimonials />
  </motion.div>
);

const AppContent: React.FC = () => {
  const { user, loading, enrollInCourse, updateUserProgress } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmic-950 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleNavigate = (view: ViewType, course?: Course) => {
    setCurrentView(view);
    if (course) {
      setSelectedCourse(course);
    }
  };

  const handleEnroll = (courseId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    enrollInCourse(courseId);
    
    // Show success message or navigate to course
    const course = mockCourses.find(c => c.id === courseId);
    if (course) {
      handleNavigate('course-detail', course);
    }
  };

  const handleStartCourse = (course: Course) => {
    handleNavigate('course-player', course);
  };

  const handleCourseSelect = (course: Course) => {
    handleNavigate('course-detail', course);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      
      case 'courses':
        return (
          <CourseSearch
            courses={mockCourses}
            onEnroll={handleEnroll}
            onCourseSelect={handleCourseSelect}
            enrolledCourses={user?.enrolledCourses || []}
          />
        );
      
      case 'course-detail':
        return selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onBack={() => handleNavigate('courses')}
            onStartCourse={() => handleStartCourse(selectedCourse)}
            onEnroll={() => handleEnroll(selectedCourse.id)}
          />
        ) : null;
      
      case 'course-player':
        return selectedCourse ? (
          <CoursePlayer
            course={selectedCourse}
            onBack={() => handleNavigate('course-detail', selectedCourse)}
            onProgress={updateUserProgress}
          />
        ) : null;
      
      case 'dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <EnhancedStudentDashboard />;
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-950 text-white">
      <Header 
        onNavigate={handleNavigate}
        onShowAuth={() => setShowAuthModal(true)}
      />
      
      <AnimatePresence mode="wait">
        {user && currentView === 'dashboard' ? (
          user.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <EnhancedStudentDashboard />
          )
        ) : (
          renderCurrentView()
        )}
      </AnimatePresence>

      {currentView !== 'course-player' && <Footer />}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;