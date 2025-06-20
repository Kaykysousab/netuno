import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import { getVideoById, getCourseById, getVideosByCourseId, getUserProgress, updateUserProgress } from '../data/storage';
import { useAuth } from '../context/AuthContext';
import type { Video, Course } from '../types';
import { ChevronRight, ArrowLeft, ArrowRight, Check } from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [courseVideos, setCourseVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<any>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchVideoData = () => {
      try {
        if (videoId && isAuthenticated && currentUser) {
          const videoData = getVideoById(videoId);
          
          if (videoData) {
            setVideo(videoData);
            
            const courseData = getCourseById(videoData.courseId);
            if (courseData) {
              setCourse(courseData);
              
              const videos = getVideosByCourseId(courseData.id);
              setCourseVideos(videos);
            }
            
            const progress = getUserProgress(currentUser.id, videoId);
            if (progress) {
              setCompleted(progress.completed);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch video data for video ${videoId}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    fetchVideoData();
  }, [videoId, currentUser, isAuthenticated]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleReady = (event: any) => {
    setPlayer(event.target);
  };
  
  const handleStateChange = (event: any) => {
    const state = event.data;
    
    if (state === 0 && currentUser && video) { // Video ended
      setCompleted(true);
      updateUserProgress(currentUser.id, video.id, true, video.duration);
    } else if (state === 1) { // Playing
      const interval = setInterval(() => {
        if (player && currentUser && video) {
          const currentTime = Math.floor(player.getCurrentTime());
          updateUserProgress(currentUser.id, video.id, completed, currentTime);
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  };
  
  const handleMarkComplete = () => {
    if (currentUser && video) {
      setCompleted(true);
      updateUserProgress(currentUser.id, video.id, true, video.duration);
    }
  };
  
  const getNextVideo = (): Video | null => {
    if (!video || courseVideos.length === 0) return null;
    
    const currentIndex = courseVideos.findIndex(v => v.id === video.id);
    if (currentIndex === -1 || currentIndex === courseVideos.length - 1) return null;
    
    return courseVideos[currentIndex + 1];
  };
  
  const getPrevVideo = (): Video | null => {
    if (!video || courseVideos.length === 0) return null;
    
    const currentIndex = courseVideos.findIndex(v => v.id === video.id);
    if (currentIndex <= 0) return null;
    
    return courseVideos[currentIndex - 1];
  };
  
  const nextVideo = getNextVideo();
  const prevVideo = getPrevVideo();
  
  const handleNextVideo = () => {
    if (nextVideo) {
      navigate(`/video/${nextVideo.id}`);
    }
  };
  
  const handlePrevVideo = () => {
    if (prevVideo) {
      navigate(`/video/${prevVideo.id}`);
    }
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
        <div className="animate-pulse text-primary">Carregando vídeo...</div>
      </div>
    );
  }
  
  if (!video || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-text-secondary mb-4">Vídeo não encontrado</p>
        <Link 
          to="/"
          className="inline-block px-4 py-2 bg-primary/20 rounded text-primary hover:bg-primary/30 transition-colors"
        >
          Voltar ao Início
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center text-text-secondary text-sm mb-4">
        <Link to="/" className="hover:text-primary">Início</Link>
        <ChevronRight size={16} className="mx-1" />
        <Link to={`/category/${course.category}`} className="hover:text-primary">{getCategoryName(course.category)}</Link>
        <ChevronRight size={16} className="mx-1" />
        <Link to={`/course/${course.id}`} className="hover:text-primary truncate max-w-[150px]">{course.title}</Link>
        <ChevronRight size={16} className="mx-1" />
        <span className="text-text truncate max-w-[200px]">{video.title}</span>
      </div>
      
      <div className="bg-background-light rounded-lg overflow-hidden border border-secondary mb-8">
        <div className="aspect-video">
          <YouTube
            videoId={video.youtubeId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
              },
            }}
            onReady={handleReady}
            onStateChange={handleStateChange}
            className="w-full h-full"
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            
            <div className="flex space-x-2">
              <button
                onClick={handlePrevVideo}
                disabled={!prevVideo}
                className={`p-2 rounded ${
                  prevVideo 
                    ? 'bg-secondary/50 hover:bg-secondary text-text' 
                    : 'bg-secondary/20 text-text-secondary cursor-not-allowed'
                } transition-colors`}
              >
                <ArrowLeft size={20} />
              </button>
              
              <button
                onClick={handleNextVideo}
                disabled={!nextVideo}
                className={`p-2 rounded ${
                  nextVideo 
                    ? 'bg-secondary/50 hover:bg-secondary text-text' 
                    : 'bg-secondary/20 text-text-secondary cursor-not-allowed'
                } transition-colors`}
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-text-secondary">{video.description}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-text-secondary text-sm">
              Duração: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min
            </div>
            
            <button
              onClick={handleMarkComplete}
              disabled={completed}
              className={`flex items-center px-4 py-2 rounded ${
                completed 
                  ? 'bg-green-900/20 text-green-500 cursor-not-allowed' 
                  : 'bg-primary/20 text-primary hover:bg-primary/30'
              } transition-colors`}
            >
              {completed ? (
                <>
                  <Check size={18} className="mr-2" />
                  Concluído
                </>
              ) : (
                'Marcar como Concluído'
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-background-light rounded-lg border border-secondary">
        <div className="p-6 border-b border-secondary">
          <h2 className="text-xl font-semibold">Conteúdo do Curso</h2>
          <p className="text-text-secondary">
            {courseVideos.length} vídeos • {Math.round(courseVideos.reduce((total, v) => total + v.duration, 0) / 60)} min total
          </p>
        </div>
        
        <div className="divide-y divide-secondary">
          {courseVideos.map((v) => (
            <Link 
              key={v.id}
              to={`/video/${v.id}`}
              className={`p-4 flex items-start hover:bg-secondary/20 transition-colors ${
                v.id === video.id ? 'bg-secondary/30' : ''
              }`}
            >
              <div className={`mr-4 mt-1 ${v.id === video.id ? 'text-primary' : 'text-text-secondary'}`}>
                {v.id === video.id ? (
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-text-secondary flex items-center justify-center">
                    {v.order}
                  </div>
                )}
              </div>
              <div>
                <h3 className={`font-medium mb-1 ${v.id === video.id ? 'text-primary' : ''}`}>{v.title}</h3>
                <p className="text-text-secondary text-sm">
                  {Math.floor(v.duration / 60)}:{(v.duration % 60).toString().padStart(2, '0')} min
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;