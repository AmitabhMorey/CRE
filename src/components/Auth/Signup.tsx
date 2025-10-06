import { SignupForm } from './SignupForm';

interface SignupProps {
  onSwitchToLogin: () => void;
}

export const Signup = ({ onSwitchToLogin }: SignupProps) => {
  return (
    <div className="min-h-screen bg-black text-white font-mono text-xs uppercase overflow-x-hidden relative">
      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 opacity-8 z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`
        }}
      />

      {/* Animated Background Gradient */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle at 30% 40%, rgba(251, 226, 167, 0.15), transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(208, 79, 153, 0.12), transparent 60%),
            radial-gradient(circle at 50% 80%, rgba(138, 207, 209, 0.08), transparent 65%),
            radial-gradient(circle at 10% 70%, rgba(251, 226, 167, 0.1), transparent 40%),
            #000000
          `,
          animation: 'gradientShift 25s ease-in-out infinite'
        }}
      />

      <style>{`
        @keyframes gradientShift {
          0%, 100% { 
            background: 
              radial-gradient(circle at 30% 40%, rgba(251, 226, 167, 0.15), transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(208, 79, 153, 0.12), transparent 60%),
              radial-gradient(circle at 50% 80%, rgba(138, 207, 209, 0.08), transparent 65%),
              radial-gradient(circle at 10% 70%, rgba(251, 226, 167, 0.1), transparent 40%),
              #000000;
          }
          50% { 
            background: 
              radial-gradient(circle at 70% 60%, rgba(251, 226, 167, 0.15), transparent 50%),
              radial-gradient(circle at 30% 70%, rgba(208, 79, 153, 0.12), transparent 60%),
              radial-gradient(circle at 90% 20%, rgba(138, 207, 209, 0.08), transparent 65%),
              radial-gradient(circle at 50% 30%, rgba(251, 226, 167, 0.1), transparent 40%),
              #000000;
          }
        }
      `}</style>

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
      <div className="relative z-20 flex items-center justify-center min-h-[calc(100vh-120px)] px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-lg font-bold mb-4 tracking-wider">CREATE ACCOUNT</h1>
            <p className="text-xs text-white/60 tracking-wider leading-relaxed">
              INITIALIZE NEW USER PROFILE
              <br />
              JOIN THE LEARNING NETWORK
            </p>
          </div>
          
          <SignupForm onSwitchToLogin={onSwitchToLogin} />
          
          <div className="text-center mt-8 text-xs text-white/40 tracking-[0.15em]">
            <p>NEURAL PATHWAYS ACTIVATED</p>
            <p className="mt-2">KNOWLEDGE ACQUISITION READY</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 p-8 text-center">
        <div className="text-xs text-white/30 tracking-[0.2em]">
          <p>LEARNHUB REGISTRATION SYSTEM v2.1</p>
          <p className="mt-1">EXPANDING CONSCIOUSNESS THROUGH EDUCATION</p>
        </div>
      </footer>
    </div>
  );
};
