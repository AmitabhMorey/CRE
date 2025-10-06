export interface User {
  uid: string;
  email: string;
  displayName?: string;
  interests: string[];
  enrolledCourses: string[];
  favoriteCourses: string[];
  completedCourses: string[];
  isAdmin?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  instructor: string;
  rating: number;
  reviewCount?: number;
  thumbnail?: string;
  imageUrl?: string;
  url?: string;
  lessons?: number;
  enrolled?: number;
  students?: number;
  price?: number;
  tags?: string[];
}

export interface UserProgress {
  courseId: string;
  progress: number;
  lastAccessed: number;
  completedLessons: number;
  totalLessons: number;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
