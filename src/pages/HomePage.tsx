
import React from 'react';
import { Link } from 'react-router-dom';
import CrystalHero from '../components/CrystalHero';
import CrystalGallery from '../components/CrystalGallery';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import ConnectionSection from '../components/ConnectionSection';
import ShopPreview from '../components/ShopPreview';
import RoadmapSection from '../components/RoadmapSection';
import Footer from '../components/Footer';
import ArtistShowcase from '../components/ArtistShowcase';
import JestCoinTicker from '../components/JestCoinTicker';
import { ModelParameters } from '../types/modelParameters';

interface HomePageProps {
  crystalParams: ModelParameters;
  galleryImages: { src: string; alt: string; crystalPosition: 'default' | 'bottom-left' | 'center' }[];
}

const HomePage: React.FC<HomePageProps> = ({ crystalParams, galleryImages }) => {
  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <JestCoinTicker compact={true} />
      </div>
      
      <section className="hero">
        <div className="hero-content">
          <h1 className="gradient-title">JestFly Records</h1>
          <p>Revolutionary Electronic Music & Digital Art</p>
          
          {/* Discreet link to resources section */}
          <div className="mt-8">
            <Link 
              to="/templates" 
              className="text-sm text-white/50 hover:text-white/80 transition-colors underline"
            >
              Explore Creative Resources
            </Link>
          </div>
        </div>
        <div className="hero-crystal">
          <CrystalHero crystalParams={crystalParams} />
        </div>
      </section>

      <CrystalGallery images={galleryImages} />
      <ArtistShowcase />
      <NFTSection />
      <EventsSection />
      <ShopPreview />
      <RoadmapSection />
      <ConnectionSection />
      <Footer />
    </div>
  );
};

export default HomePage;
