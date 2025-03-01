
import React from 'react';
import CrystalComponent from '../CrystalComponent';
import { ModelParameters, defaultModelParams } from '../types/model';
import { Calendar } from 'lucide-react';

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
  return (
    <section className={`hero relative h-screen flex flex-col pt-20 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-black z-0"></div>
      
      {/* Side captions */}
      <div className="absolute top-1/3 left-8 z-30 md:block hidden">
        <h2 className="text-3xl md:text-4xl font-bold mb-1">bangers only</h2>
        <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
          <p>IT'S ALWAYS TIME</p>
          <p>TO ENJOY</p>
        </div>
      </div>
      
      <div className="absolute top-1/3 right-8 z-30 text-right md:block hidden">
        <h2 className="text-3xl md:text-4xl font-bold mb-1">inspired</h2>
        <div className="space-y-0 uppercase text-xs tracking-wider text-white/70">
          <p>FROM 10:00</p>
          <p>TO 19:00</p>
        </div>
      </div>
      
      {/* Main title behind crystal */}
      <div className="absolute z-10 flex items-center justify-center w-full h-full">
        <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-bold tracking-tighter text-white/20"
            style={{ letterSpacing: '-0.05em' }}>
          {title}
        </h1>
      </div>
      
      {/* Crystal with z-index to appear in front of the title */}
      <div className="hero-crystal relative z-20 w-full h-3/4 flex items-center justify-center">
        <div className="w-full max-w-2xl h-full">
          <CrystalComponent parameters={crystalParams} />
        </div>
      </div>
      
      {/* Footer information */}
      <div className="absolute bottom-6 left-0 right-0 px-6 z-30 flex justify-between items-center text-xs text-white/70">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>5/15/2023</span>
        </div>
        
        <div className="hidden md:block uppercase">BUS® ©2023</div>
        
        <div className="hidden md:block">50°05'36.2"N 14°26'51.3"E</div>
      </div>
    </section>
  );
};

export default CrystalHero;
