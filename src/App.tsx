import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

const queryClient = new QueryClient();

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', profile?.theme || 'default');
    root.setAttribute('data-font', profile?.font || 'Inter');
    root.setAttribute('data-shape', profile?.shape || 'default');
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-xl gradient-primary animate-pulse" />
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <AppContent />

        {/* ✅ REQUIRED for Vercel Analytics */}
        <Analytics />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

