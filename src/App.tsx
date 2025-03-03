
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import GlassHeader from './components/GlassHeader';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AdminAuthPage from './pages/AdminAuthPage';
import AdminPanel from './pages/AdminPanel';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import BookingsPage from './pages/BookingsPage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import LiveStreamPage from './pages/LiveStreamPage';
import PressKitPage from './pages/PressKitPage';
import AirdropPage from './pages/AirdropPage';
import StorePage from './pages/StorePage';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CyberMenu from './components/CyberMenu';
import { Toaster } from './components/ui/toaster';

function App() {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Community', href: '/community' },
    { label: 'Store', href: '/store' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="app-container bg-gradient-to-br from-black to-purple-950 min-h-screen">
      <GlassHeader />
      
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin-auth" element={<AdminAuthPage />} />
        <Route path="/store" element={<StorePage />} />
        
        {/* Páginas protegidas (requer autenticação) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/community/*" element={
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        } />
        
        <Route path="/bookings" element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/demo-submission" element={
          <ProtectedRoute allowedProfiles={['artist']}>
            <DemoSubmissionPage />
          </ProtectedRoute>
        } />
        
        <Route path="/live-stream" element={
          <ProtectedRoute>
            <LiveStreamPage />
          </ProtectedRoute>
        } />
        
        <Route path="/press-kit" element={
          <ProtectedRoute>
            <PressKitPage />
          </ProtectedRoute>
        } />
        
        <Route path="/airdrop" element={
          <ProtectedRoute>
            <AirdropPage />
          </ProtectedRoute>
        } />
        
        {/* Painel Admin (apenas para admins) */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedProfiles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        } />
        
        {/* Rota para página não encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      <CyberMenu items={menuItems} />
      <Toaster />
    </div>
  );
}

export default App;
