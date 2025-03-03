
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlassHeader from './components/GlassHeader';
import { defaultModelParams } from './types/model';
import Footer from './components/Footer';
import LanguageProvider from './contexts/LanguageContext';
import { Toaster } from 'sonner';
import NotesPage from './pages/NotesPage';
import HomePage from './pages/HomePage';
import NewStorePage from './pages/NewStorePage';
import CommunityPage from './pages/CommunityPage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import DemoSubmissionPage from './pages/DemoSubmissionPage';
import LiveStreamPage from './pages/LiveStreamPage';
import PressKitPage from './pages/PressKitPage';
import AirdropPage from './pages/AirdropPage';
import EcommercePage from './pages/EcommercePage';
import AdminPanel from './pages/AdminPanel';
import UnauthorizedPage from './pages/UnauthorizedPage';

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
    clearcoat: 1.0, // Maximum clearcoat for glossiness
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
    { label: 'Resources', href: '/resources' },
    { label: 'Notes', href: '/notes' },
    { label: 'Profile', href: '/profile' },
    { label: 'Demo Submission', href: '/demo-submission' },
    { label: 'Live Stream', href: '/live-stream' },
    { label: 'Press Kit', href: '/press-kit' },
    { label: 'Airdrop', href: '/airdrop' },
  ];
  
  return (
    <LanguageProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-black">
          <GlassHeader menuItems={menuItems} />
          <Toaster position="top-right" />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage crystalParams={crystalParams} galleryImages={galleryImages} />} />
              <Route path="/store/*" element={<NewStorePage />} />
              <Route path="/community/*" element={<CommunityPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/resources" element={<EcommercePage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/demo-submission" element={<DemoSubmissionPage />} />
              <Route path="/live-stream" element={<LiveStreamPage />} />
              <Route path="/press-kit" element={<PressKitPage />} />
              <Route path="/airdrop" element={<AirdropPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
