
import React, { useState, useEffect } from 'react';
import CrystalComponent from '../CrystalComponent';
import { ModelParameters } from '../types/model';
import { Calendar, ArrowDown } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import GlassAudioPlayer from './GlassAudioPlayer';
import JestCoinTicker from './JestCoinTicker';

interface CrystalHeroProps {
  title?: string;
  subtitle?: string;
  crystalParams?: Partial<ModelParameters>;
  className?: string;
}

const CrystalHero: React.FC<CrystalHeroProps> = ({
  title = "JESTFLY",
  subtitle = "FUTURE.TECH",
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
  },
  className = "",
}) => {
  const isMobile = useIsMobile();
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  
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
      
      {/* Main Title - Centered and above the crystal */}
      <div className="relative z-30 text-center pt-10 sm:pt-16">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-100 to-purple-300 glow-text">
          {title}
        </h1>
        <p className="mt-2 text-lg sm:text-xl md:text-2xl text-white/80 font-light tracking-widest">
          {subtitle}
        </p>
      </div>
      
      {/* Side captions - hidden on mobile */}
      <div className="absolute top-1/3 left-4 sm:left-8 z-30 hidden md:block">
        <div className="glass-morphism-subtle p-3 rounded-lg mb-3">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-white">BANGERS ONLY</h2>
          <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
            <p>IT'S ALWAYS TIME</p>
            <p>TO ENJOY</p>
          </div>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-4 sm:right-8 z-30 text-right hidden md:block">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 text-white">INSPIRED</h2>
        <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
          <p>FROM 10:00</p>
          <p>TO 19:00</p>
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
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <div className="flex flex-col items-center animate-bounce opacity-70">
          <span className="text-xs uppercase tracking-widest text-white/60 mb-2">Scroll para explorar</span>
          <ArrowDown className="h-5 w-5 text-white/60" />
        </div>
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
      
      {/* Footer information - simplified on mobile */}
      <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-6 z-30 flex justify-between items-center text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="text-xs">5/15/2023</span>
        </div>
        
        <div className="hidden md:block uppercase">JESTFLY® ©2023</div>
        
        <div className="hidden md:block">50°05'36.2"N 14°26'51.3"E</div>
      </div>
    </section>
  );
};

export default CrystalHero;
