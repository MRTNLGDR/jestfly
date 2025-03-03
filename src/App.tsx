import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CrystalHero from './components/CrystalHero';
import CrystalGallery from './components/CrystalGallery';
import AdminPanel from './pages/AdminPanel';
import CyberMenu from './components/CyberMenu';
import GlassHeader from './components/GlassHeader';
import { defaultModelParams } from './types/model';
import NFTSection from './components/NFTSection';
import EventsSection from './components/EventsSection';
import ConnectionSection from './components/ConnectionSection';
import ShopPreview from './components/ShopPreview';
import Footer from './components/Footer';
import RoadmapSection from './components/RoadmapSection';
import StorePage from './pages/StorePage';
import CommunityPage from './pages/CommunityPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import LiveStreamPage from './pages/LiveStreamPage';
import PressKitPage from './pages/PressKitPage';
import AirdropPage from './pages/AirdropPage';
import LanguageProvider from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import AdminAuthPage from './pages/AdminAuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

function App() {
  // Crystal parameters with customized values for enhanced futuristic effect
  const crystalParams = {
    ...defaultModelParams,
    color: "#ffffff", // Pure white base color for better refraction
    metalness: 0.2, // Slight metalness for better reflections
    roughness: 0.01, // Ultra smooth surface for crisp reflections
    transmission: 0.98, // Near perfect transmission for glass effect
    thickness: 0.8, // Increased thickness for more internal refraction
    envMapIntensity: 5.0, // Boosted reflections to showcase neon environment
    clearcoat: 1.0, // Maximum clearcoat for extra glossiness
    clearcoatRoughness: 0.0, // Perfect clearcoat smoothness
    ior: 2.5, // Higher index of refraction for diamond-like effect
    iridescence: 1.0, // Strong iridescence for color shifts
    iridescenceIOR: 2.0, // Enhanced iridescence refraction
    transparent: true,
    opacity: 0.8, // Reduced opacity for better visual effect
    reflectivity: 1.0, // Maximum reflectivity
    emissiveIntensity: 0.08, // Slight emission for added glow
    emissiveColor: "#8B5CF6", // Subtle purple emission color
    lightIntensity: 5.0 // Brighter lights to enhance the model
  };
  
  // Gallery images
  const galleryImages = [
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'default' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'bottom-left' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'center' as const }
  ];
  
  // Menu items for the cyber menu
  const menuItems = [
    { label: 'Início', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Profile', href: '/profile' },
    { label: 'Demo Submission', href: '/demo-submission' },
    { label: 'Live Stream', href: '/live-stream' },
    { label: 'Press Kit', href: '/press-kit' },
    { label: 'Airdrop', href: '/airdrop' },
    { label: 'Admin', href: '/admin' },
  ];
  
  return (
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <div className="app">
            <GlassHeader menuItems={menuItems} />
            <Routes>
              <Route path="/" element={<HomePage crystalParams={crystalParams} galleryImages={galleryImages} />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminAuthPage />} />
              <Route path="/store/*" element={<StorePage />} />
              <Route path="/community/*" element={<CommunityPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/demo-submission" 
                element={
                  <ProtectedRoute allowedProfiles={['artist', 'collaborator']}>
                    <DemoSubmissionPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/live-stream" element={<LiveStreamPage />} />
              <Route path="/press-kit" element={<PressKitPage />} />
              <Route 
                path="/airdrop" 
                element={
                  <ProtectedRoute>
                    <AirdropPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedProfiles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
