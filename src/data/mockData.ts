import { Course, Badge, Quiz } from '../types';

// Mock quiz data
const mockQuizzes: { [key: string]: Quiz } = {
  '1': {
    id: 'quiz-1',
    questions: [
      {
        id: 'q1',
        question: 'O que é React?',
        options: [
          'Uma linguagem de programação',
          'Uma biblioteca JavaScript para construir interfaces de usuário',
          'Um banco de dados',
          'Um servidor web'
        ],
        correctAnswer: 1,
        explanation: 'React é uma biblioteca JavaScript desenvolvida pelo Facebook para criar interfaces de usuário interativas.'
      },
      {
        id: 'q2',
        question: 'Qual é a sintaxe usada no React para escrever HTML dentro do JavaScript?',
        options: [
          'HTML',
          'XML',
          'JSX',
          'CSS'
        ],
        correctAnswer: 2,
        explanation: 'JSX (JavaScript XML) é uma extensão de sintaxe para JavaScript que permite escrever HTML dentro do código JavaScript.'
      },
      {
        id: 'q3',
        question: 'Como você cria um componente funcional em React?',
        options: [
          'class MyComponent extends React.Component',
          'function MyComponent() { return <div>Hello</div>; }',
          'const MyComponent = React.createClass()',
          'React.component("MyComponent")'
        ],
        correctAnswer: 1,
        explanation: 'Componentes funcionais são criados como funções JavaScript que retornam JSX.'
      }
    ],
    passingScore: 70
  },
  '2': {
    id: 'quiz-2',
    questions: [
      {
        id: 'q4',
        question: 'O que são Generics em TypeScript?',
        options: [
          'Tipos específicos para números',
          'Uma forma de criar tipos reutilizáveis',
          'Funções especiais',
          'Classes abstratas'
        ],
        correctAnswer: 1,
        explanation: 'Generics permitem criar componentes reutilizáveis que podem trabalhar com diferentes tipos.'
      },
      {
        id: 'q5',
        question: 'Como você define um tipo union em TypeScript?',
        options: [
          'type MyType = string & number',
          'type MyType = string + number',
          'type MyType = string | number',
          'type MyType = string, number'
        ],
        correctAnswer: 2,
        explanation: 'O operador | é usado para criar tipos union que podem ser um de vários tipos.'
      }
    ],
    passingScore: 80
  }
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Fundamentals for Beginners',
    description: 'Master the basics of React development with hands-on projects and real-world examples. Learn components, state management, hooks, and modern React patterns.',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '6 hours',
    level: 'Beginner',
    category: 'Web Development',
    price: 49.99,
    isPremium: false,
    rating: 4.8,
    reviewCount: 342,
    enrolled_count: 1250,
    skills: ['React', 'JavaScript', 'JSX', 'Components', 'State Management', 'Hooks'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'published',
    lessons: [
      {
        id: '1',
        title: 'Introduction to React',
        description: 'Learn what React is, why it\'s popular, and how it fits into modern web development.',
        videoUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
        duration: '15 min',
        order: 1,
        isCompleted: false,
        quiz: mockQuizzes['1'],
        resources: [
          {
            id: '1',
            title: 'React Documentation',
            type: 'link',
            url: 'https://reactjs.org',
          },
          {
            id: '2',
            title: 'Course Slides - Introduction',
            type: 'pdf',
            url: 'https://example.com/slides1.pdf',
          }
        ]
      },
      {
        id: '2',
        title: 'Your First Component',
        description: 'Create your first React component and understand the component lifecycle.',
        videoUrl: 'https://www.youtube.com/watch?v=SqcY0GlETPk',
        duration: '20 min',
        order: 2,
        isCompleted: false,
        resources: [
          {
            id: '3',
            title: 'Component Examples',
            type: 'download',
            url: 'https://example.com/components.zip',
          }
        ]
      },
      {
        id: '3',
        title: 'Props and State',
        description: 'Understanding how to pass data between components and manage component state.',
        videoUrl: 'https://www.youtube.com/watch?v=IYvD9oBCuJI',
        duration: '25 min',
        order: 3,
        isCompleted: false,
        resources: []
      },
      {
        id: '4',
        title: 'Event Handling',
        description: 'Learn how to handle user interactions and events in React applications.',
        videoUrl: 'https://www.youtube.com/watch?v=Znqv84xi8Vs',
        duration: '18 min',
        order: 4,
        isCompleted: false,
        resources: []
      }
    ]
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into advanced TypeScript concepts, design patterns, and best practices for large-scale applications.',
    thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Michael Chen',
    instructorAvatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '8 hours',
    level: 'Advanced',
    category: 'Programming',
    price: 89.99,
    isPremium: true,
    rating: 4.9,
    reviewCount: 128,
    enrolled_count: 456,
    skills: ['TypeScript', 'Design Patterns', 'Advanced Types', 'Generics', 'Decorators'],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    status: 'published',
    lessons: [
      {
        id: '5',
        title: 'Generic Types Deep Dive',
        description: 'Master generic types and constraints in TypeScript for flexible, reusable code.',
        videoUrl: 'https://www.youtube.com/watch?v=nePDL5lQSE4',
        duration: '25 min',
        order: 1,
        isCompleted: false,
        quiz: mockQuizzes['2'],
        resources: [
          {
            id: '4',
            title: 'TypeScript Handbook - Generics',
            type: 'link',
            url: 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
          }
        ]
      },
      {
        id: '6',
        title: 'Advanced Type Manipulation',
        description: 'Learn utility types, mapped types, and conditional types.',
        videoUrl: 'https://www.youtube.com/watch?v=zhEQcX8fMzU',
        duration: '30 min',
        order: 2,
        isCompleted: false,
        resources: []
      },
      {
        id: '7',
        title: 'Decorators and Metadata',
        description: 'Understanding decorators and how to use them effectively.',
        videoUrl: 'https://www.youtube.com/watch?v=O6A-u_FoEX8',
        duration: '22 min',
        order: 3,
        isCompleted: false,
        resources: []
      }
    ]
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of great user interface and user experience design with practical exercises.',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Emma Wilson',
    instructorAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '5 hours',
    level: 'Beginner',
    category: 'Design',
    price: 39.99,
    isPremium: false,
    rating: 4.7,
    reviewCount: 289,
    enrolled_count: 892,
    skills: ['UI Design', 'UX Research', 'Prototyping', 'Figma', 'Design Systems'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    status: 'published',
    lessons: [
      {
        id: '8',
        title: 'Design Principles',
        description: 'Understanding core design principles like hierarchy, contrast, and balance.',
        videoUrl: 'https://www.youtube.com/watch?v=a5KYlHNKQB8',
        duration: '18 min',
        order: 1,
        isCompleted: false,
        resources: []
      },
      {
        id: '9',
        title: 'User Research Methods',
        description: 'Learn how to conduct user research and gather insights.',
        videoUrl: 'https://www.youtube.com/watch?v=Qq3OiHQ-HCU',
        duration: '22 min',
        order: 2,
        isCompleted: false,
        resources: []
      }
    ]
  },
  {
    id: '4',
    title: 'Python for Data Science',
    description: 'Learn Python programming specifically for data analysis, visualization, and machine learning applications.',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Dr. Alex Kumar',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '12 hours',
    level: 'Intermediate',
    category: 'Data Science',
    price: 79.99,
    isPremium: true,
    rating: 4.6,
    reviewCount: 456,
    enrolled_count: 678,
    skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    status: 'published',
    lessons: [
      {
        id: '10',
        title: 'Python Basics Review',
        description: 'Quick review of Python fundamentals for data science.',
        videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
        duration: '22 min',
        order: 1,
        isCompleted: false,
        resources: []
      },
      {
        id: '11',
        title: 'Introduction to Pandas',
        description: 'Learn the basics of data manipulation with Pandas.',
        videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
        duration: '28 min',
        order: 2,
        isCompleted: false,
        resources: []
      }
    ]
  },
  {
    id: '5',
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB.',
    thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'James Rodriguez',
    instructorAvatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '10 hours',
    level: 'Intermediate',
    category: 'Backend Development',
    price: 69.99,
    isPremium: false,
    rating: 4.5,
    reviewCount: 234,
    enrolled_count: 567,
    skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Authentication'],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    status: 'published',
    lessons: [
      {
        id: '12',
        title: 'Setting up Node.js Environment',
        description: 'Install and configure Node.js for backend development.',
        videoUrl: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
        duration: '15 min',
        order: 1,
        isCompleted: false,
        resources: []
      }
    ]
  },
  {
    id: '6',
    title: 'Mobile App Development with React Native',
    description: 'Create cross-platform mobile applications using React Native and modern development practices.',
    thumbnail: 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800',
    instructor: 'Lisa Park',
    instructorAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '14 hours',
    level: 'Intermediate',
    category: 'Mobile Development',
    price: 99.99,
    isPremium: true,
    rating: 4.8,
    reviewCount: 189,
    enrolled_count: 423,
    skills: ['React Native', 'Mobile Development', 'iOS', 'Android', 'Navigation'],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    status: 'published',
    lessons: [
      {
        id: '13',
        title: 'React Native Fundamentals',
        description: 'Understanding the basics of React Native development.',
        videoUrl: 'https://www.youtube.com/watch?v=0-S5a0eXPoc',
        duration: '20 min',
        order: 1,
        isCompleted: false,
        resources: []
      }
    ]
  }
];

export const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first lesson',
    icon: '🎯',
    color: 'purple',
    requirement: 'Complete 1 lesson',
  },
  {
    id: '2',
    name: 'Rising Star',
    description: 'Completed 5 lessons',
    icon: '⭐',
    color: 'yellow',
    requirement: 'Complete 5 lessons',
  },
  {
    id: '3',
    name: 'Course Crusher',
    description: 'Completed your first course',
    icon: '🏆',
    color: 'gold',
    requirement: 'Complete 1 course',
  },
  {
    id: '4',
    name: 'Knowledge Seeker',
    description: 'Enrolled in 3 or more courses',
    icon: '📚',
    color: 'blue',
    requirement: 'Enroll in 3 courses',
  },
  {
    id: '5',
    name: 'Speed Learner',
    description: 'Completed a course in under 24 hours',
    icon: '⚡',
    color: 'cyan',
    requirement: 'Complete course quickly',
  },
  {
    id: '6',
    name: 'Quiz Master',
    description: 'Passed 10 quizzes with 90%+ score',
    icon: '🧠',
    color: 'green',
    requirement: 'Pass 10 quizzes with high score',
  }
];