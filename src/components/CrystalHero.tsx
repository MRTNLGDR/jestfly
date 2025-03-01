
import React from 'react';
import CrystalComponent from '../CrystalComponent';
import { ModelParameters, defaultModelParams } from '../types/model';

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
    <section className={`hero relative h-screen flex flex-col items-center justify-center ${className}`}>
      {/* Purple title positioned behind the crystal */}
      <div className="absolute z-0 flex items-center justify-center w-full">
        <h1 className="text-6xl md:text-8xl font-bold text-purple-600 opacity-80" 
            style={{ textShadow: '0 0 15px rgba(139, 92, 246, 0.7)' }}>
          {title}
        </h1>
      </div>
      
      {/* Crystal with z-index to appear in front of the title */}
      <div className="hero-crystal relative z-10 w-full h-4/5">
        <CrystalComponent parameters={crystalParams} />
      </div>
      
      {/* Subtitle positioned at the bottom */}
      <div className="hero-content relative z-20 text-center pb-8">
        <p className="text-lg md:text-xl text-white/80">{subtitle}</p>
      </div>
    </section>
  );
};

export default CrystalHero;
