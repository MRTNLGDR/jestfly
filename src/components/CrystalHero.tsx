
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
    <section className={`hero ${className}`}>
      <div className="hero-content">
        <h1 className="gradient-title">{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="hero-crystal">
        <CrystalComponent parameters={crystalParams} />
      </div>
    </section>
  );
};

export default CrystalHero;
