import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

export const studentService = {
  async getMyProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateMyProfile(updates: Database['public']['Tables']['profiles']['Update']) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMyEnrollments() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (*)
      `)
      .eq('user_id', user.id);

    if (error) throw error;
    return data || [];
  },

  async enrollInCourse(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Already enrolled in this course');
      }
      throw error;
    }

    await supabase.rpc('increment_enrolled_count', { course_id: courseId });

    return data;
  },

  async getMyProgress(courseId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getLessonProgress(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async markLessonComplete(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    const profile = await this.getMyProfile();
    if (profile) {
      const newXp = profile.xp + 50;
      const newLevel = Math.floor(newXp / 100) + 1;

      await this.updateMyProfile({
        xp: newXp,
        level: newLevel
      });
    }

    return data;
  },

  async getMyBadges() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', user.id)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMyStats() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const [profile, enrollments, completedLessons, badges] = await Promise.all([
      this.getMyProfile(),
      this.getMyEnrollments(),
      supabase
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true),
      this.getMyBadges()
    ]);

    return {
      profile,
      enrolledCourses: enrollments.length,
      completedLessons: completedLessons.data?.length || 0,
      badges: badges.length,
      xp: profile?.xp || 0,
      level: profile?.level || 1
    };
  }
};
