
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Import pages
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ResetPasswordConfirmPage from './pages/ResetPasswordConfirmPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import CommunityPage from './pages/CommunityPage';
import AdminPanel from './pages/AdminPanel';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StorePage from './pages/StorePage';
import AnalyticsPage from './pages/AnalyticsPage';
import ModerationPage from './pages/ModerationPage';
import AirdropPage from './pages/AirdropPage';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ProfilePage from './pages/ProfilePage';
import LogsPage from './pages/LogsPage';
import LogsViewer from './pages/LogsViewer';
import BookingsPage from './pages/BookingsPage';
import NotesPage from './pages/NotesPage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import DemoReviewPage from './pages/DemoReviewPage';
import PressKitPage from './pages/PressKitPage';
import LiveStreamPage from './pages/LiveStreamPage';
import JestCoinPage from './pages/JestCoinPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import AssetUploader from './pages/AssetUploader';
import AdminAuthPage from './pages/AdminAuthPage';
import NotificationsPage from './pages/NotificationsPage';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/index" />} />
          <Route path="/index" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/reset-password-confirm" element={<ResetPasswordConfirmPage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/community/*" element={<CommunityPage />} />
            <Route path="/admin-auth" element={<AdminAuthPage />} />
            <Route path="/assets" element={<AssetUploader />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/logs-viewer" element={<LogsViewer />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/demo-submission" element={<DemoSubmissionPage />} />
            <Route path="/press-kit" element={<PressKitPage />} />
            <Route path="/live-stream" element={<LiveStreamPage />} />
            <Route path="/jestcoin" element={<JestCoinPage />} />
            <Route path="/demo-review" element={
              <ProtectedRoute requiredProfileType="admin">
                <DemoReviewPage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/admin-panel" element={
            <ProtectedRoute requiredProfileType="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredProfileType="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/store" element={<StorePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/moderation" element={<ModerationPage />} />
          <Route path="/airdrop" element={<AirdropPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
