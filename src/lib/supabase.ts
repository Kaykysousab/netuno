import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'instructor' | 'student';
          avatar_url: string | null;
          xp: number;
          level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: 'admin' | 'instructor' | 'student';
          avatar_url?: string | null;
          xp?: number;
          level?: number;
        };
        Update: {
          email?: string;
          name?: string;
          role?: 'admin' | 'instructor' | 'student';
          avatar_url?: string | null;
          xp?: number;
          level?: number;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          thumbnail: string | null;
          instructor: string;
          price: number;
          category: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          duration: string;
          status: 'draft' | 'published';
          enrolled_count: number;
          rating: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description: string;
          thumbnail?: string | null;
          instructor: string;
          price?: number;
          category: string;
          level: 'beginner' | 'intermediate' | 'advanced';
          duration: string;
          status?: 'draft' | 'published';
          created_by?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          thumbnail?: string | null;
          instructor?: string;
          price?: number;
          category?: string;
          level?: 'beginner' | 'intermediate' | 'advanced';
          duration?: string;
          status?: 'draft' | 'published';
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          video_url: string | null;
          duration: number | null;
          order_index: number;
          is_free: boolean;
          created_at: string;
        };
        Insert: {
          course_id: string;
          title: string;
          description?: string | null;
          video_url?: string | null;
          duration?: number | null;
          order_index: number;
          is_free?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          video_url?: string | null;
          duration?: number | null;
          order_index?: number;
          is_free?: boolean;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
          completed_at: string | null;
          progress: number;
        };
        Insert: {
          user_id: string;
          course_id: string;
        };
        Update: {
          completed_at?: string | null;
          progress?: number;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          watch_time: number;
        };
        Insert: {
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          watch_time?: number;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          watch_time?: number;
        };
      };
      badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          badge_type: string;
        };
      };
    };
  };
};
