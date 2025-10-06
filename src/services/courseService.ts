import { ref, get, child } from 'firebase/database';
import { database } from '../config/firebase';
import { Course } from '../types';

export const getCourses = async (startAtKey: string | null = null, pageSize: number = 12): Promise<{
  courses: Course[];
  lastKey: string | null;
  hasMore: boolean;
}> => {
  try {
    console.log('🔥 Fetching courses from Firebase Realtime Database...');
    console.log('📡 Database URL: https://sem-3-amitabh-default-rtdb.firebaseio.com');
    
    const dbRef = ref(database);
    
    // Test Firebase connection first
    console.log('🧪 Testing Firebase connection...');
    
    // Try to fetch from courses node first, then fallback to root
    let snapshot;
    try {
      snapshot = await get(child(dbRef, 'courses'));
      if (!snapshot.exists()) {
        console.log('📡 No courses node found, trying root level...');
        snapshot = await get(child(dbRef, '/'));
      }
    } catch (permissionError) {
      console.warn('⚠️ Permission error accessing courses, trying root:', permissionError);
      snapshot = await get(child(dbRef, '/'));
    }
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('📊 Raw Firebase data structure:', Object.keys(data));
      
      // Filter and map courses (looking for numeric keys 0, 1, 2, etc.)
      const courseEntries = Object.entries(data)
        .filter(([key]) => !isNaN(Number(key))) // Only numeric keys are courses
        .sort(([a], [b]) => Number(a) - Number(b)) // Sort by numeric order
        .map(([id, courseData]: [string, any]) => {
          console.log(`📚 Processing course ${id}:`, courseData);
          
          // Map Firebase fields to our Course interface based on your structure
          const difficulty = courseData.difficulty || 'Intermediate';
          const normalizedDifficulty = ['beginner', 'intermediate', 'advanced', 'expert', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(difficulty) 
            ? difficulty as Course['difficulty']
            : 'intermediate' as Course['difficulty'];

          // Handle multiple possible field names from Firebase
          const title = courseData.title || courseData.course_name || courseData.name || `Course ${id}`;
          const description = courseData.description || courseData.course_description || `Learn ${courseData.category || 'concepts'} and practical exercises in this ${difficulty} course.`;
          const instructor = courseData.instructor || courseData.course_author || courseData.author || `Instructor ${Math.ceil(Number(id) / 5)}`;
          const duration = courseData.duration || courseData.course_duration || '10 hours';
          const category = courseData.category || 'Programming';
          
          const course: Course = {
            id: id,
            title: title,
            description: description,
            instructor: instructor,
            duration: duration,
            imageUrl: courseData.imageUrl || courseData.url || courseData.course_image || `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(title)}`,
            url: courseData.url || `https://example.com/course/${id}`,
            difficulty: normalizedDifficulty,
            price: Number(courseData.price || courseData.course_price) || 0,
            rating: Number(courseData.rating || courseData.course_rating) || 4.5,
            students: Number(courseData.students || courseData.course_students) || (1000 + (Number(id) * 100)),
            lessons: Number(courseData.lessons || courseData.course_lessons) || (20 + (Number(id) % 30)),
            category: category,
            tags: courseData.tags || [category.toLowerCase()]
          };
          
          return course;
        });
      
      console.log(`✅ Successfully processed ${courseEntries.length} courses from Firebase`);
      
      // Implement client-side pagination
      const startIndex = startAtKey ? courseEntries.findIndex(course => course.id === startAtKey) + 1 : 0;
      const endIndex = startIndex + pageSize;
      const paginatedCourses = courseEntries.slice(startIndex, endIndex);
      const hasMore = endIndex < courseEntries.length;
      const lastKey = paginatedCourses.length > 0 ? paginatedCourses[paginatedCourses.length - 1].id : null;
      
      console.log('📄 Pagination result:', { 
        totalCourses: courseEntries.length,
        startIndex,
        endIndex,
        returnedCourses: paginatedCourses.length,
        lastKey,
        hasMore
      });
      
      return {
        courses: paginatedCourses,
        lastKey,
        hasMore
      };
    } else {
      console.log('⚠️ No data found in Firebase database, using fallback data');
      return getFallbackCourses(startAtKey, pageSize);
    }
  } catch (error) {
    console.error('❌ Error fetching courses from Firebase:', error);
    console.log('🔄 Using fallback mock data due to error...');
    return getFallbackCourses(startAtKey, pageSize);
  }
};

// Fallback courses function
const getFallbackCourses = (startAtKey: string | null = null, pageSize: number = 12) => {
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming with hands-on exercises and real-world projects.',
      instructor: 'Sarah Johnson',
      duration: '8 hours',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=JavaScript+Fundamentals',
      url: 'https://example.com/course/1',
      difficulty: 'beginner',
      price: 49,
      rating: 4.8,
      students: 1250,
      lessons: 24,
      category: 'Programming',
      tags: ['javascript', 'programming', 'beginner', 'web-development']
    },
    {
      id: '2',
      title: 'React Development Mastery',
      description: 'Build modern web applications with React, including hooks, context, and state management.',
      instructor: 'Mike Chen',
      duration: '12 hours',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=React+Development',
      url: 'https://example.com/course/2',
      difficulty: 'intermediate',
      price: 79,
      rating: 4.9,
      students: 890,
      lessons: 32,
      category: 'Programming',
      tags: ['react', 'javascript', 'frontend', 'web-development']
    },
    {
      id: '3',
      title: 'UI/UX Design Principles',
      description: 'Learn the fundamentals of user interface and user experience design for digital products.',
      instructor: 'Emma Davis',
      duration: '10 hours',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=UI%2FUX+Design',
      url: 'https://example.com/course/3',
      difficulty: 'beginner',
      price: 59,
      rating: 4.7,
      students: 1100,
      lessons: 28,
      category: 'Design',
      tags: ['ui', 'ux', 'design', 'figma', 'prototyping']
    },
    {
      id: '4',
      title: 'Digital Marketing Strategy',
      description: 'Comprehensive guide to digital marketing including SEO, social media, and content marketing.',
      instructor: 'David Wilson',
      duration: '15 hours',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Digital+Marketing',
      url: 'https://example.com/course/4',
      difficulty: 'intermediate',
      price: 89,
      rating: 4.6,
      students: 750,
      lessons: 35,
      category: 'Marketing',
      tags: ['marketing', 'seo', 'social-media', 'content-marketing']
    },
    {
      id: '5',
      title: 'Python for Data Science',
      description: 'Learn Python programming specifically for data analysis, visualization, and machine learning.',
      instructor: 'Dr. Lisa Park',
      duration: '20 hours',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Python+Data+Science',
      url: 'https://example.com/course/5',
      difficulty: 'intermediate',
      price: 99,
      rating: 4.9,
      students: 1500,
      lessons: 45,
      category: 'Data Science',
      tags: ['python', 'data-science', 'machine-learning', 'pandas', 'numpy']
    },
    {
      id: '6',
      title: 'Photography Masterclass',
      description: 'Advanced photography techniques covering composition, lighting, and post-processing.',
      instructor: 'Alex Rodriguez',
      duration: '18 hours',
      imageUrl: 'https://placehold.co/600x400/1a1a1a/ffffff?text=Photography+Masterclass',
      url: 'https://example.com/course/6',
      difficulty: 'advanced',
      price: 129,
      rating: 4.8,
      students: 650,
      lessons: 40,
      category: 'Photography',
      tags: ['photography', 'lightroom', 'photoshop', 'composition']
    }
  ];

  // Implement pagination for fallback data
  const startIndex = startAtKey ? mockCourses.findIndex(course => course.id === startAtKey) + 1 : 0;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = mockCourses.slice(startIndex, endIndex);
  const hasMore = endIndex < mockCourses.length;
  const lastKey = paginatedCourses.length > 0 ? paginatedCourses[paginatedCourses.length - 1].id : null;

  return {
    courses: paginatedCourses,
    lastKey,
    hasMore
  };
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    console.log(`🔍 Fetching course by ID: ${courseId}`);
    const dbRef = ref(database);
    
    // Since courses are stored with numeric keys at root level
    const snapshot = await get(child(dbRef, `/${courseId}`));
    
    if (snapshot.exists()) {
      const courseData = snapshot.val();
      console.log(`✅ Found course ${courseId}:`, courseData);
      
      // Map the data to our Course interface with multiple field name support
      const difficulty = courseData.difficulty || courseData.course_level || 'intermediate';
      const normalizedDifficulty = ['beginner', 'intermediate', 'advanced', 'expert', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(difficulty) 
        ? difficulty as Course['difficulty']
        : 'intermediate' as Course['difficulty'];

      // Handle multiple possible field names from Firebase
      const title = courseData.title || courseData.course_name || courseData.name || `Course ${courseId}`;
      const description = courseData.description || courseData.course_description || `Learn ${courseData.category || 'concepts'} and practical exercises.`;
      const instructor = courseData.instructor || courseData.course_author || courseData.author || 'Expert Instructor';
      const duration = courseData.duration || courseData.course_duration || '4-6 weeks';
      const category = courseData.category || 'Programming';

      const course: Course = {
        id: courseId,
        title: title,
        description: description,
        instructor: instructor,
        duration: duration,
        imageUrl: courseData.imageUrl || courseData.url || courseData.course_image || `https://placehold.co/600x400/000000/ffffff?text=COURSE+${courseId}`,
        url: courseData.url || `https://example.com/course/${courseId}`,
        difficulty: normalizedDifficulty,
        price: Number(courseData.price || courseData.course_price) || 0,
        rating: Number(courseData.rating || courseData.course_rating) || 4.5,
        students: Number(courseData.students || courseData.course_students) || (1000 + (Number(courseId) * 100)),
        lessons: Number(courseData.lessons || courseData.course_lessons) || (20 + (Number(courseId) % 30)),
        category: category,
        tags: courseData.tags || []
      };
      
      return course;
    } else {
      console.log(`⚠️ Course ${courseId} not found`);
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching course by ID:', error);
    throw error;
  }
};

export const searchCourses = async (searchTerm: string): Promise<Course[]> => {
  try {
    console.log(`🔍 Searching courses for: "${searchTerm}"`);
    
    // Get all courses for search (since it's a small dataset)
    const { courses } = await getCourses(null, 1000);
    
    if (!searchTerm.trim()) {
      console.log('📋 Empty search term, returning all courses');
      return courses;
    }
    
    const term = searchTerm.toLowerCase();
    const filteredCourses = courses.filter(course => 
      course.title.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term) ||
      course.instructor.toLowerCase().includes(term) ||
      course.category.toLowerCase().includes(term) ||
      (course.tags && course.tags.some(tag => tag.toLowerCase().includes(term)))
    );
    
    console.log(`🎯 Search results: ${filteredCourses.length} courses found`);
    return filteredCourses;
  } catch (error) {
    console.error('❌ Error searching courses:', error);
    throw error;
  }
};

// Helper function to get all categories from courses
export const getCategories = async (): Promise<string[]> => {
  try {
    const { courses } = await getCourses(null, 1000);
    const categories = [...new Set(courses.map(course => course.category))];
    return categories.sort();
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return ['Programming', 'Design', 'Business', 'Marketing'];
  }
};

// Helper function to get all difficulty levels
export const getDifficultyLevels = (): string[] => {
  return ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
};

// Filter courses based on user interests
export const getCoursesFilteredByInterests = async (userInterests: string[]): Promise<Course[]> => {
  try {
    console.log('🎯 Filtering courses by user interests:', userInterests);
    
    // Get all courses first
    const { courses } = await getCourses(null, 1000); // Get all courses
    
    if (!userInterests || userInterests.length === 0) {
      console.log('📋 No interests specified, returning all courses');
      return courses;
    }
    
    // Filter courses based on user interests
    const filteredCourses = courses.filter(course => {
      // Check if course category matches any user interest
      const categoryMatch = userInterests.some(interest => 
        interest.toLowerCase() === course.category.toLowerCase()
      );
      
      // Check if course tags match any user interest
      const tagMatch = course.tags && course.tags.some(tag =>
        userInterests.some(interest => 
          interest.toLowerCase() === tag.toLowerCase()
        )
      );
      
      // Check if course title or description contains interest keywords
      const contentMatch = userInterests.some(interest => {
        const interestLower = interest.toLowerCase();
        return course.title.toLowerCase().includes(interestLower) ||
               course.description.toLowerCase().includes(interestLower);
      });
      
      return categoryMatch || tagMatch || contentMatch;
    });
    
    console.log(`🎯 Filtered ${filteredCourses.length} courses from ${courses.length} total based on interests:`, userInterests);
    console.log('📚 All available categories:', [...new Set(courses.map(c => c.category))]);
    console.log('📚 Filtered courses:', filteredCourses.map(c => ({ id: c.id, title: c.title, category: c.category })));
    
    // Debug: Show which courses matched which criteria
    courses.forEach(course => {
      const categoryMatch = userInterests.some(interest => 
        interest.toLowerCase() === course.category.toLowerCase()
      );
      const tagMatch = course.tags && course.tags.some(tag =>
        userInterests.some(interest => 
          interest.toLowerCase() === tag.toLowerCase()
        )
      );
      const contentMatch = userInterests.some(interest => {
        const interestLower = interest.toLowerCase();
        return course.title.toLowerCase().includes(interestLower) ||
               course.description.toLowerCase().includes(interestLower);
      });
      
      if (categoryMatch || tagMatch || contentMatch) {
        console.log(`✅ Course ${course.id} matched:`, {
          title: course.title,
          category: course.category,
          categoryMatch,
          tagMatch,
          contentMatch,
          tags: course.tags
        });
      }
    });
    
    return filteredCourses;
  } catch (error) {
    console.error('❌ Error filtering courses by interests:', error);
    throw error;
  }
};

// Get recommended courses based on user interests with smart scoring
export const getRecommendedCoursesByInterests = async (userInterests: string[], limit: number = 6): Promise<Course[]> => {
  try {
    console.log('🌟 Getting recommended courses for interests:', userInterests);
    
    const filteredCourses = await getCoursesFilteredByInterests(userInterests);
    
    // Score courses based on relevance to user interests
    const scoredCourses = filteredCourses.map(course => {
      let score = 0;
      
      // Higher score for exact category match
      if (userInterests.some(interest => interest.toLowerCase() === course.category.toLowerCase())) {
        score += 10;
      }
      
      // Score for tag matches
      if (course.tags) {
        const tagMatches = course.tags.filter(tag =>
          userInterests.some(interest => interest.toLowerCase() === tag.toLowerCase())
        ).length;
        score += tagMatches * 5;
      }
      
      // Score for content matches
      const contentMatches = userInterests.filter(interest => {
        const interestLower = interest.toLowerCase();
        return course.title.toLowerCase().includes(interestLower) ||
               course.description.toLowerCase().includes(interestLower);
      }).length;
      score += contentMatches * 3;
      
      // Bonus for high rating
      score += course.rating * 2;
      
      // Bonus for popular courses (more students)
      if (course.students && course.students > 1000) {
        score += 2;
      }
      
      return { ...course, relevanceScore: score };
    });
    
    // Sort by relevance score and rating, then take the top results
    const recommendedCourses = scoredCourses
      .sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return b.rating - a.rating;
      })
      .slice(0, limit)
      .map(({ relevanceScore, ...course }) => course); // Remove the score from final result
    
    console.log(`🌟 Recommended ${recommendedCourses.length} courses based on interests`);
    
    return recommendedCourses;
  } catch (error) {
    console.error('❌ Error getting recommended courses:', error);
    throw error;
  }
};
