
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
import { ModelParameters } from './types/model';

// Definindo props padrão para a HomePage
const defaultCrystalParams: ModelParameters = {
  color: '#5D3FD3',
  roughness: 0.2,
  metalness: 0.8,
  envMapIntensity: 1.0,
  clearcoat: 0.5,
  clearcoatRoughness: 0.1,
  transmission: 0.6,
  ior: 1.5,
  thickness: 0.5,
  reflectivity: 0.5,
  iridescence: 0.3,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 400],
  sheen: 0.0,
  sheenRoughness: 0.0,
  sheenColor: '#ffffff',
  specularIntensity: 1.0,
  specularColor: '#ffffff',
  rotation: [0, 0, 0],
  position: [0, 0, 0],
  scale: [1, 1, 1],
  segments: 32,
  lightIntensity: 1.0,
  opacity: 1.0,
  transparent: true,
  textureMap: null,
  normalMap: null,
  roughnessMap: null,
  metalnessMap: null,
  emissiveMap: null,
  emissiveColor: '#000000',
  emissiveIntensity: 0,
  envMap: null,
  wireframe: false
};

const defaultGalleryImages = [
  { src: '/textures/presets/crystal.jpg', alt: 'Crystal Texture', crystalPosition: 'default' as const },
  { src: '/textures/presets/emissive.jpg', alt: 'Emissive Texture', crystalPosition: 'bottom-left' as const },
  { src: '/textures/presets/frosted-glass.jpg', alt: 'Frosted Glass Texture', crystalPosition: 'center' as const },
  { src: '/textures/presets/glass.jpg', alt: 'Glass Texture', crystalPosition: 'top-right' as const },
  { src: '/textures/presets/gold.jpg', alt: 'Gold Texture', crystalPosition: 'top-left' as const },
  { src: '/textures/presets/holographic.jpg', alt: 'Holographic Texture', crystalPosition: 'bottom-right' as const }
];

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative overflow-hidden bg-black">
          <GlassHeader />
          
          <Routes>
            <Route path="/" element={<HomePage crystalParams={defaultCrystalParams} galleryImages={defaultGalleryImages} />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/community/*" element={<CommunityPage />} />
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
