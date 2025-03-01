
import './App.css';
import CrystalHero from './components/CrystalHero';
import CrystalGallery from './components/CrystalGallery';
import { defaultModelParams } from './types/model';

function App() {
  // Crystal parameters with customized values
  const crystalParams = {
    ...defaultModelParams,
    color: "#ffffff",
    iridescence: 0.5
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
        title="Bem-vindo ao Mundo dos Cristais" 
        subtitle="Descubra efeitos de vidro hiper-realista"
        crystalParams={crystalParams}
      />
      
      {/* Gallery section with small crystal overlays */}
      <CrystalGallery images={galleryImages} />
    </div>
  );
}

export default App;
