import { useEffect, useState, useCallback } from 'react';
import { getCourses, searchCourses } from '../services/courseService';
import { Course } from '../types';
import { BookOpen, Clock, Users, Star, ArrowRight, Search, Database } from 'lucide-react';

const PAGE_SIZE = 12; // Number of courses per page

export const CoursesList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const loadCourses = useCallback(async (isInitialLoad = false) => {
    try {
      console.log('loadCourses called', { isInitialLoad, searchQuery });
      if (isInitialLoad) {
        setLoading(true);
        setError(null);
      }

      if (searchQuery.trim()) {
        console.log('Searching courses with query:', searchQuery);
        const results = await searchCourses(searchQuery);
        console.log('Search results:', results);
        setCourses(results);
        setHasMore(false);
        return;
      }

      console.log('Fetching courses with pagination...');
      const { courses: newCourses, lastKey: newLastKey, hasMore: more } =
        await getCourses(isInitialLoad ? null : lastKey, PAGE_SIZE);

      console.log('Received courses:', newCourses);
      console.log('Pagination info:', { newLastKey, more });

      setCourses(prev => isInitialLoad ? newCourses : [...prev, ...newCourses]);
      setLastKey(newLastKey);
      setHasMore(more);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load courses';
      
      // Add mock data as fallback for testing
      if (isInitialLoad) {
        console.log('Using mock data as fallback...');
        const mockCourses: Course[] = [
          {
            id: '1',
            title: 'Neural Network Programming',
            description: 'Master advanced neural network architectures and deep learning algorithms.',
            instructor: 'Dr. Sarah Chen',
            duration: '8 weeks',
            imageUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Neural+Networks',
            difficulty: 'advanced',
            price: 149.99,
            rating: 4.8,
            students: 2340,
            category: 'Programming'
          },
          {
            id: '2',
            title: 'Quantum Computing Fundamentals',
            description: 'Explore the principles of quantum mechanics applied to computational systems.',
            instructor: 'Prof. Marcus Webb',
            duration: '12 weeks',
            imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff?text=Quantum+Computing',
            difficulty: 'expert',
            price: 299.99,
            rating: 4.9,
            students: 890,
            category: 'Programming'
          },
          {
            id: '3',
            title: 'Cybersecurity Protocol Design',
            description: 'Learn advanced cryptographic protocols and security system architecture.',
            instructor: 'Alex Rodriguez',
            duration: '6 weeks',
            imageUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Cybersecurity',
            difficulty: 'intermediate',
            price: 0,
            rating: 4.6,
            students: 3200,
            category: 'Programming'
          },
          {
            id: '4',
            title: 'Blockchain Architecture',
            description: 'Design and implement distributed ledger systems and smart contracts.',
            instructor: 'Dr. Elena Vasquez',
            duration: '10 weeks',
            imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Blockchain',
            difficulty: 'advanced',
            price: 199.99,
            rating: 4.7,
            students: 1560,
            category: 'Programming'
          }
        ];
        setCourses(mockCourses);
        setHasMore(false);
        setError(`Using mock data. Original error: ${errorMessage}`);
      }
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  }, [lastKey, searchQuery]);

  useEffect(() => {
    loadCourses(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setCourses([]);
    loadCourses(true);
    setIsSearching(false);
  };

  const handleLoadMore = () => {
    if (!hasMore || isSearching) return;
    loadCourses(false);
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white font-mono text-xs uppercase overflow-x-hidden relative">
        {/* Noise Texture Overlay */}
        <div
          className="fixed inset-0 opacity-8 z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
          }}
        />
        
        <div className="flex justify-center items-center min-h-screen relative z-20">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs text-white/60 tracking-wider">INITIALIZING NEURAL DATABASE...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white font-mono text-xs uppercase overflow-x-hidden relative">
        <div className="flex justify-center items-center min-h-screen relative z-20">
          <div className="bg-red-900/20 border border-red-500/30 p-6 max-w-md text-center">
            <p className="text-red-400 tracking-wider">SYSTEM ERROR DETECTED</p>
            <p className="text-red-300 mt-2 text-[10px]">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono text-xs uppercase overflow-x-hidden relative">
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
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.10), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.08), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.12), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.05), transparent 40%),
            #000000
          `,
          animation: 'coursesShift 35s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes coursesShift {
          0%, 100% { 
            background: 
              radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.10), transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.08), transparent 60%),
              radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.12), transparent 65%),
              radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.05), transparent 40%),
              #000000;
          }
          50% { 
            background: 
              radial-gradient(ellipse 100% 90% at 30% 80%, rgba(255, 20, 147, 0.12), transparent 55%),
              radial-gradient(ellipse 120% 50% at 80% 20%, rgba(0, 255, 255, 0.10), transparent 65%),
              radial-gradient(ellipse 80% 80% at 20% 50%, rgba(138, 43, 226, 0.08), transparent 60%),
              radial-gradient(ellipse 90% 60% at 60% 70%, rgba(255, 215, 0, 0.07), transparent 45%),
              #000000;
          }
        }
      `}</style>

      {/* Geometric Grid Background */}
      <div className="fixed inset-0 z-5 pointer-events-none opacity-15">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="courses-grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#courses-grid)" />
          
          {/* Corner Debug Text */}
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="100" y="100">
            COURSE CATALOG
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="100" y="115">
            NEURAL DATABASE
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="1720" y="100">
            SEARCH ENGINE
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="1720" y="115">
            ACTIVE
          </text>
          
          {/* Bottom Debug */}
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="980">
            [{courses.length.toString().padStart(3, '0')}] COURSES INDEXED
          </text>
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="995">
            .QUANTUM SEARCH ACTIVE
          </text>
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="1010">
            {'{DATABASE}'} OPTIMIZATION COMPLETE
          </text>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-20 p-8 border-b border-white/10">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={() => window.location.href = '/'}
        >
          <div className="w-7 h-7 bg-white rounded-full"></div>
          <div className="w-7 h-7 bg-white rounded-full mix-blend-difference"></div>
          <span className="ml-4 text-lg font-bold tracking-wider">LEARNHUB</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 p-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold mb-4 tracking-wider">NEURAL COURSE DATABASE</h1>
          <p className="text-xs text-white/60 tracking-wider leading-relaxed max-w-2xl mx-auto">
            QUANTUM-ENHANCED LEARNING MODULES
            <br />
            ADVANCED KNOWLEDGE ACQUISITION PROTOCOLS
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH NEURAL DATABASE..."
                className="w-full pl-12 pr-32 py-4 bg-black/50 border border-white/20 text-white text-xs tracking-wider placeholder:text-white/40 focus:outline-none focus:border-white/60 transition-colors font-mono uppercase"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/40" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black px-6 py-2 font-mono text-xs uppercase tracking-wider font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSearching}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}
              >
                {isSearching ? 'SCANNING...' : 'SEARCH'}
              </button>
            </div>
          </form>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-black/30 border border-white/20 p-12 max-w-2xl mx-auto"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
              }}
            >
              <Database className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 tracking-wider">NO COURSES DETECTED</h3>
              <p className="text-xs text-white/60 tracking-wider">
                {searchQuery
                  ? 'NEURAL SEARCH RETURNED ZERO RESULTS • ADJUST PARAMETERS'
                  : 'DATABASE INITIALIZATION IN PROGRESS • PLEASE STANDBY'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-black/50 border border-white/20 hover:border-white/40 transition-all duration-500 flex flex-col h-full group hover:bg-black/70"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="h-48 bg-white/5 overflow-hidden relative">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://placehold.co/600x400/000000/ffffff?text=NEURAL+MODULE';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white/30" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-[10px] font-bold text-white tracking-wider">
                      {course.difficulty?.toUpperCase() || 'ALL LEVELS'}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-sm font-bold text-white mb-2 leading-tight tracking-wider line-clamp-2">
                      {course.title?.toUpperCase()}
                    </h3>

                    <p className="text-[10px] text-white/60 mb-4 line-clamp-3 flex-grow tracking-wide leading-relaxed">
                      {course.description?.toUpperCase() || 'NO DESCRIPTION AVAILABLE'}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-white/60 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-white" />
                        <span>{course.duration?.toUpperCase() || 'SELF-PACED'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1 text-white" />
                        <span>{course.students?.toLocaleString() || '0'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/20 mb-4">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="ml-1 text-[10px] font-bold text-white">
                          {course.rating ? course.rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {course.price && course.price > 0 ? `$${course.price.toFixed(2)}` : 'FREE'}
                      </div>
                    </div>

                    <button
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-mono text-[10px] uppercase tracking-wider font-bold py-3 px-4 transition-all duration-300 hover:bg-white/90 hover:scale-105"
                      onClick={() => {
                        console.log('View course:', course.id);
                      }}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                      }}
                    >
                      ACCESS MODULE
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white/30 group-hover:bg-white/60 transition-colors" 
                    style={{
                      clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                    }}></div>
                </div>
              ))}
            </div>

            {hasMore && !isSearching && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-12 py-4 border border-white/30 bg-transparent text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-white/60 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      LOADING DATABASE...
                    </span>
                  ) : 'LOAD MORE MODULES'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-8 text-center border-t border-white/10">
        <div className="text-xs text-white/30 tracking-[0.2em]">
          <p>LEARNHUB NEURAL CATALOG v5.1</p>
          <p className="mt-1">QUANTUM DATABASE INTERFACE ACTIVE</p>
        </div>
      </footer>
    </div>
  );
};