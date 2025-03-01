
import React from 'react';
import { Link } from 'react-router-dom';
import CrystalHero from '../components/CrystalHero';
import CrystalGallery from '../components/CrystalGallery';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import ShopPreview from '../components/ShopPreview';
import ConnectionSection from '../components/ConnectionSection';
import Footer from '../components/Footer';
import { ModelParameters } from '../types/model';
import ArtistShowcase from '../components/ArtistShowcase';

interface HomePageProps {
  crystalParams: ModelParameters;
  galleryImages: Array<{
    src: string;
    alt: string;
    crystalPosition: 'default' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  }>;
}

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
  galleryImages 
}) => {
  return (
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
      
      {/* Resource Link Card */}
      <div className="w-full bg-black py-12">
        <div className="container mx-auto px-4">
          <Link to="/resources" className="block">
            <div className="rounded-xl overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-700 opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-center justify-between p-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">3D Resources Marketplace</h3>
                  <p className="text-white/80 max-w-md">Explore premium templates, models, tutorials and more</p>
                </div>
                <div className="bg-white/10 rounded-full p-3 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Artist Showcase Section - NEW */}
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
