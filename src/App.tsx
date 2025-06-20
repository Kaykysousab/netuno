import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CategoryPage from './pages/CategoryPage';
import CourseDetail from './pages/CourseDetail';
import VideoPlayer from './pages/VideoPlayer';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="course/:courseId" element={<CourseDetail />} />
            <Route 
              path="video/:videoId" 
              element={
                <ProtectedRoute>
                  <VideoPlayer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin" 
              element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;