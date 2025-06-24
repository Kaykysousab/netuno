import { supabase } from '../lib/supabase';
import type { Profile, Course, Lesson, Enrollment, Payment } from '../lib/supabase';

export class SupabaseService {
  // Auth methods
  static async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  }

  // Profile methods
  static async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAllProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Course methods
  static async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAllCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        lessons (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateCourse(courseId: string, updates: Partial<Course>) {
    const { data, error } = await supabase
      .from('courses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteCourse(courseId: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) throw error;
  }

  // Lesson methods
  static async createLesson(lesson: Omit<Lesson, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateLesson(lessonId: string, updates: Partial<Lesson>) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', lessonId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteLesson(lessonId: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) throw error;
  }

  static async getCourseLessons(courseId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Enrollment methods
  static async enrollInCourse(userId: string, courseId: string, paymentData?: {
    amount: number;
    paymentId?: string;
  }) {
    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        payment_status: paymentData ? 'pending' : 'approved',
        payment_id: paymentData?.paymentId,
        amount_paid: paymentData?.amount,
        access_granted: !paymentData, // Free courses get immediate access
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserEnrollments(userId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async updateEnrollmentAccess(enrollmentId: string, accessGranted: boolean) {
    const { data, error } = await supabase
      .from('enrollments')
      .update({ access_granted: accessGranted })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Payment methods
  static async createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePaymentStatus(paymentId: string, status: Payment['status']) {
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('mercadopago_payment_id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserPayments(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        courses (title, thumbnail)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Progress methods
  static async updateLessonProgress(userId: string, lessonId: string, completed: boolean) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  // Check if user has access to course
  static async hasAccessToCourse(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('enrollments')
      .select('access_granted')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('access_granted', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
}