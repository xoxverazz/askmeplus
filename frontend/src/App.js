import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './pages/SplashScreen';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InboxPage from './pages/InboxPage';
import ShareLinkPage from './pages/ShareLinkPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import AppLayout from './components/AppLayout';
import { useState, useEffect } from 'react';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/inbox" replace /> : children;
}

function AppRoutes() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreen />;

  return (
    <Routes>
      <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/inbox" replace />} />
      </Route>
      <Route path="/inbox" element={<ProtectedRoute><AppLayout><InboxPage /></AppLayout></ProtectedRoute>} />
      <Route path="/share" element={<ProtectedRoute><AppLayout><ShareLinkPage /></AppLayout></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><AppLayout><InsightsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/:username" element={<PublicProfilePage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1a1825',
                color: '#f5f3ff',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '12px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ec4899', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
