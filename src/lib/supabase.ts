import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'student' | 'instructor' | 'admin';
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructor: string;
  instructor_avatar?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  price: number;
  is_premium: boolean;
  rating: number;
  review_count: number;
  enrolled_count: number;
  skills: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  video_url?: string;
  duration: string;
  order_index: number;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  payment_status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  payment_id?: string;
  amount_paid?: number;
  enrolled_at: string;
  access_granted: boolean;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  mercadopago_payment_id?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}