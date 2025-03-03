import React from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import StorePage from './pages/StorePage';
import BookingsPage from './pages/BookingsPage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import LiveStreamPage from './pages/LiveStreamPage';
import PressKitPage from './pages/PressKitPage';
import AirdropPage from './pages/AirdropPage';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import GlassHeader from './components/GlassHeader';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative overflow-hidden bg-black">
          <GlassHeader />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/community/*" element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/store" element={<StorePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/demo-submission" element={<DemoSubmissionPage />} />
            <Route path="/live-stream" element={<LiveStreamPage />} />
            <Route path="/press-kit" element={<PressKitPage />} />
            <Route path="/airdrop" element={<AirdropPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
