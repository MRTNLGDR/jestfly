
import React from 'react';
import CrystalHero from '../components/CrystalHero';
import CrystalGallery from '../components/CrystalGallery';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import ShopPreview from '../components/ShopPreview';
import RoadmapSection from '../components/RoadmapSection';
import ConnectionSection from '../components/ConnectionSection';
import Footer from '../components/Footer';
import { ModelParameters } from '../types/model';

interface HomePageProps {
  crystalParams: ModelParameters;
  galleryImages: Array<{
    src: string;
    alt: string;
    crystalPosition: 'default' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  }>;
}

const HomePage: React.FC<HomePageProps> = ({ crystalParams, galleryImages }) => {
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
  );
};

export default HomePage;
