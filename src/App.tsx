
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
import { ModelParameters } from './types/model';

function App() {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Community', href: '/community' },
    { label: 'Store', href: '/store' },
    { label: 'Profile', href: '/profile' },
  ];

  // Default crystal parameters for the homepage
  const defaultCrystalParams: ModelParameters = {
    color: "#ffffff",
    metalness: 0.1,
    roughness: 0.0,
    transmission: 0.98,
    thickness: 0.5,
    envMapIntensity: 2.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 2.75,
    reflectivity: 1.0,
    iridescence: 0.3,
    iridescenceIOR: 1.3,
    lightIntensity: 2.0,
    opacity: 0.9,
    transparent: true,
    emissiveIntensity: 0.2,
    emissiveColor: "#8B5CF6",
    aoMapIntensity: 1.0,
    displacementScale: 0.1,
    wireframe: false,
    side: 'front',
    textureMap: "",
    normalMap: "",
    roughnessMap: "",
    metalnessMap: "",
  };

  // Default gallery images
  const galleryImages = [
    {
      src: '/placeholder.svg',
      alt: 'Gallery Image 1',
      crystalPosition: 'top-right' as const,
    },
    {
      src: '/placeholder.svg',
      alt: 'Gallery Image 2',
      crystalPosition: 'bottom-left' as const,
    }
  ];

  return (
    <div className="app-container bg-gradient-to-br from-black to-purple-950 min-h-screen">
      <GlassHeader menuItems={menuItems} />
      
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<HomePage crystalParams={defaultCrystalParams} galleryImages={galleryImages} />} />
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
