import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourses } from '../../hooks/useCourses';
import { CourseCard } from './CourseCard';
import { CourseDetail } from '../CourseDetail/CourseDetail';

import { Course } from '../../types';
import { LogOut, User, BookOpen, Heart, Award, Search, Filter } from 'lucide-react';

type ViewMode = 'all' | 'enrolled' | 'favorites' | 'completed';

interface DashboardProps {
  onShowAdmin?: () => void;
  onShowCourses?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onShowCourses }) => {
  const { logout, userData } = useAuth();
  const { courses, loading, getRecommendedCourses, getCoursesByInterests, toggleFavorite } = useCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showProfile, setShowProfile] = useState(false);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [interestFilteredCourses, setInterestFilteredCourses] = useState<Course[]>([]);
  const [useInterestFilter, setUseInterestFilter] = useState(true);

  // Load recommended courses and interest-filtered courses when user data or courses change
  useEffect(() => {
    const loadRecommendedCourses = async () => {
      if (userData?.interests && userData.interests.length > 0) {
        try {
          console.log('🌟 Loading recommended courses for user interests:', userData.interests);
          const recommended = await getRecommendedCourses();
          setRecommendedCourses(recommended);

          console.log('🎯 Loading interest-filtered courses');
          const filtered = await getCoursesByInterests(userData.interests);
          setInterestFilteredCourses(filtered);
          
          console.log(`✅ Loaded ${recommended.length} recommended and ${filtered.length} interest-filtered courses`);
        } catch (error) {
          console.error('❌ Error loading recommended courses:', error);
          // Fallback to showing all courses if filtering fails
          setInterestFilteredCourses(courses);
        }
      } else {
        // If no interests, clear the filtered courses
        setInterestFilteredCourses([]);
        setRecommendedCourses([]);
      }
    };

    if (!loading && courses.length > 0) {
      loadRecommendedCourses();
    }
  }, [userData?.interests, courses, loading, getRecommendedCourses, getCoursesByInterests]);

  const filteredCourses = useMemo(() => {
    // Start with appropriate course set based on view mode
    let filtered: Course[] = [];

    if (viewMode === 'all') {
      // For 'all' view, use interest-filtered courses if enabled and available
      if (useInterestFilter && userData?.interests && userData.interests.length > 0) {
        // When interest filter is enabled, show matched courses or fall back to all courses
        filtered = interestFilteredCourses.length > 0 ? interestFilteredCourses : courses;
        console.log(`🎯 Dashboard filtering: ${interestFilteredCourses.length} interest-matched courses found, showing ${filtered.length} courses`);
      } else {
        filtered = courses;
        console.log(`📋 Dashboard: Interest filter disabled, showing all ${courses.length} courses`);
      }
    } else if (viewMode === 'enrolled') {
      filtered = courses.filter(c => userData?.enrolledCourses?.includes(c.id));
    } else if (viewMode === 'favorites') {
      filtered = courses.filter(c => userData?.favoriteCourses?.includes(c.id));
    } else if (viewMode === 'completed') {
      filtered = courses.filter(c => userData?.completedCourses?.includes(c.id));
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }



    console.log(`🔍 Filtered courses: ${filtered.length} from ${courses.length} total (viewMode: ${viewMode})`);
    return filtered;
  }, [courses, interestFilteredCourses, searchQuery, viewMode, userData, useInterestFilter]);

  const handleLogout = async () => {
    await logout();
  };

  const handleToggleFavorite = async (courseId: string) => {
    await toggleFavorite(courseId);
    window.location.reload();
  };

  if (selectedCourse) {
    console.log('🎯 Rendering CourseDetail for course:', selectedCourse);
    return (
      <CourseDetail
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono text-xs uppercase overflow-x-hidden relative !bg-black !text-white" style={{ colorScheme: 'dark' }}>
      {/* Noise Texture Overlay */}
      <div
        className="fixed inset-0 opacity-8 z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
        }}
      />

      {/* Prismatic Aurora Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.12), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.10), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.15), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.06), transparent 40%),
            #000000
          `,
          animation: 'dashboardShift 30s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes dashboardShift {
          0%, 100% { 
            background: 
              radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.12), transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.10), transparent 60%),
              radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.15), transparent 65%),
              radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.06), transparent 40%),
              #000000;
          }
          25% { 
            background: 
              radial-gradient(ellipse 110% 70% at 30% 80%, rgba(255, 20, 147, 0.15), transparent 55%),
              radial-gradient(ellipse 90% 80% at 80% 30%, rgba(0, 255, 255, 0.12), transparent 65%),
              radial-gradient(ellipse 100% 60% at 20% 50%, rgba(138, 43, 226, 0.10), transparent 60%),
              radial-gradient(ellipse 120% 40% at 60% 70%, rgba(255, 215, 0, 0.08), transparent 45%),
              #000000;
          }
          50% { 
            background: 
              radial-gradient(ellipse 100% 90% at 50% 70%, rgba(255, 20, 147, 0.10), transparent 60%),
              radial-gradient(ellipse 120% 50% at 20% 20%, rgba(0, 255, 255, 0.15), transparent 55%),
              radial-gradient(ellipse 80% 80% at 80% 80%, rgba(138, 43, 226, 0.12), transparent 70%),
              radial-gradient(ellipse 90% 60% at 40% 10%, rgba(255, 215, 0, 0.04), transparent 50%),
              #000000;
          }
          75% { 
            background: 
              radial-gradient(ellipse 90% 60% at 80% 30%, rgba(255, 20, 147, 0.18), transparent 50%),
              radial-gradient(ellipse 110% 70% at 40% 80%, rgba(0, 255, 255, 0.08), transparent 60%),
              radial-gradient(ellipse 120% 50% at 60% 20%, rgba(138, 43, 226, 0.14), transparent 65%),
              radial-gradient(ellipse 100% 80% at 20% 60%, rgba(255, 215, 0, 0.10), transparent 40%),
              #000000;
          }
        }
      `}</style>

      {/* Geometric Grid Background */}
      <div className="fixed inset-0 z-5 pointer-events-none opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="dashboard-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dashboard-grid)" />

          {/* Corner Debug Text */}
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="100" y="100">
            LEARNING DASHBOARD
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="100" y="115">
            NEURAL INTERFACE
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="1720" y="100">
            USER: {userData?.displayName?.toUpperCase() || 'UNKNOWN'}
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="1720" y="115">
            STATUS: ACTIVE
          </text>

          {/* Bottom Debug */}
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="980">
            [{loading ? '...' : filteredCourses.length.toString().padStart(3, '0')}] COURSES {loading ? 'LOADING' : 'AVAILABLE'}
          </text>
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="995">
            .RECOMMENDATION ENGINE {userData?.interests && userData.interests.length > 0 ? 'ACTIVE' : 'STANDBY'}
          </text>
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="1010">
            {'{LEARNING}'} PATHWAY {useInterestFilter && userData?.interests && userData.interests.length > 0 ? 'OPTIMIZED' : 'STANDARD'}
          </text>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-20 p-8 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
            onClick={() => window.location.reload()}
          >
            <div className="w-7 h-7 bg-white rounded-full"></div>
            <div className="w-7 h-7 bg-white rounded-full mix-blend-difference"></div>
            <span className="ml-4 text-lg font-bold tracking-wider">LEARNHUB</span>
          </div>
          <div className="flex items-center gap-4">
            {onShowCourses && (
              <button
                onClick={onShowCourses}
                className="flex items-center gap-2 px-4 py-2 border border-white/30 bg-transparent text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-white/60 hover:bg-white/5"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">All Courses</span>
              </button>
            )}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 px-4 py-2 border border-white/30 bg-transparent text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-white/60 hover:bg-white/5"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/50 bg-transparent text-red-400 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-red-400 hover:bg-red-500/10"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Panel */}
      {showProfile && (
        <div className="relative z-20 p-8 border-b border-white/10">
          <div className="bg-black/50 border border-white/20 p-6"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}
          >
            <h2 className="text-lg font-bold mb-6 tracking-wider">USER PROFILE MATRIX</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-white/60 w-20">NAME:</span>
                  <span className="text-white font-bold">{userData?.displayName?.toUpperCase() || 'UNKNOWN'}</span>
                </div>
                <div className="flex">
                  <span className="text-white/60 w-20">EMAIL:</span>
                  <span className="text-white font-bold">{userData?.email?.toUpperCase() || 'UNKNOWN'}</span>
                </div>
                <div className="flex">
                  <span className="text-white/60 w-20">DOMAINS:</span>
                  <span className="text-white font-bold">
                    {userData?.interests?.join(' • ').toUpperCase() || 'NONE SELECTED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/20 p-4 text-center"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-2xl font-bold text-white">
                  {userData?.enrolledCourses?.length || 0}
                </div>
                <div className="text-xs text-white/60 tracking-wider">ENROLLED</div>
              </div>
              <div className="bg-white/5 border border-white/20 p-4 text-center"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <Award className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-2xl font-bold text-white">
                  {userData?.completedCourses?.length || 0}
                </div>
                <div className="text-xs text-white/60 tracking-wider">COMPLETED</div>
              </div>
              <div className="bg-white/5 border border-white/20 p-4 text-center"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <Heart className="w-8 h-8 mx-auto mb-2 text-white" />
                <div className="text-2xl font-bold text-white">
                  {userData?.favoriteCourses?.length || 0}
                </div>
                <div className="text-xs text-white/60 tracking-wider">FAVORITES</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-20 p-8">
        {/* Navigation Modes */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { key: 'all', label: 'ALL COURSES' },
              { key: 'enrolled', label: 'MY COURSES' },
              { key: 'favorites', label: 'FAVORITES' },
              { key: 'completed', label: 'COMPLETED' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setViewMode(key as ViewMode)}
                className={`px-6 py-3 border font-mono text-xs uppercase tracking-wider transition-all duration-300 ${viewMode === key
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/30 bg-transparent text-white/70 hover:border-white/60 hover:text-white'
                  }`}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH NEURAL DATABASE..."
                className="w-full px-4 py-3 pl-12 bg-black/50 border border-white/20 text-white text-xs tracking-wider placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors font-mono uppercase"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
            </div>

            {/* Interest Filter Toggle */}
            {userData?.interests && userData.interests.length > 0 && (
              <button
                onClick={() => setUseInterestFilter(!useInterestFilter)}
                className={`flex items-center gap-2 px-6 py-3 border font-mono text-xs uppercase tracking-wider transition-all duration-300 ${useInterestFilter
                  ? 'border-white bg-white/10 text-white'
                  : 'border-white/30 bg-transparent text-white/70 hover:border-white/60 hover:text-white'
                  }`}
              >
                <Heart className={`w-4 h-4 ${useInterestFilter ? 'fill-white' : ''}`} />
                INTEREST FILTER
              </button>
            )}

            <button className="flex items-center gap-2 px-6 py-3 border border-white/30 bg-transparent text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-white/60 hover:bg-white/5">
              <Filter className="w-4 h-4" />
              FILTER
            </button>
          </div>
        </div>

        {/* Recommended Section */}
        {viewMode === 'all' && userData?.interests && userData.interests.length > 0 && recommendedCourses.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold mb-6 tracking-wider">
              NEURAL RECOMMENDATIONS
              <span className="text-xs text-white/60 ml-4 font-normal">
                Based on your interests: {userData.interests.join(' • ').toUpperCase()}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCourses.slice(0, 3).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={setSelectedCourse}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* Main Course Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold tracking-wider">
              {viewMode === 'all' && (
                useInterestFilter && userData?.interests && userData.interests.length > 0 && interestFilteredCourses.length > 0
                  ? `INTEREST-MATCHED COURSES [${interestFilteredCourses.length}]`
                  : useInterestFilter && userData?.interests && userData.interests.length > 0 && interestFilteredCourses.length === 0
                  ? `ALL COURSES [${courses.length}] - NO INTEREST MATCHES`
                  : `COURSE DATABASE [${courses.length}]`
              )}
              {viewMode === 'enrolled' && `ENROLLED COURSES [${userData?.enrolledCourses?.length || 0}]`}
              {viewMode === 'favorites' && `FAVORITE COURSES [${userData?.favoriteCourses?.length || 0}]`}
              {viewMode === 'completed' && `COMPLETED COURSES [${userData?.completedCourses?.length || 0}]`}
            </h2>
            {viewMode === 'all' && userData?.interests && userData.interests.length > 0 && (
              <div className="text-xs text-white/60 tracking-wider">
                FILTERING BY: {userData.interests.join(' • ').toUpperCase()}
                {useInterestFilter && interestFilteredCourses.length === 0 && courses.length > 0 && (
                  <span className="text-yellow-400 ml-2">• NO MATCHES FOUND</span>
                )}
                {useInterestFilter && interestFilteredCourses.length > 0 && (
                  <span className="text-green-400 ml-2">• {interestFilteredCourses.length} MATCHES</span>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-xs text-white/60 tracking-wider">LOADING NEURAL DATABASE...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16 bg-black/30 border border-white/20"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
              }}
            >
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-white/40" />
              {viewMode === 'all' && searchQuery ? (
                <div>
                  <p className="text-xs text-white/60 tracking-wider mb-2">NO COURSES MATCH SEARCH: "{searchQuery.toUpperCase()}"</p>
                  <p className="text-xs text-white/40 tracking-wider">TRY DIFFERENT KEYWORDS OR CLEAR SEARCH</p>
                </div>
              ) : viewMode === 'all' && useInterestFilter && userData?.interests && userData.interests.length > 0 && interestFilteredCourses.length === 0 ? (
                <div>
                  <p className="text-xs text-white/60 tracking-wider mb-2">NO COURSES MATCH YOUR INTERESTS</p>
                  <p className="text-xs text-white/40 tracking-wider">INTERESTS: {userData.interests.join(' • ').toUpperCase()}</p>
                  <button 
                    onClick={() => setUseInterestFilter(false)}
                    className="mt-4 px-4 py-2 border border-white/30 text-xs tracking-wider hover:border-white/60 transition-colors"
                  >
                    SHOW ALL COURSES
                  </button>
                </div>
              ) : viewMode === 'enrolled' ? (
                <div>
                  <p className="text-xs text-white/60 tracking-wider mb-2">NO ENROLLED COURSES</p>
                  <p className="text-xs text-white/40 tracking-wider">BROWSE COURSES TO START LEARNING</p>
                </div>
              ) : viewMode === 'favorites' ? (
                <div>
                  <p className="text-xs text-white/60 tracking-wider mb-2">NO FAVORITE COURSES</p>
                  <p className="text-xs text-white/40 tracking-wider">MARK COURSES AS FAVORITES TO SEE THEM HERE</p>
                </div>
              ) : viewMode === 'completed' ? (
                <div>
                  <p className="text-xs text-white/60 tracking-wider mb-2">NO COMPLETED COURSES</p>
                  <p className="text-xs text-white/40 tracking-wider">COMPLETE COURSES TO TRACK YOUR PROGRESS</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-white/60 tracking-wider mb-2">NO COURSES AVAILABLE</p>
                  <p className="text-xs text-white/40 tracking-wider">DATABASE CONNECTION ERROR</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onViewDetails={setSelectedCourse}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-8 text-center border-t border-white/10">
        <div className="text-xs text-white/30 tracking-[0.2em]">
          <p>LEARNHUB NEURAL DASHBOARD v4.2</p>
          <p className="mt-1">QUANTUM LEARNING INTERFACE ACTIVE</p>
        </div>
      </footer>
    </div>
  );
};
