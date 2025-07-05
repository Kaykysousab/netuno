import { Course, User } from '../types';

export class StorageManager {
  private static readonly COURSES_KEY = 'cosmic_learning_courses';
  private static readonly USERS_KEY = 'cosmic_learning_users';
  private static readonly USER_PROGRESS_KEY = 'cosmic_learning_user_progress';
  private static readonly ENROLLMENTS_KEY = 'cosmic_learning_enrollments';

  // Course management
  static getCourses(): Course[] {
    try {
      const stored = localStorage.getItem(this.COURSES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading courses from storage:', error);
      return [];
    }
  }

  static saveCourses(courses: Course[]): void {
    try {
      localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving courses to storage:', error);
    }
  }

  // User management
  static getUsers(): User[] {
    try {
      const stored = localStorage.getItem(this.USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return [];
    }
  }

  static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  // User progress management
  static getUserProgress(userId: string): any {
    try {
      const stored = localStorage.getItem(this.USER_PROGRESS_KEY);
      const allProgress = stored ? JSON.parse(stored) : {};
      return allProgress[userId] || { completedLessons: [], enrolledCourses: [] };
    } catch (error) {
      console.error('Error loading user progress from storage:', error);
      return { completedLessons: [], enrolledCourses: [] };
    }
  }

  static saveUserProgress(userId: string, progress: any): void {
    try {
      const stored = localStorage.getItem(this.USER_PROGRESS_KEY);
      const allProgress = stored ? JSON.parse(stored) : {};
      allProgress[userId] = progress;
      localStorage.setItem(this.USER_PROGRESS_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving user progress to storage:', error);
    }
  }

  // Enrollment management
  static getEnrollments(): any[] {
    try {
      const stored = localStorage.getItem(this.ENROLLMENTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading enrollments from storage:', error);
      return [];
    }
  }

  static saveEnrollments(enrollments: any[]): void {
    try {
      localStorage.setItem(this.ENROLLMENTS_KEY, JSON.stringify(enrollments));
    } catch (error) {
      console.error('Error saving enrollments to storage:', error);
    }
  }

  static addEnrollment(userId: string, courseId: string): void {
    try {
      const enrollments = this.getEnrollments();
      const existingEnrollment = enrollments.find(
        e => e.userId === userId && e.courseId === courseId
      );

      if (!existingEnrollment) {
        enrollments.push({
          id: Date.now().toString(),
          userId,
          courseId,
          enrolledAt: new Date().toISOString(),
          accessGranted: true
        });
        this.saveEnrollments(enrollments);
      }
    } catch (error) {
      console.error('Error adding enrollment:', error);
    }
  }

  // Data export/import
  static exportData(): string {
    try {
      const data = {
        courses: this.getCourses(),
        users: this.getUsers(),
        userProgress: localStorage.getItem(this.USER_PROGRESS_KEY),
        enrollments: this.getEnrollments(),
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      return '{}';
    }
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.courses) {
        this.saveCourses(data.courses);
      }
      
      if (data.users) {
        this.saveUsers(data.users);
      }
      
      if (data.userProgress) {
        localStorage.setItem(this.USER_PROGRESS_KEY, 
          typeof data.userProgress === 'string' ? data.userProgress : JSON.stringify(data.userProgress)
        );
      }
      
      if (data.enrollments) {
        this.saveEnrollments(data.enrollments);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Clear all data
  static clearAllData(): void {
    try {
      localStorage.removeItem(this.COURSES_KEY);
      localStorage.removeItem(this.USERS_KEY);
      localStorage.removeItem(this.USER_PROGRESS_KEY);
      localStorage.removeItem(this.ENROLLMENTS_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  // Utility methods
  static isUserEnrolled(userId: string, courseId: string): boolean {
    try {
      const enrollments = this.getEnrollments();
      return enrollments.some(e => e.userId === userId && e.courseId === courseId && e.accessGranted);
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  }

  static getUserEnrolledCourses(userId: string): string[] {
    try {
      const enrollments = this.getEnrollments();
      return enrollments
        .filter(e => e.userId === userId && e.accessGranted)
        .map(e => e.courseId);
    } catch (error) {
      console.error('Error getting user enrolled courses:', error);
      return [];
    }
  }

  static updateLessonProgress(userId: string, lessonId: string, completed: boolean): void {
    try {
      const progress = this.getUserProgress(userId);
      
      if (completed && !progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      } else if (!completed) {
        progress.completedLessons = progress.completedLessons.filter((id: string) => id !== lessonId);
      }
      
      this.saveUserProgress(userId, progress);
    } catch (error) {
      console.error('Error updating lesson progress:', error);
    }
  }
}