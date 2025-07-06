export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  enrolledCourses: string[];
  completedLessons: string[];
  badges: Badge[];
  xp: number;
  level: number;
  createdAt: Date;
  passwordHash?: string; // Added for secure password storage
  purchasedCourses?: string[]; // Track purchased courses separately
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  instructorAvatar?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  price: number;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  enrolled_count: number;
  lessons: Lesson[];
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'published' | 'archived';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: string;
  order: number;
  isCompleted: boolean;
  quiz?: Quiz;
  resources: Resource[];
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'download';
  url: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  earnedAt?: Date;
}

export interface Progress {
  courseId: string;
  userId: string;
  completedLessons: string[];
  currentLesson: string;
  progressPercentage: number;
  xpEarned: number;
  timeSpent: number;
  lastAccessed: Date;
}

export interface Review {
  id: string;
  userId: string;
  courseId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  certificateUrl: string;
}

export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  stripePaymentIntentId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
}