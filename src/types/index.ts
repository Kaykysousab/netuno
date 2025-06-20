export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: 'cybersecurity' | 'computing' | 'frontend';
  createdAt: string;
  isActive: boolean;
}

export interface Video {
  id: string;
  courseId: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: number;
  order: number;
  isActive: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  videoId: string;
  completed: boolean;
  watchedSeconds: number;
  lastWatched: string;
}