import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Code, Palette, TrendingUp, Database, Briefcase, Camera, Music, BookOpen, Check } from 'lucide-react';

const categories = [
  { id: 'programming', name: 'Programming', icon: Code, description: 'Code • Logic • Innovation' },
  { id: 'design', name: 'Design', icon: Palette, description: 'Visual • Creative • Aesthetic' },
  { id: 'marketing', name: 'Marketing', icon: TrendingUp, description: 'Strategy • Growth • Reach' },
  { id: 'data-science', name: 'Data Science', icon: Database, description: 'Analytics • Insights • Intelligence' },
  { id: 'business', name: 'Business', icon: Briefcase, description: 'Leadership • Strategy • Success' },
  { id: 'photography', name: 'Photography', icon: Camera, description: 'Visual • Capture • Artistry' },
  { id: 'music', name: 'Music', icon: Music, description: 'Audio • Rhythm • Expression' },
  { id: 'writing', name: 'Writing', icon: BookOpen, description: 'Content • Narrative • Communication' },
];

export const InterestSelection = () => {
  const { userData, updateUserInterests } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(userData?.interests || []);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedInterests.length === 0) return;
    setLoading(true);
    try {
      await updateUserInterests(selectedInterests);
    } finally {
      setLoading(false);
    }
  };

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
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
          animation: 'auroraShift 25s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes auroraShift {
          0%, 100% { 
            background: 
              radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
              radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
              radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
              radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
              #000000;
          }
          33% { 
            background: 
              radial-gradient(ellipse 110% 70% at 30% 80%, rgba(255, 20, 147, 0.18), transparent 55%),
              radial-gradient(ellipse 90% 80% at 80% 30%, rgba(0, 255, 255, 0.15), transparent 65%),
              radial-gradient(ellipse 100% 60% at 20% 50%, rgba(138, 43, 226, 0.12), transparent 60%),
              radial-gradient(ellipse 120% 40% at 60% 70%, rgba(255, 215, 0, 0.10), transparent 45%),
              #000000;
          }
          66% { 
            background: 
              radial-gradient(ellipse 100% 90% at 50% 70%, rgba(255, 20, 147, 0.12), transparent 60%),
              radial-gradient(ellipse 120% 50% at 20% 20%, rgba(0, 255, 255, 0.18), transparent 55%),
              radial-gradient(ellipse 80% 80% at 80% 80%, rgba(138, 43, 226, 0.15), transparent 70%),
              radial-gradient(ellipse 90% 60% at 40% 10%, rgba(255, 215, 0, 0.06), transparent 50%),
              #000000;
          }
        }
      `}</style>

      {/* Geometric Grid Background */}
      <div className="fixed inset-0 z-5 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="interest-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#interest-grid)" />
          
          {/* Corner Debug Text */}
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="100" y="100">
            INTEREST MATRIX
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="100" y="115">
            NEURAL MAPPING
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="1720" y="100">
            PREFERENCE ENGINE
          </text>
          <text className="font-mono text-xs fill-white/40 uppercase tracking-wider" x="1720" y="115">
            ACTIVE
          </text>
          
          {/* Bottom Debug */}
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="980">
            [{selectedInterests.length.toString().padStart(2, '0')}] SELECTIONS ACTIVE
          </text>
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="995">
            .ALGORITHM LEARNING
          </text>
          <text className="font-mono text-xs fill-white/30 uppercase tracking-wider" x="100" y="1010">
            {'{NEURAL}'} PATHWAY OPTIMIZATION
          </text>
        </svg>
      </div>

      {/* Header */}
      <header className="relative z-20 p-8">
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
      <div className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-8">
        <div className="w-full max-w-7xl">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-2xl font-bold mb-6 tracking-wider">INTEREST SELECTION PROTOCOL</h1>
            <p className="text-xs text-white/60 tracking-wider leading-relaxed max-w-2xl mx-auto">
              NEURAL PATHWAY CONFIGURATION
              <br />
              SELECT LEARNING DOMAINS FOR PERSONALIZED ALGORITHM TRAINING
              <br />
              MINIMUM 1 • MAXIMUM 8 • OPTIMAL 3-5 SELECTIONS
            </p>
          </div>

          {/* Interest Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const isSelected = selectedInterests.includes(category.id);

              return (
                <button
                  key={category.id}
                  onClick={() => toggleInterest(category.id)}
                  className={`group relative p-6 border transition-all duration-500 hover:scale-105 ${
                    isSelected
                      ? 'border-white bg-white/10 shadow-lg shadow-white/20'
                      : 'border-white/30 bg-transparent hover:border-white/60 hover:bg-white/5'
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-4 relative">
                    <Icon className={`w-10 h-10 mx-auto transition-all duration-300 ${
                      isSelected 
                        ? 'text-white scale-110' 
                        : 'text-white/60 group-hover:text-white group-hover:scale-110'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className={`font-mono text-xs uppercase tracking-wider mb-2 transition-colors ${
                      isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`text-[10px] font-mono uppercase tracking-wide transition-colors leading-relaxed ${
                      isSelected ? 'text-white/80' : 'text-white/50 group-hover:text-white/70'
                    }`}>
                      {category.description}
                    </p>
                  </div>

                  {/* Corner Accent */}
                  <div className={`absolute top-0 right-0 w-2 h-2 transition-colors ${
                    isSelected ? 'bg-white' : 'bg-white/30 group-hover:bg-white/60'
                  }`} 
                  style={{
                    clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                  }}></div>
                </button>
              );
            })}
          </div>

          {/* Action Section */}
          <div className="text-center">
            <div className="mb-8">
              <p className="font-mono text-xs tracking-wider text-white/60 mb-2">
                SELECTION STATUS: {selectedInterests.length} / 8 DOMAINS ACTIVE
              </p>
              <div className="w-64 h-1 bg-white/20 mx-auto">
                <div 
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${(selectedInterests.length / 8) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button
              onClick={handleSave}
              disabled={selectedInterests.length === 0 || loading}
              className="relative px-16 py-4 border-2 border-white bg-transparent text-white font-mono text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  PROCESSING NEURAL MAP...
                </span>
              ) : (
                'INITIALIZE LEARNING PROTOCOL'
              )}
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-white" 
                style={{
                  clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
                }}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 p-8 text-center">
        <div className="text-xs text-white/30 tracking-[0.2em]">
          <p>LEARNHUB INTEREST MAPPING SYSTEM v3.2</p>
          <p className="mt-1">QUANTUM PREFERENCE ALGORITHM ACTIVE</p>
        </div>
      </footer>
    </div>
  );
};
