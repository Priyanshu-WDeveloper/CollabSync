import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage.tsx';
import { Login, Register } from './components/auth/index.ts';
import Dashboard from './pages/Dashboard.tsx';
import Settings from './pages/Settings.tsx';
import { useAuthStore } from './store/authStore.js';
import { Spinner } from './components/ui/index.js';

// Lazy load heavy components
const WorkspacePage = lazy(() => import('./pages/WorkspacePage.tsx'));

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1428',
            color: '#fff',
            border: '1px solid #312854',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:id"
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingFallback />}>
                <WorkspacePage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;