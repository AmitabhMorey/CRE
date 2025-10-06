import { useState, useEffect } from 'react';
import { Course, Review, UserProgress } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../hooks/useCourses';
import {
  X,
  Clock,
  Users,
  Star,
  BookOpen,
  Award,
  Heart,
  PlayCircle
} from 'lucide-react';
import { ReviewSection } from './ReviewSection';

interface CourseDetailProps {
  course: Course;
  onClose: () => void;
}

export const CourseDetail = ({ course, onClose }: CourseDetailProps) => {
  const { userData } = useAuth();
  const {
    enrollInCourse,
    toggleFavorite,
    getCourseReviews,
    getUserProgress,
    updateProgress
  } = useCourses();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(false);

  const isEnrolled = userData?.enrolledCourses?.includes(course.id);
  const isFavorite = userData?.favoriteCourses?.includes(course.id);
  const isCompleted = userData?.completedCourses?.includes(course.id);

  // Get the correct image URL
  const imageUrl = course.imageUrl || course.thumbnail || 
    `https://placehold.co/600x400/000000/ffffff?text=COURSE+${course.id}`;
  
  // Get the correct student/enrolled count
  const enrolledCount = course.students || course.enrolled || 0;
  
  // Get lessons count with fallback
  const lessonsCount = course.lessons || (20 + (parseInt(course.id) % 30));
  
  // Get review count with fallback
  const reviewCount = course.reviewCount || Math.floor(enrolledCount * 0.1) || 0;

  useEffect(() => {
    loadCourseData();
  }, [course.id]);

  const loadCourseData = async () => {
    const [reviewsData, progressData] = await Promise.all([
      getCourseReviews(course.id),
      getUserProgress(course.id)
    ]);

    setReviews(reviewsData);
    setProgress(progressData);
  };

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await enrollInCourse(course.id);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(course.id);
    window.location.reload();
  };

  const handleProgressUpdate = async (completed: number) => {
    await updateProgress(course.id, completed, lessonsCount);
    const updatedProgress = await getUserProgress(course.id);
    setProgress(updatedProgress);
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
    expert: 'bg-purple-100 text-purple-700',
    Beginner: 'bg-green-100 text-green-700',
    Intermediate: 'bg-yellow-100 text-yellow-700',
    Advanced: 'bg-red-100 text-red-700',
    Expert: 'bg-purple-100 text-purple-700'
  };

  console.log('🎯 CourseDetail rendering for course:', course.id, course.title);

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] overflow-y-auto font-mono text-xs uppercase">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto bg-black border border-white/30 shadow-2xl text-white"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
          }}
        >
          <div className="relative">
            <img
              src={imageUrl}
              alt={course.title}
              className="w-full h-64 object-cover opacity-80"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/600x400/000000/ffffff?text=NEURAL+MODULE+${course.id}`;
              }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/80 border border-white/30 p-2 text-white hover:bg-black hover:border-white/60 transition-all duration-300"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {isCompleted && (
              <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Completed</span>
              </div>
            )}
          </div>

          <div className="p-8 text-white">
            {/* Test content to ensure visibility */}
            <div className="mb-4 p-4 bg-white/10 border border-white/20">
              <h1 className="text-2xl font-bold text-white mb-2">NEURAL MODULE DETAILS</h1>
              <p className="text-white/80">Course ID: {course.id}</p>
              <p className="text-white/80">Title: {course.title}</p>
            </div>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${difficultyColors[course.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{course.rating}</span>
                    <span className="text-gray-600">({reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {course.title}
                </h1>

                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <span className="font-medium">Instructor:</span>
                  <span>{course.instructor}</span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{lessonsCount} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{enrolledCount.toLocaleString()} enrolled</span>
                  </div>
                </div>
              </div>
            </div>

            {progress && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">Your Progress</span>
                  <span className="text-blue-600 font-bold">{progress.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress.progress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  {progress.completedLessons} of {progress.totalLessons} lessons completed
                </div>

                {isEnrolled && !isCompleted && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleProgressUpdate(Math.min(progress.completedLessons + 1, lessonsCount))}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Continue Learning
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mb-8">
              {!isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}

              <button
                onClick={handleToggleFavorite}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                  isFavorite
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </button>
            </div>

            <ReviewSection
              courseId={course.id}
              reviews={reviews}
              onReviewAdded={loadCourseData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
