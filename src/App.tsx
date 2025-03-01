
import './App.css';
import CrystalHero from './components/CrystalHero';
import CrystalGallery from './components/CrystalGallery';
import { defaultModelParams } from './types/model';

function App() {
  // Crystal parameters with customized values for enhanced reflections and transparency
  const crystalParams = {
    ...defaultModelParams,
    color: "#ffffff",
    metalness: 0.0,
    roughness: 0.05,
    transmission: 1.0,
    thickness: 0.5,
    envMapIntensity: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 1.5,
    iridescence: 0.5,
    iridescenceIOR: 1.5,
    transparent: true
  };
  
  // Gallery images
  const galleryImages = [
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'default' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'bottom-left' as const },
    { src: '/assets/imagem1.jpg', alt: 'Imagem de exemplo', crystalPosition: 'center' as const }
  ];
  
  return (
    <div className="app">
      {/* Hero section with 3D crystal */}
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
