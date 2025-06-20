import type { User, Course, Video, UserProgress } from '../types';

// Storage keys
const USERS_KEY = 'techlearn_users';
const COURSES_KEY = 'techlearn_courses';
const VIDEOS_KEY = 'techlearn_videos';
const PROGRESS_KEY = 'techlearn_progress';

// Initialize default data
const initializeDefaultData = () => {
  // Default admin user
  const defaultUsers: User[] = [
    {
      id: 'admin-1',
      username: 'admin',
      email: 'admin@techlearn.com',
      password: 'admin123',
      isAdmin: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Default courses
  const defaultCourses: Course[] = [
    {
      id: 'course-1',
      title: 'Introdução à Cibersegurança',
      description: 'Aprenda os fundamentos da cibersegurança e estratégias básicas de proteção.',
      thumbnailUrl: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg',
      category: 'cybersecurity',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'course-2',
      title: 'Hacking Ético Básico',
      description: 'Entenda a metodologia do hacking ético e testes de penetração.',
      thumbnailUrl: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg',
      category: 'cybersecurity',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'course-3',
      title: 'Informática Básica para Iniciantes',
      description: 'Comece com os fundamentos da computação e habilidades essenciais.',
      thumbnailUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg',
      category: 'computing',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'course-4',
      title: 'Dominando Softwares de Escritório',
      description: 'Aprenda a usar processadores de texto, planilhas e software de apresentação efetivamente.',
      thumbnailUrl: 'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg',
      category: 'computing',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'course-5',
      title: 'Fundamentos de HTML & CSS',
      description: 'Inicie sua jornada no desenvolvimento web com os básicos de HTML e CSS.',
      thumbnailUrl: 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg',
      category: 'frontend',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'course-6',
      title: 'JavaScript para Iniciantes',
      description: 'Aprenda os conceitos fundamentais da programação JavaScript para desenvolvimento web.',
      thumbnailUrl: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg',
      category: 'frontend',
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ];

  // Default videos
  const defaultVideos: Video[] = [
    // Course 1 videos
    {
      id: 'video-1',
      courseId: 'course-1',
      title: 'Introdução à Cibersegurança - Parte 1',
      description: 'Conceitos básicos de segurança digital',
      youtubeId: 'inWWhr5tnEA',
      duration: 600,
      order: 1,
      isActive: true
    },
    {
      id: 'video-2',
      courseId: 'course-1',
      title: 'Introdução à Cibersegurança - Parte 2',
      description: 'Tipos de ameaças digitais',
      youtubeId: 'z5nc9MDbvkw',
      duration: 720,
      order: 2,
      isActive: true
    },
    {
      id: 'video-3',
      courseId: 'course-1',
      title: 'Introdução à Cibersegurança - Parte Final',
      description: 'Melhores práticas de segurança',
      youtubeId: 'U_P23SqJaDc',
      duration: 540,
      order: 3,
      isActive: true
    },
    // Course 2 videos
    {
      id: 'video-4',
      courseId: 'course-2',
      title: 'Hacking Ético - Fundamentos',
      description: 'O que é hacking ético',
      youtubeId: 'WnN6dbos5u4',
      duration: 800,
      order: 1,
      isActive: true
    },
    {
      id: 'video-5',
      courseId: 'course-2',
      title: 'Hacking Ético - Ferramentas',
      description: 'Principais ferramentas utilizadas',
      youtubeId: '3Kq1MIfTWCE',
      duration: 900,
      order: 2,
      isActive: true
    },
    // Course 3 videos
    {
      id: 'video-6',
      courseId: 'course-3',
      title: 'Informática Básica - Introdução',
      description: 'Conhecendo o computador',
      youtubeId: 'HEENilFReiw',
      duration: 650,
      order: 1,
      isActive: true
    },
    {
      id: 'video-7',
      courseId: 'course-3',
      title: 'Informática Básica - Sistema Operacional',
      description: 'Entendendo o Windows',
      youtubeId: 'OpebVLAyqWQ',
      duration: 750,
      order: 2,
      isActive: true
    },
    // Course 4 videos
    {
      id: 'video-8',
      courseId: 'course-4',
      title: 'Microsoft Word - Básico',
      description: 'Primeiros passos no Word',
      youtubeId: 'ice-L9Z4h9M',
      duration: 600,
      order: 1,
      isActive: true
    },
    {
      id: 'video-9',
      courseId: 'course-4',
      title: 'Microsoft Excel - Básico',
      description: 'Introdução às planilhas',
      youtubeId: 'XmSp2-QG2aE',
      duration: 700,
      order: 2,
      isActive: true
    },
    // Course 5 videos
    {
      id: 'video-10',
      courseId: 'course-5',
      title: 'HTML - Estrutura Básica',
      description: 'Criando sua primeira página',
      youtubeId: 'Ejkb_YpuHWs',
      duration: 800,
      order: 1,
      isActive: true
    },
    {
      id: 'video-11',
      courseId: 'course-5',
      title: 'CSS - Estilização',
      description: 'Dando estilo às páginas',
      youtubeId: 'Icf5D3fEKbM',
      duration: 900,
      order: 2,
      isActive: true
    },
    // Course 6 videos
    {
      id: 'video-12',
      courseId: 'course-6',
      title: 'JavaScript - Variáveis e Funções',
      description: 'Conceitos básicos do JavaScript',
      youtubeId: 'BXqUH86F-kA',
      duration: 850,
      order: 1,
      isActive: true
    },
    {
      id: 'video-13',
      courseId: 'course-6',
      title: 'JavaScript - DOM Manipulation',
      description: 'Interagindo com elementos HTML',
      youtubeId: 'y17RuWkWdn8',
      duration: 950,
      order: 2,
      isActive: true
    }
  ];

  // Initialize storage if empty
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(COURSES_KEY)) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(defaultCourses));
  }
  if (!localStorage.getItem(VIDEOS_KEY)) {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(defaultVideos));
  }
  if (!localStorage.getItem(PROGRESS_KEY)) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([]));
  }
};

// Initialize on load
initializeDefaultData();

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserByCredentials = (username: string, password: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username && user.password === password);
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.username === username);
};

export const createUser = (username: string, email: string, password: string): User => {
  const users = getUsers();
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email,
    password,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Course functions
export const getCourses = (): Course[] => {
  const courses = localStorage.getItem(COURSES_KEY);
  return courses ? JSON.parse(courses) : [];
};

export const saveCourses = (courses: Course[]): void => {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
};

export const getActiveCourses = (): Course[] => {
  return getCourses().filter(course => course.isActive);
};

export const getCoursesByCategory = (category: string): Course[] => {
  return getActiveCourses().filter(course => course.category === category);
};

export const getCourseById = (id: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(course => course.id === id);
};

export const createCourse = (courseData: Omit<Course, 'id' | 'createdAt'>): Course => {
  const courses = getCourses();
  const newCourse: Course = {
    ...courseData,
    id: `course-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  courses.push(newCourse);
  saveCourses(courses);
  return newCourse;
};

export const updateCourse = (id: string, courseData: Partial<Course>): Course | undefined => {
  const courses = getCourses();
  const index = courses.findIndex(course => course.id === id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...courseData };
    saveCourses(courses);
    return courses[index];
  }
  return undefined;
};

export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  if (filteredCourses.length !== courses.length) {
    saveCourses(filteredCourses);
    // Also delete related videos
    const videos = getVideos();
    const filteredVideos = videos.filter(video => video.courseId !== id);
    saveVideos(filteredVideos);
    return true;
  }
  return false;
};

// Video functions
export const getVideos = (): Video[] => {
  const videos = localStorage.getItem(VIDEOS_KEY);
  return videos ? JSON.parse(videos) : [];
};

export const saveVideos = (videos: Video[]): void => {
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
};

export const getVideosByCourseId = (courseId: string): Video[] => {
  return getVideos()
    .filter(video => video.courseId === courseId && video.isActive)
    .sort((a, b) => a.order - b.order);
};

export const getVideoById = (id: string): Video | undefined => {
  const videos = getVideos();
  return videos.find(video => video.id === id);
};

export const createVideo = (videoData: Omit<Video, 'id'>): Video => {
  const videos = getVideos();
  const newVideo: Video = {
    ...videoData,
    id: `video-${Date.now()}`
  };
  videos.push(newVideo);
  saveVideos(videos);
  return newVideo;
};

export const updateVideo = (id: string, videoData: Partial<Video>): Video | undefined => {
  const videos = getVideos();
  const index = videos.findIndex(video => video.id === id);
  if (index !== -1) {
    videos[index] = { ...videos[index], ...videoData };
    saveVideos(videos);
    return videos[index];
  }
  return undefined;
};

export const deleteVideo = (id: string): boolean => {
  const videos = getVideos();
  const filteredVideos = videos.filter(video => video.id !== id);
  if (filteredVideos.length !== videos.length) {
    saveVideos(filteredVideos);
    return true;
  }
  return false;
};

// Progress functions
export const getProgress = (): UserProgress[] => {
  const progress = localStorage.getItem(PROGRESS_KEY);
  return progress ? JSON.parse(progress) : [];
};

export const saveProgress = (progress: UserProgress[]): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const getUserProgress = (userId: string, videoId: string): UserProgress | undefined => {
  const progress = getProgress();
  return progress.find(p => p.userId === userId && p.videoId === videoId);
};

export const updateUserProgress = (
  userId: string,
  videoId: string,
  completed: boolean,
  watchedSeconds: number
): void => {
  const progress = getProgress();
  const existingIndex = progress.findIndex(p => p.userId === userId && p.videoId === videoId);
  
  if (existingIndex !== -1) {
    progress[existingIndex] = {
      ...progress[existingIndex],
      completed,
      watchedSeconds,
      lastWatched: new Date().toISOString()
    };
  } else {
    progress.push({
      id: `progress-${Date.now()}`,
      userId,
      videoId,
      completed,
      watchedSeconds,
      lastWatched: new Date().toISOString()
    });
  }
  
  saveProgress(progress);
};

export const getUserCourseProgress = (userId: string, courseId: string): { completed: number, total: number } => {
  const videos = getVideosByCourseId(courseId);
  const progress = getProgress();
  
  const total = videos.length;
  const completed = videos.filter(video => {
    const userProgress = progress.find(p => p.userId === userId && p.videoId === video.id);
    return userProgress?.completed || false;
  }).length;
  
  return { completed, total };
};