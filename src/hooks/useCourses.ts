import { useState, useEffect } from 'react';
import { ref, get, set, update, push } from 'firebase/database';
import { database } from '../config/firebase';
import { Course, Review, UserProgress } from '../types';
import { useAuth } from '../context/AuthContext';
import { getCourses, getCoursesFilteredByInterests, getRecommendedCoursesByInterests } from '../services/courseService';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { userData, currentUser } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      console.log('🔄 [useCourses] Starting to fetch courses using courseService...');
      setLoading(true);
      
      // Use the updated courseService to fetch from Firebase
      const result = await getCourses(null, 1000); // Get all courses
      const { courses: fetchedCourses } = result;
      
      console.log(`✅ [useCourses] Successfully fetched ${fetchedCourses.length} courses`);
      
      if (fetchedCourses.length > 0) {
        setCourses(fetchedCourses);
      } else {
        console.log('⚠️ [useCourses] No courses found, initializing sample courses...');
        await initializeSampleCourses();
      }
      
    } catch (error) {
      console.error('❌ [useCourses] Error fetching courses:', error);
      
      // Fallback to sample courses if Firebase fails
      console.log('🔄 [useCourses] Falling back to sample courses...');
      await initializeSampleCourses();
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleCourses = async () => {
    const sampleCourses: Omit<Course, 'id'>[] = [
      {
        title: 'Complete Python Programming',
        description: 'Master Python from basics to advanced concepts including data structures, OOP, and more.',
        category: 'programming',
        difficulty: 'beginner',
        duration: '12 weeks',
        instructor: 'Dr. Sarah Johnson',
        rating: 4.8,
        reviewCount: 1250,
        thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
        lessons: 120,
        enrolled: 15000
      },
      {
        title: 'UI/UX Design Masterclass',
        description: 'Learn modern design principles, user research, prototyping, and create stunning interfaces.',
        category: 'design',
        difficulty: 'intermediate',
        duration: '10 weeks',
        instructor: 'Alex Chen',
        rating: 4.9,
        reviewCount: 980,
        thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
        lessons: 85,
        enrolled: 12500
      },
      {
        title: 'Digital Marketing Strategy',
        description: 'Complete guide to SEO, social media marketing, content strategy, and analytics.',
        category: 'marketing',
        difficulty: 'beginner',
        duration: '8 weeks',
        instructor: 'Maria Rodriguez',
        rating: 4.7,
        reviewCount: 1100,
        thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
        lessons: 70,
        enrolled: 18000
      },
      {
        title: 'Data Science with Python',
        description: 'Learn data analysis, machine learning, and visualization with Python, Pandas, and Scikit-learn.',
        category: 'data-science',
        difficulty: 'advanced',
        duration: '16 weeks',
        instructor: 'Dr. Michael Park',
        rating: 4.9,
        reviewCount: 850,
        thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
        lessons: 150,
        enrolled: 8500
      },
      {
        title: 'Business Strategy Fundamentals',
        description: 'Essential business strategy concepts, competitive analysis, and strategic planning.',
        category: 'business',
        difficulty: 'beginner',
        duration: '6 weeks',
        instructor: 'James Wilson',
        rating: 4.6,
        reviewCount: 620,
        thumbnail: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
        lessons: 50,
        enrolled: 9200
      },
      {
        title: 'Professional Photography',
        description: 'Master camera settings, composition, lighting, and post-processing techniques.',
        category: 'photography',
        difficulty: 'intermediate',
        duration: '9 weeks',
        instructor: 'Emma Davis',
        rating: 4.8,
        reviewCount: 740,
        thumbnail: 'https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg',
        lessons: 65,
        enrolled: 7800
      },
      {
        title: 'Music Production Complete',
        description: 'Learn to produce, mix, and master music using industry-standard DAWs and techniques.',
        category: 'music',
        difficulty: 'intermediate',
        duration: '14 weeks',
        instructor: 'Ryan Martinez',
        rating: 4.7,
        reviewCount: 530,
        thumbnail: 'https://images.pexels.com/photos/1337380/pexels-photo-1337380.jpeg',
        lessons: 95,
        enrolled: 6400
      },
      {
        title: 'Creative Writing Workshop',
        description: 'Develop your writing skills with fiction, non-fiction, and storytelling techniques.',
        category: 'writing',
        difficulty: 'beginner',
        duration: '8 weeks',
        instructor: 'Lisa Thompson',
        rating: 4.8,
        reviewCount: 680,
        thumbnail: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg',
        lessons: 60,
        enrolled: 5900
      },
      {
        title: 'Advanced JavaScript & React',
        description: 'Deep dive into modern JavaScript, React, hooks, state management, and advanced patterns.',
        category: 'programming',
        difficulty: 'advanced',
        duration: '12 weeks',
        instructor: 'David Kim',
        rating: 4.9,
        reviewCount: 1420,
        thumbnail: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg',
        lessons: 130,
        enrolled: 16500
      },
      {
        title: 'Graphic Design Essentials',
        description: 'Master Adobe Creative Suite, typography, color theory, and visual communication.',
        category: 'design',
        difficulty: 'beginner',
        duration: '10 weeks',
        instructor: 'Sophie Anderson',
        rating: 4.7,
        reviewCount: 890,
        thumbnail: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
        lessons: 75,
        enrolled: 11200
      }
    ];

    const coursesRef = ref(database, 'courses');
    const coursesObj: Record<string, any> = {};

    sampleCourses.forEach((course, index) => {
      const id = `course_${index + 1}`;
      coursesObj[id] = course;
    });

    await set(coursesRef, coursesObj);
    await fetchCourses();
  };

  const getRecommendedCourses = async () => {
    if (!userData?.interests || userData.interests.length === 0) {
      console.log('📋 No user interests found, returning first 6 courses');
      return courses.slice(0, 6);
    }

    try {
      console.log('🎯 Getting recommended courses for user interests:', userData.interests);
      const recommendedCourses = await getRecommendedCoursesByInterests(userData.interests, 6);
      return recommendedCourses;
    } catch (error) {
      console.error('❌ Error getting recommended courses, falling back to basic filter:', error);
      
      // Fallback to simple category matching
      const recommended = courses.filter(course =>
        userData.interests.some(interest => 
          interest.toLowerCase() === course.category.toLowerCase()
        )
      );

      return recommended.length > 0 ? recommended.slice(0, 6) : courses.slice(0, 6);
    }
  };

  const getCoursesByInterests = async (interests: string[]) => {
    try {
      console.log('🔍 Fetching courses filtered by interests:', interests);
      const filteredCourses = await getCoursesFilteredByInterests(interests);
      return filteredCourses;
    } catch (error) {
      console.error('❌ Error filtering courses by interests:', error);
      return courses;
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!currentUser || !userData) return;

    const enrolledCourses = [...(userData.enrolledCourses || []), courseId];
    const userRef = ref(database, `users/${currentUser.uid}`);
    await update(userRef, { enrolledCourses });

    const progressRef = ref(database, `progress/${currentUser.uid}/${courseId}`);
    const progress: UserProgress = {
      courseId,
      progress: 0,
      lastAccessed: Date.now(),
      completedLessons: 0,
      totalLessons: courses.find(c => c.id === courseId)?.lessons || 0
    };
    await set(progressRef, progress);
  };

  const toggleFavorite = async (courseId: string) => {
    if (!currentUser || !userData) return;

    const favoriteCourses = userData.favoriteCourses?.includes(courseId)
      ? userData.favoriteCourses.filter(id => id !== courseId)
      : [...(userData.favoriteCourses || []), courseId];

    const userRef = ref(database, `users/${currentUser.uid}`);
    await update(userRef, { favoriteCourses });
  };

  const addReview = async (courseId: string, rating: number, comment: string) => {
    if (!currentUser || !userData) return;

    const reviewsRef = ref(database, `reviews/${courseId}`);
    const newReviewRef = push(reviewsRef);

    const review: Review = {
      id: newReviewRef.key!,
      courseId,
      userId: currentUser.uid,
      userName: userData.displayName || 'Anonymous',
      rating,
      comment,
      timestamp: Date.now()
    };

    await set(newReviewRef, review);

    const courseReviews = await getCourseReviews(courseId);
    const avgRating = (courseReviews.reduce((acc, r) => acc + r.rating, 0) + rating) / (courseReviews.length + 1);

    const courseRef = ref(database, `courses/${courseId}`);
    await update(courseRef, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: courseReviews.length + 1
    });
  };

  const getCourseReviews = async (courseId: string): Promise<Review[]> => {
    const reviewsRef = ref(database, `reviews/${courseId}`);
    const snapshot = await get(reviewsRef);

    if (!snapshot.exists()) return [];

    const reviewsData = snapshot.val();
    return Object.values(reviewsData);
  };

  const updateProgress = async (courseId: string, completedLessons: number, totalLessons: number) => {
    if (!currentUser) return;

    const progress = Math.round((completedLessons / totalLessons) * 100);
    const progressRef = ref(database, `progress/${currentUser.uid}/${courseId}`);

    await update(progressRef, {
      progress,
      completedLessons,
      lastAccessed: Date.now()
    });

    if (progress === 100) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const completedCourses = [...(userData?.completedCourses || []), courseId];
      await update(userRef, { completedCourses });
    }
  };

  const getUserProgress = async (courseId: string): Promise<UserProgress | null> => {
    if (!currentUser) return null;

    const progressRef = ref(database, `progress/${currentUser.uid}/${courseId}`);
    const snapshot = await get(progressRef);

    return snapshot.exists() ? snapshot.val() : null;
  };

  return {
    courses,
    loading,
    getRecommendedCourses,
    getCoursesByInterests,
    enrollInCourse,
    toggleFavorite,
    addReview,
    getCourseReviews,
    updateProgress,
    getUserProgress,
    refreshCourses: fetchCourses
  };
};
