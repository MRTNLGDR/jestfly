
import React from 'react';
import CrystalHero from '../components/CrystalHero';
import CrystalGallery from '../components/CrystalGallery';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import ShopPreview from '../components/ShopPreview';
import ConnectionSection from '../components/ConnectionSection';
import Footer from '../components/Footer';
import { ModelParameters } from '../types/model';
import ArtistShowcase from '../components/ArtistShowcase';
import GlassHeader from '../components/GlassHeader';

interface HomePageProps {
  crystalParams?: Partial<ModelParameters>;
  galleryImages?: Array<{
    src: string;
    alt: string;
    crystalPosition: 'default' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  }>;
}

const defaultGalleryImages = [
  {
    src: "/public/textures/environments/night.jpg",
    alt: "Night cityscape with neon lights",
    crystalPosition: 'top-right' as const
  },
  {
    src: "/public/textures/environments/city.jpg",
    alt: "Modern city architecture",
    crystalPosition: 'bottom-left' as const
  },
  {
    src: "/public/textures/environments/studio.jpg",
    alt: "Music studio equipment",
    crystalPosition: 'center' as const
  },
  {
    src: "/public/textures/environments/sunset.jpg",
    alt: "DJ performance at sunset",
    crystalPosition: 'top-left' as const
  }
];

const HomePage: React.FC<HomePageProps> = ({ 
  crystalParams = {
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
  }, 
  galleryImages = defaultGalleryImages 
}) => {
  // Menu items for the header
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Live', href: '/live-stream' },
    { label: 'Demo', href: '/demo-submission' },
    { label: 'Press', href: '/press-kit' },
  ];

  return (
    <>
      {/* Header */}
      <GlassHeader menuItems={menuItems} />
      
      {/* Hero section with futuristic crystal */}
      <CrystalHero 
        title="JESTFLY" 
        subtitle="FUTURE.TECH"
        crystalParams={crystalParams}
      />
      
      {/* Quick facts marquee like Nike's site */}
      <div className="w-full bg-black py-4 border-t border-b border-white/10 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            JESTFLY · MÚSICA · TECNOLOGIA · FUTURO · JESTFLY · MÚSICA · TECNOLOGIA · FUTURO · JESTFLY · MÚSICA · TECNOLOGIA · FUTURO
          </div>
        </div>
      </div>
      
      {/* Artist Showcase Section */}
      <ArtistShowcase />
      
      {/* NFT Section */}
      <NFTSection />
      
      {/* Events Section */}
      <EventsSection />
      
      {/* Gallery section with small crystal overlays */}
      <CrystalGallery images={galleryImages} />
      
      {/* Shop Categories Preview */}
      <ShopPreview />
      
      {/* Connection/Newsletter Section */}
      <ConnectionSection />
      
      {/* Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
