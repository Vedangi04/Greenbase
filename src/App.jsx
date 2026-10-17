import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { BuildingProvider } from '@/lib/BuildingContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import NavBar from '@/components/NavBar';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Retrofits from '@/pages/Retrofits';
import Incentives from '@/pages/Incentives';
import Compare from '@/pages/Compare';
import Rankings from '@/pages/Rankings';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/retrofits" element={<Retrofits />} />
        <Route path="/incentives" element={<Incentives />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <BuildingProvider>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </BuildingProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
