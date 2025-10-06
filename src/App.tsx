import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { InterestSelection } from './components/InterestSelection';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { ImmersiveLandingPage } from './components/ImmersiveLandingPage';
import { CoursesList } from './components/CoursesList';
import { Shield, Sun, Moon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';
import { testFirebaseConnection } from './utils/firebaseTest';

// Theme toggle button component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg z-50 hover:scale-105 transition-transform hover:bg-primary/90"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-primary-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-primary-foreground" />
      )}
    </button>
  );
};

// Main app content
function AppContent() {
  const { currentUser, userData } = useAuth();
  const { theme } = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showCourses, setShowCourses] = useState(false);

  // Apply theme class to the root element
  useEffect(() => {
    document.documentElement.className = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  // Test Firebase connection on app load
  useEffect(() => {
    if (currentUser) {
      testFirebaseConnection().then(result => {
        console.log('🔥 Firebase test result:', result);
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    if (showLanding) {
      return (
        <>
          <ImmersiveLandingPage onGetStarted={() => setShowLanding(false)} />
          <ThemeToggle />
        </>
      );
    }

    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        {authMode === 'login' ? (
          <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setAuthMode('login')} />
        )}
        <ThemeToggle />
      </div>
    );
  }

  if (!userData?.interests || userData.interests.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <InterestSelection />
        <ThemeToggle />
      </div>
    );
  }

  if (showAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <AdminPanel onClose={() => setShowAdmin(false)} />
        <ThemeToggle />
      </div>
    );
  }

  if (showCourses) {
    return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <div className="p-4">
          <button
            onClick={() => setShowCourses(false)}
            className="mb-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            ← Back to Dashboard
          </button>
        </div>
        <CoursesList />
        <ThemeToggle />
      </div>
    );
  }

  // Dashboard view - no theme toggle since it has fixed cyberpunk styling
  return (
    <>
      <Dashboard 
        onShowAdmin={() => setShowAdmin(true)} 
        onShowCourses={() => setShowCourses(true)}
      />

      {userData?.isAdmin && (
        <button
          onClick={() => setShowAdmin(true)}
          className="fixed bottom-6 right-6 p-3 bg-black/50 border border-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-white/60 hover:bg-white/5 z-50"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
          }}
          aria-label="Admin Panel"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">ADMIN</span>
          </div>
        </button>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'bg-card text-card-foreground border border-border shadow-lg',
          success: {
            className: 'bg-green-500 text-white',
            iconTheme: {
              primary: 'white',
              secondary: 'green',
            },
          },
          error: {
            className: 'bg-destructive text-destructive-foreground',
          },
        }}
      />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
