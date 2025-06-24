// Utility functions for localStorage management
export class StorageManager {
  private static readonly KEYS = {
    USERS: 'cosmic_users',
    COURSES: 'cosmic_courses',
    CURRENT_USER: 'cosmic_current_user',
    USER_PROGRESS: 'cosmic_user_progress',
  };

  // Users management
  static saveUsers(users: any[]): void {
    try {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  static getUsers(): any[] {
    try {
      const users = localStorage.getItem(this.KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  static addUser(user: any): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  static updateUser(userId: string, updates: any): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
    }
  }

  static getUserById(userId: string): any | null {
    const users = this.getUsers();
    return users.find(u => u.id === userId) || null;
  }

  // Courses management
  static saveCourses(courses: any[]): void {
    try {
      localStorage.setItem(this.KEYS.COURSES, JSON.stringify(courses));
    } catch (error) {
      console.error('Error saving courses:', error);
    }
  }

  static getCourses(): any[] {
    try {
      const courses = localStorage.getItem(this.KEYS.COURSES);
      return courses ? JSON.parse(courses) : [];
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  }

  static addCourse(course: any): void {
    const courses = this.getCourses();
    courses.push(course);
    this.saveCourses(courses);
  }

  static updateCourse(courseId: string, updates: any): void {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex !== -1) {
      courses[courseIndex] = { ...courses[courseIndex], ...updates };
      this.saveCourses(courses);
    }
  }

  static deleteCourse(courseId: string): void {
    const courses = this.getCourses();
    const filteredCourses = courses.filter(c => c.id !== courseId);
    this.saveCourses(filteredCourses);
  }

  // Current user management
  static saveCurrentUser(user: any): void {
    try {
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  static getCurrentUser(): any | null {
    try {
      const user = localStorage.getItem(this.KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  }

  // User progress management
  static saveUserProgress(userId: string, progress: any): void {
    try {
      const allProgress = this.getAllUserProgress();
      allProgress[userId] = progress;
      localStorage.setItem(this.KEYS.USER_PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  static getUserProgress(userId: string): any {
    try {
      const allProgress = this.getAllUserProgress();
      return allProgress[userId] || {
        enrolledCourses: [],
        completedLessons: [],
        badges: [],
        xp: 0,
        level: 1,
        courseProgress: {}
      };
    } catch (error) {
      console.error('Error loading user progress:', error);
      return {
        enrolledCourses: [],
        completedLessons: [],
        badges: [],
        xp: 0,
        level: 1,
        courseProgress: {}
      };
    }
  }

  private static getAllUserProgress(): any {
    try {
      const progress = localStorage.getItem(this.KEYS.USER_PROGRESS);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Error loading all user progress:', error);
      return {};
    }
  }

  // Utility methods
  static clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  static exportData(): string {
    const data = {
      users: this.getUsers(),
      courses: this.getCourses(),
      userProgress: this.getAllUserProgress(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.users) this.saveUsers(data.users);
      if (data.courses) this.saveCourses(data.courses);
      if (data.userProgress) {
        localStorage.setItem(this.KEYS.USER_PROGRESS, JSON.stringify(data.userProgress));
      }
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}