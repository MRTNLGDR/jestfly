
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { AuthProvider } from './contexts/AuthContext';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/toaster';

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
    { label: 'Galeria', href: '/galeria' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Profile', href: '/profile' },
    { label: 'Admin', href: '/admin' },
  ];
  
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={
              <>
                <GlassHeader />
                {/* Hero section with futuristic crystal and Nike-inspired layout */}
                <CrystalHero 
                  title="JESTFLY" 
                  subtitle="FUTURE.TECH"
                  crystalParams={crystalParams}
                />
                
                {/* Quick facts marquee like Nike's site */}
                <div className="w-full bg-black py-4 border-t border-b border-white/10 overflow-hidden">
                  <div className="marquee-container">
                    <div className="marquee-content">
                      QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS . QUICK FACTS
                    </div>
                  </div>
                </div>
                
                {/* NFT Section */}
                <NFTSection />
                
                {/* Events Section */}
                <EventsSection />
                
                {/* Gallery section with small crystal overlays */}
                <CrystalGallery images={galleryImages} />
                
                {/* Shop Categories Preview */}
                <ShopPreview />
                
                {/* Roadmap Section */}
                <RoadmapSection />
                
                {/* Connection/Newsletter Section */}
                <ConnectionSection />
                
                {/* Footer */}
                <Footer />
              </>
            } />
            
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
          
          <CyberMenu items={menuItems} />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
