import { Course } from '../../types';
import { Clock, Users, Star, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
  onToggleFavorite?: (courseId: string) => void;
}

export const CourseCard = ({ course, onViewDetails, onToggleFavorite }: CourseCardProps) => {
  const { userData } = useAuth();
  const isFavorite = userData?.favoriteCourses?.includes(course.id);
  const isEnrolled = userData?.enrolledCourses?.includes(course.id);

  // Handle both new and legacy difficulty values
  const difficulty = course.difficulty || 'intermediate';

  // Get image URL from multiple possible sources
  const imageUrl = course.imageUrl || course.thumbnail || 
    `https://placehold.co/600x400/000000/ffffff?text=COURSE+${course.id}`;

  // Get student count from multiple sources
  const studentCount = course.students || course.enrolled || 0;
  
  // Get review count with fallback
  const reviewCount = course.reviewCount || Math.floor(studentCount * 0.1) || 0;

  // Get lessons count with consistent fallback based on course ID
  const lessonsCount = course.lessons || (20 + (parseInt(course.id) % 30));

  return (
    <div className="bg-black/50 border border-white/20 hover:border-white/40 transition-all duration-500 flex flex-col h-full group hover:bg-black/70"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/600x400/000000/ffffff?text=NEURAL+MODULE+${course.id}`;
          }}
        />
        {isEnrolled && (
          <div className="absolute top-2 left-2 bg-green-600/80 text-white px-2 py-1 text-[10px] font-bold tracking-wider">
            ENROLLED
          </div>
        )}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(course.id);
            }}
            className="absolute top-2 right-2 bg-black/80 p-2 hover:bg-black transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`}
            />
          </button>
        )}
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-bold text-white tracking-wider">
          {difficulty.toUpperCase()}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1 text-[10px] text-white/60">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
            <span>({reviewCount})</span>
          </div>
          {course.price !== undefined && (
            <div className="text-[10px] font-bold text-white ml-auto">
              {course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
            </div>
          )}
        </div>

        <h3 className="text-sm font-bold text-white mb-2 leading-tight tracking-wider line-clamp-2">
          {course.title.toUpperCase()}
        </h3>

        <p className="text-[10px] text-white/60 mb-4 line-clamp-3 flex-grow tracking-wide leading-relaxed">
          {course.description.toUpperCase()}
        </p>

        <div className="flex items-center justify-between text-[10px] text-white/60 mb-4">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-white" />
            <span>{course.duration.toUpperCase()}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-3 w-3 mr-1 text-white" />
            <span>{lessonsCount} LESSONS</span>
          </div>
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1 text-white" />
            <span>{studentCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="text-[10px] text-white/60 mb-4 tracking-wider">
          <span className="font-bold">INSTRUCTOR:</span> {course.instructor.toUpperCase()}
        </div>

        <button
          onClick={() => {
            console.log('🔘 ACCESS MODULE clicked for course:', course.id, course.title);
            onViewDetails(course);
          }}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-mono text-[10px] uppercase tracking-wider font-bold py-3 px-4 transition-all duration-300 hover:bg-white/90 hover:scale-105"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
          }}
        >
          ACCESS MODULE
        </button>
      </div>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-3 h-3 bg-white/30 group-hover:bg-white/60 transition-colors" 
        style={{
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }}></div>
    </div>
  );
};
