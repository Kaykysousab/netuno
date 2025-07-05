import { Course, Badge } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals',
    description: 'Learn the basics of React development with modern hooks and best practices',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'John Doe',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    duration: '6 hours',
    level: 'Beginner',
    category: 'Programming',
    price: 0,
    isPremium: false,
    rating: 4.8,
    reviewCount: 124,
    enrolled_count: 1250,
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to React',
        description: 'Getting started with React',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '15 min',
        order: 0,
        isCompleted: false,
        resources: []
      },
      {
        id: '1-2',
        title: 'Components and JSX',
        description: 'Understanding React components',
        videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        duration: '20 min',
        order: 1,
        isCompleted: false,
        resources: []
      }
    ],
    skills: ['React', 'JavaScript', 'JSX', 'Components'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'published'
  },
  {
    id: '2',
    title: 'Advanced TypeScript',
    description: 'Master TypeScript for large-scale applications with advanced patterns',
    thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Jane Smith',
    instructorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    duration: '8 hours',
    level: 'Advanced',
    category: 'Programming',
    price: 49.99,
    isPremium: true,
    rating: 4.9,
    reviewCount: 89,
    enrolled_count: 567,
    lessons: [
      {
        id: '2-1',
        title: 'Advanced Types',
        description: 'Working with complex TypeScript types',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '25 min',
        order: 0,
        isCompleted: false,
        resources: []
      }
    ],
    skills: ['TypeScript', 'JavaScript', 'Node.js', 'Type Safety'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    status: 'published'
  },
  {
    id: '3',
    title: 'UI/UX Design Principles',
    description: 'Learn modern design principles and create beautiful user interfaces',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Sarah Wilson',
    instructorAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100',
    duration: '5 hours',
    level: 'Intermediate',
    category: 'Design',
    price: 29.99,
    isPremium: false,
    rating: 4.7,
    reviewCount: 156,
    enrolled_count: 890,
    lessons: [
      {
        id: '3-1',
        title: 'Design Fundamentals',
        description: 'Basic principles of good design',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '18 min',
        order: 0,
        isCompleted: false,
        resources: []
      }
    ],
    skills: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    status: 'published'
  },
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Complete guide to data science with Python and popular libraries',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Mike Johnson',
    instructorAvatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
    duration: '12 hours',
    level: 'Intermediate',
    category: 'Data Science',
    price: 79.99,
    isPremium: true,
    rating: 4.8,
    reviewCount: 203,
    enrolled_count: 445,
    lessons: [
      {
        id: '4-1',
        title: 'Python Basics for Data Science',
        description: 'Getting started with Python',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '30 min',
        order: 0,
        isCompleted: false,
        resources: []
      }
    ],
    skills: ['Python', 'Pandas', 'NumPy', 'Data Analysis'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    status: 'published'
  }
];

export const mockBadges: Badge[] = [
  {
    id: 'first-course',
    name: 'First Steps',
    description: 'Complete your first course',
    icon: '🎯',
    color: 'blue',
    requirement: 'Complete 1 course'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Join the platform',
    icon: '🐦',
    color: 'green',
    requirement: 'Sign up'
  },
  {
    id: 'dedicated-learner',
    name: 'Dedicated Learner',
    description: 'Complete 5 courses',
    icon: '📚',
    color: 'purple',
    requirement: 'Complete 5 courses'
  },
  {
    id: 'speed-runner',
    name: 'Speed Runner',
    description: 'Complete a course in one day',
    icon: '⚡',
    color: 'yellow',
    requirement: 'Complete course in 24h'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 100% on 3 quizzes',
    icon: '💯',
    color: 'gold',
    requirement: 'Perfect quiz scores'
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Reach level 10',
    icon: '🔍',
    color: 'indigo',
    requirement: 'Reach level 10'
  }
];