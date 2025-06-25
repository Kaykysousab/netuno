// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth methods
  async register(email: string, password: string, name: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Course methods
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  async enrollInCourse(courseId: string) {
    return this.request(`/courses/${courseId}/enroll`, {
      method: 'POST'
    });
  }

  async checkCourseAccess(courseId: string) {
    return this.request(`/courses/${courseId}/access`);
  }

  // User methods
  async updateProgress(lessonId: string, completed: boolean) {
    return this.request('/users/progress', {
      method: 'POST',
      body: JSON.stringify({ lessonId, completed })
    });
  }

  async getUserEnrollments() {
    return this.request('/users/enrollments');
  }

  // Admin methods
  async getAllUsers() {
    return this.request('/users');
  }

  async createCourse(courseData: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }

  async updateCourse(courseId: string, courseData: any) {
    return this.request(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData)
    });
  }

  async deleteCourse(courseId: string) {
    return this.request(`/courses/${courseId}`, {
      method: 'DELETE'
    });
  }
}

export const apiService = new ApiService();