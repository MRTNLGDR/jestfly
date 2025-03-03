
import React from 'react';
import CrystalHero from '@/components/CrystalHero';
import ArtistShowcase from '@/components/ArtistShowcase';
import NFTSection from '@/components/NFTSection';
import EventsSection from '@/components/EventsSection';
import ShopPreview from '@/components/ShopPreview';
import ConnectionSection from '@/components/ConnectionSection';
import RoadmapSection from '@/components/RoadmapSection';
import Footer from '@/components/Footer';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';

const HomePage = ({ crystalParams, galleryImages }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={mainMenuItems} />
      <CrystalHero crystalParams={crystalParams} />
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
