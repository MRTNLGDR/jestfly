
import React from 'react';
import { Diamond } from 'lucide-react';
import SocialLinks from './SocialLinks';

const FooterBrand: React.FC = () => {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Diamond className="h-8 w-8 text-white glow-purple mr-2" />
        <span className="text-2xl font-bold tracking-tight">JESTFLY</span>
      </div>
      
      <p className="text-white/60 text-sm mb-6 max-w-xs">
        A digital platform merging music, art, and technology to create immersive entertainment experiences.
      </p>
      
      <SocialLinks />
    </div>
  );
};

export default FooterBrand;
