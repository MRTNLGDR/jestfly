
import React from 'react';
import { Link } from 'react-router-dom';
import CrystalHero from '../components/CrystalHero';
import CrystalGallery from '../components/CrystalGallery';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import ShopPreview from '../components/ShopPreview';
import ConnectionSection from '../components/ConnectionSection';
import Footer from '../components/Footer';
import { ModelParameters } from '../types/modelParameters';
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
  crystalParams,
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
