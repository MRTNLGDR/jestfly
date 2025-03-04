
import React, { useState, useEffect } from 'react';
import CrystalComponent from '../CrystalComponent';
import { ModelParameters, defaultModelParams } from '../types/model';
import { Calendar } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import GlassAudioPlayer from './GlassAudioPlayer';
import JestCoinTicker from './JestCoinTicker';
import { useLanguage } from '../contexts/LanguageContext';

interface CrystalHeroProps {
  title?: string;
  subtitle?: string;
  crystalParams?: Partial<ModelParameters>;
  className?: string;
}

const CrystalHero: React.FC<CrystalHeroProps> = ({
  title = "JESTFLY",
  subtitle = "Ecossistema ORBVIR para música, arte e comunidade",
  crystalParams = defaultModelParams,
  className = "",
}) => {
  const isMobile = useIsMobile();
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { t } = useLanguage();
  
  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className={`hero relative h-screen flex flex-col pt-20 overflow-hidden ${className}`}>
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0d0d15] to-[#1A1F2C] z-0"></div>
      
      {/* Dynamic light effects */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] rounded-full bg-[#8B5CF6]/10 blur-[100px] animate-float z-10"></div>
      <div className="absolute bottom-[5%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#4ade80]/10 blur-[100px] animate-float z-10" style={{ animationDelay: '-5s' }}></div>
      
      {/* Side captions - hidden on mobile */}
      <div className="absolute top-1/3 left-4 sm:left-8 z-30 hidden md:block">
        <div className="p-3 rounded-lg mb-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">ORBVIR</h2>
          <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
            <p>CONECTANDO</p>
            <p>ECOSSISTEMAS</p>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-4 sm:right-8 z-30 text-right hidden md:block">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">digital</h2>
        <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
          <p>MÚSICA</p>
          <p>ARTE</p>
        </div>
        
        {/* JestCoin ticker positioned near "inspired" */}
        <div className="mt-6">
          <JestCoinTicker compact={true} />
        </div>
      </div>
      
      {/* Crystal with z-index to appear in front of the title */}
      <div className="hero-crystal relative z-20 w-full h-3/4 flex items-center justify-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl h-full">
          <CrystalComponent parameters={crystalParams} />
        </div>
      </div>
      
      {/* ORBVIR ecosystem description - centered below crystal */}
      <div className="absolute bottom-[20%] left-0 right-0 text-center z-30 px-4">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
          Ecossistema ORBVIR
        </h2>
        <p className="mt-2 text-white/80 max-w-lg mx-auto">
          Onde artistas e fãs se conectam através de música, NFTs e experiências digitais inovadoras
        </p>
      </div>
      
      {/* Glassmorphism audio player - fixed in the corner */}
      <GlassAudioPlayer 
        isMinimized={isPlayerMinimized}
        setIsMinimized={setIsPlayerMinimized}
      />
      
      {/* JestCoin ticker in a more prominent position for mobile */}
      <div className="absolute top-24 right-4 z-30 md:hidden">
        <JestCoinTicker compact={true} />
      </div>
      
      {/* Fuller JestCoin ticker at the bottom for all screen sizes */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center z-30">
        <JestCoinTicker />
      </div>
      
      {/* Footer information - simplified on mobile */}
      <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 z-30 flex justify-between items-center text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs">5/15/2024</span>
        </div>
        
        <div className="hidden md:block uppercase">ORBVIR® ©2024</div>
        
        <div className="hidden md:block">50°05'36.2"N 14°26'51.3"E</div>
      </div>
    </section>
  );
};

export default CrystalHero;
