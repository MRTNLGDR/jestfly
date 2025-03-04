
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from '../layouts/MainLayout';
import CrystalHero from '../components/CrystalHero';
import ArtistShowcase from '../components/ArtistShowcase';
import NFTSection from '../components/NFTSection';
import EventsSection from '../components/EventsSection';
import RoadmapSection from '../components/RoadmapSection';
import CrystalGallery from '../components/CrystalGallery';
import ConnectionSection from '../components/ConnectionSection';
import ShopPreview from '../components/ShopPreview';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import Loading from '../components/ui/loading';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100
    }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const Index: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const authContext = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Longer loading time for animation

    // Add scroll listener for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (isLoading) {
    return (
      <motion.div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative h-24 w-24 animate-spin">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-t-4 border-purple-500"></div>
        </div>
        <motion.h1 
          className="mt-10 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          JESTFLY
        </motion.h1>
        <motion.p 
          className="mt-4 text-white/70 text-lg max-w-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Conectando artistas e fãs no ecossistema ORBVIR através de música, comunidade e inovação digital.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <MainLayout>
      <div className="relative bg-black min-h-screen text-white overflow-hidden">
        {/* Hero Section */}
        <CrystalHero />
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-16 space-y-24">
          {/* Featured Artists */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <ArtistShowcase />
          </motion.div>
          
          {/* NFT Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            style={{ 
              transform: `translateY(${scrollY * 0.05}px)`
            }}
          >
            <NFTSection />
          </motion.div>
          
          {/* Events Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <EventsSection />
          </motion.div>
          
          {/* Roadmap / Timeline */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren}
            style={{ 
              transform: `translateY(${scrollY * -0.03}px)`
            }}
          >
            <RoadmapSection />
          </motion.div>
          
          {/* Crystal Gallery */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <CrystalGallery />
          </motion.div>
          
          {/* Shop Preview */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ShopPreview />
          </motion.div>
          
          {/* Newsletter / Connection */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeInUp}
          >
            <ConnectionSection />
          </motion.div>
        </div>
        
        {/* Admin Link - only visible to admins */}
        {authContext && authContext.user && authContext.user.email === "admin@example.com" && (
          <motion.div 
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/admin" 
                className="bg-purple-800/80 backdrop-blur-sm text-white px-4 py-2 rounded-full 
                          flex items-center space-x-2 hover:bg-purple-700 transition-colors shadow-lg"
              >
                <span>{t('nav.admin')}</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
