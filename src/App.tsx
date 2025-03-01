
import './App.css';
import CrystalHero from './components/CrystalHero';
import CrystalGallery from './components/CrystalGallery';
import { defaultModelParams } from './types/model';

function App() {
  // Crystal parameters with customized values for enhanced hyper-realistic effect
  const crystalParams = {
    ...defaultModelParams,
    color: "#ffffff", // Pure white base color for better refraction
    metalness: 0.1, // Slight metalness for better reflections
    roughness: 0.01, // Ultra smooth surface for crisp reflections
    transmission: 0.99, // Near perfect transmission for glass effect
    thickness: 0.8, // Increased thickness for more internal refraction
    envMapIntensity: 3.0, // Boosted reflections to showcase neon environment
    clearcoat: 1.0, // Maximum clearcoat for extra glossiness
    clearcoatRoughness: 0.0, // Perfect clearcoat smoothness
    ior: 2.33, // Higher index of refraction for diamond-like effect
    iridescence: 0.9, // Strong iridescence for color shifts
    iridescenceIOR: 1.8, // Enhanced iridescence refraction
    transparent: true,
    opacity: 0.75, // Reduced opacity for better text visibility
    reflectivity: 1.0, // Maximum reflectivity
    emissiveIntensity: 0.05, // Slight emission for added glow
    emissiveColor: "#8B5CF6" // Subtle purple emission color
  };
  
  // Gallery images
  const galleryImages = [
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'default' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'bottom-left' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'center' as const }
  ];
  
  return (
    <div className="app">
      {/* Hero section with hyper-realistic 3D crystal and purple title */}
      <CrystalHero 
        title="JESTFLY" 
        subtitle="Descubra efeitos de vidro hiper-realista"
        crystalParams={crystalParams}
      />
      
      {/* Gallery section with small crystal overlays */}
      <CrystalGallery images={galleryImages} />
    </div>
  );
}

export default App;
