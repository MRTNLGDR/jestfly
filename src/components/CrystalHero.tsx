
import React from 'react';
import CrystalComponent from '../CrystalComponent';
import { ModelParameters, defaultModelParams } from '../types/model';
import { Calendar } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import SoundCloudPlayer from './SoundCloudPlayer';
import { useState, useEffect } from 'react';

interface CrystalHeroProps {
  title?: string;
  subtitle?: string;
  crystalParams?: Partial<ModelParameters>;
  className?: string;
}

const CrystalHero: React.FC<CrystalHeroProps> = ({
  title = "JESTFLY",
  subtitle = "Descubra efeitos de vidro hiper-realista",
  crystalParams = defaultModelParams,
  className = "",
}) => {
  const isMobile = useIsMobile();
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Load the SoundCloud Widget API
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
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
        <div className="neo-blur p-3 rounded-lg mb-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">bangers only</h2>
          <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
            <p>IT'S ALWAYS TIME</p>
            <p>TO ENJOY</p>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-4 sm:right-8 z-30 text-right hidden md:block">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1">inspired</h2>
        <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
          <p>FROM 10:00</p>
          <p>TO 19:00</p>
        </div>
      </div>
      
      {/* SoundCloud Player above title */}
      <div className="relative z-30 w-full max-w-md mx-auto mt-14 mb-4 px-4">
        {scriptLoaded && (
          <SoundCloudPlayer 
            isMinimized={isPlayerMinimized}
            setIsMinimized={setIsPlayerMinimized}
          />
        )}
      </div>
      
      {/* Main title without card behind */}
      <div className="absolute z-10 flex items-center justify-center w-full h-full">
        <h1 className="text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold tracking-tighter text-white/20"
            style={{ letterSpacing: '-0.05em' }}>
          {title}
        </h1>
      </div>
      
      {/* Crystal with z-index to appear in front of the title */}
      <div className="hero-crystal relative z-20 w-full h-3/4 flex items-center justify-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl h-full">
          <CrystalComponent parameters={crystalParams} />
        </div>
      </div>
      
      {/* Footer information - simplified on mobile */}
      <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 z-30 flex justify-between items-center text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs">5/15/2023</span>
        </div>
        
        <div className="hidden md:block uppercase">BUS® ©2023</div>
        
        <div className="hidden md:block">50°05'36.2"N 14°26'51.3"E</div>
      </div>
    </section>
  );
};

export default CrystalHero;
