// Mock API service for frontend-only implementation
class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Mock API responses
  async register(email: string, password: string, name: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      token: `mock-token-${Date.now()}`,
      user: {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'student',
        xp: 0,
        level: 1
      }
    };
  }

  async login(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    if (email === 'admin@cosmic.com' && password === 'admin123') {
      return {
        token: 'mock-admin-token',
        user: {
          id: 'admin-1',
          email: 'admin@cosmic.com',
          name: 'Admin User',
          role: 'admin',
          xp: 0,
          level: 1
        }
      };
    }
    
    if (email === 'user@cosmic.com' && password === 'user123') {
      return {
        token: 'mock-student-token',
        user: {
          id: 'student-1',
          email: 'user@cosmic.com',
          name: 'Student User',
          role: 'student',
          xp: 150,
          level: 2
        }
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      return { user: JSON.parse(userData) };
    }
    throw new Error('No user found');
  }

  // Course methods
  async getCourses() {
    return { courses: [] };
  }

  async getCourse(id: string) {
    return { course: null };
  }

  async enrollInCourse(courseId: string) {
    return { enrollment: { id: Date.now(), courseId, userId: 'current-user' } };
  }

  async checkCourseAccess(courseId: string) {
    return { hasAccess: true };
  }

  // User methods
  async updateProgress(lessonId: string, completed: boolean) {
    return { progress: { lessonId, completed } };
  }

  async getUserEnrollments() {
    return { enrollments: [] };
  }

  // Payment methods
  async getStripeConfig() {
    return {
      publishableKey: 'pk_test_demo_key'
    };
  }

  async createPaymentIntent(courseId: string) {
    return {
      clientSecret: `pi_demo_${Date.now()}_secret`,
      paymentIntentId: `pi_demo_${Date.now()}`
    };
  }

  async confirmPayment(paymentIntentId: string) {
    return { success: true };
  }

  async getUserPayments() {
    return { payments: [] };
  }
}

export const apiService = new ApiService();