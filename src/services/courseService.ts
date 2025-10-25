import { apiService } from './api';

export class CourseService {
  static async getAllCourses() {
    try {
      const response = await apiService.getCourses();
      return response.courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  static async getCourseById(id: string) {
    try {
      const response = await apiService.getCourse(id);
      return response.course;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  }

  static async enrollInCourse(courseId: string) {
    try {
      const response = await apiService.enrollInCourse(courseId);
      return response.enrollment;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }

  static async checkAccess(courseId: string) {
    try {
      const response = await apiService.checkCourseAccess(courseId);
      return response.hasAccess;
    } catch (error) {
      console.error('Error checking course access:', error);
      return false;
    }
  }
}