import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

export const adminService = {
  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateUser(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  },

  async getUserStats(userId: string) {
    const [enrollments, completedLessons, badges] = await Promise.all([
      supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', userId),
      supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true),
      supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId)
    ]);

    return {
      enrolledCourses: enrollments.data?.length || 0,
      completedLessons: completedLessons.data?.length || 0,
      badges: badges.data?.length || 0
    };
  },

  async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createCourse(course: Database['public']['Tables']['courses']['Insert']) {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...course,
        created_by: user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourse(courseId: string, updates: Database['public']['Tables']['courses']['Update']) {
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCourse(courseId: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) throw error;
  },

  async getCourseLessons(courseId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createLesson(lesson: Database['public']['Tables']['lessons']['Insert']) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateLesson(lessonId: string, updates: Database['public']['Tables']['lessons']['Update']) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLesson(lessonId: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) throw error;
  },

  async getPlatformStats() {
    const [users, courses, enrollments] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('enrollments').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalUsers: users.count || 0,
      totalCourses: courses.count || 0,
      totalEnrollments: enrollments.count || 0
    };
  }
};
