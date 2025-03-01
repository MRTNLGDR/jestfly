
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrystalHero from './components/CrystalHero';
import CrystalGallery from './components/CrystalGallery';
import AdminPanel from './pages/AdminPanel';
import CyberMenu from './components/CyberMenu';
import GlassHeader from './components/GlassHeader';
import { defaultModelParams } from './types/model';

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
    { label: 'Admin', href: '/admin' },
  ];
  
  return (
    <Router>
      <div className="app">
        <GlassHeader />
        <Routes>
          <Route path="/" element={
            <>
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
              
              {/* Gallery section with small crystal overlays */}
              <CrystalGallery images={galleryImages} />
              
              {/* Footer text */}
              <div className="w-full py-6 flex justify-between px-8 text-white/70 text-xs uppercase tracking-widest bg-black/80">
                <div>DON'T.RUN</div>
                <div>JESTFLY.CNCPT</div>
                <div>JUST.FLY</div>
              </div>
            </>
          } />
          
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
