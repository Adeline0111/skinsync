
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, AuthState } from './types';
import { auth } from './services/authService';
import AuthView from './views/AuthView';
import OnboardingView from './views/OnboardingView';
import DashboardView from './views/DashboardView';
import RoutineView from './views/RoutineView';
import TrackingView from './views/TrackingView';
import ProfileView from './views/ProfileView';

type View = 'dashboard' | 'routine' | 'tracking' | 'profile';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true
  });
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const checkAuth = useCallback(() => {
    const user = auth.getCurrentUser();
    setAuthState({ user, loading: false });
  }, []);

  useEffect(() => {
    // Simulate initial check
    const timer = setTimeout(checkAuth, 1000);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  const handleAuthSuccess = (user: UserProfile) => {
    setAuthState({ user, loading: false });
  };

  const handleLogout = () => {
    auth.logout();
    setAuthState({ user: null, loading: false });
    setCurrentView('dashboard');
  };

  const handleOnboardingComplete = (updatedUser: UserProfile) => {
    setAuthState({ user: updatedUser, loading: false });
  };

  if (authState.loading) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
        <p className="mt-6 text-[#c5a059] font-serif italic text-lg animate-pulse">SkinSync</p>
      </div>
    );
  }

  if (!authState.user) {
    return <AuthView onAuthSuccess={handleAuthSuccess} />;
  }

  if (!authState.user.onboardingCompleted) {
    return <OnboardingView user={authState.user} onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView user={authState.user!} />;
      case 'routine': return <RoutineView user={authState.user!} />;
      case 'tracking': return <TrackingView user={authState.user!} />;
      case 'profile': return <ProfileView user={authState.user!} onLogout={handleLogout} onUpdate={handleOnboardingComplete} />;
      default: return <DashboardView user={authState.user!} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] pb-24 text-white max-w-md mx-auto relative overflow-x-hidden">
      {/* View Content */}
      <main className="p-6">
        {renderView()}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#16181d]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-around py-4 z-50">
        <NavButton active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon="🏠" label="Home" />
        <NavButton active={currentView === 'routine'} onClick={() => setCurrentView('routine')} icon="🧴" label="Routine" />
        <NavButton active={currentView === 'tracking'} onClick={() => setCurrentView('tracking')} icon="📸" label="Progress" />
        <NavButton active={currentView === 'profile'} onClick={() => setCurrentView('profile')} icon="👤" label="Profile" />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <span className={`text-2xl transition-transform ${active ? 'scale-110' : 'opacity-40 grayscale group-hover:opacity-60'}`}>{icon}</span>
    <span className={`text-[10px] font-semibold uppercase tracking-widest ${active ? 'text-[#c5a059]' : 'text-gray-500'}`}>{label}</span>
  </button>
);

export default App;
