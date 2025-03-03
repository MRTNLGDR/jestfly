
import React from 'react';
import CrystalHero from '@/components/CrystalHero';
import ArtistShowcase from '@/components/ArtistShowcase';
import NFTSection from '@/components/NFTSection';
import EventsSection from '@/components/EventsSection';
import ShopPreview from '@/components/ShopPreview';
import ConnectionSection from '@/components/ConnectionSection';
import RoadmapSection from '@/components/RoadmapSection';
import Footer from '@/components/Footer';

const HomePage = ({ crystalParams, galleryImages }) => {
  return (
    <>
      <CrystalHero crystalParams={crystalParams} />
      <ArtistShowcase />
      <NFTSection />
      <EventsSection />
      <ShopPreview />
      <RoadmapSection />
      <ConnectionSection />
      <Footer />
    </>
  );
};

export default HomePage;
