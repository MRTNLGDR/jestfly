
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import AuthPage from '@/pages/AuthPage';
import AdminAuthPage from '@/pages/AdminAuthPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminPanel from '@/pages/AdminPanel';
import CommunityPage from '@/pages/CommunityPage';
import StorePage from '@/pages/StorePage';
import BookingsPage from '@/pages/BookingsPage';
import PressKitPage from '@/pages/PressKitPage';
import LiveStreamPage from '@/pages/LiveStreamPage';
import AirdropPage from '@/pages/AirdropPage';
import DemoSubmissionPage from '@/pages/DemoSubmissionPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import ResetPasswordConfirmPage from '@/pages/ResetPasswordConfirmPage';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/admin/login" element={<AdminAuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password-confirm" element={<ResetPasswordConfirmPage />} />
          
          {/* Rotas protegidas (requerem autenticação) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
          
          {/* Outras rotas do aplicativo */}
          <Route path="/community/*" element={<CommunityPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/press-kit" element={<PressKitPage />} />
          <Route path="/live" element={<LiveStreamPage />} />
          <Route path="/airdrop" element={<AirdropPage />} />
          <Route path="/submit-demo" element={<DemoSubmissionPage />} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
