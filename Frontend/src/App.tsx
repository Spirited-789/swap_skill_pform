import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth.tsx';
import { useToast } from './hooks/useToast';
import ToastContainer from './components/ToastContainer';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import SwapsPage from './pages/SwapsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Admin Route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  // Simulate real-time notifications
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        const notifications = [
          'New swap request received!',
          'Someone viewed your profile',
          'Skill match found nearby',
        ];
        const random = Math.random();
        if (random < 0.1) { // 10% chance every 30 seconds
          const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
          addToast('info', randomNotification);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, addToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Layout>
                <SearchPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/swaps"
          element={
            <ProtectedRoute>
              <Layout>
                <SwapsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <Layout>
                  <AdminPage />
                </Layout>
              </AdminRoute>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;