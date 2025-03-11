
import React from 'react';
import { Globe, Github, Twitter, Instagram } from 'lucide-react';

const SocialLinks: React.FC = () => {
  return (
    <div className="flex space-x-4">
      <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Globe className="h-5 w-5 text-white/80" />
      </a>
      <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Twitter className="h-5 w-5 text-white/80" />
      </a>
      <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Instagram className="h-5 w-5 text-white/80" />
      </a>
      <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
        <Github className="h-5 w-5 text-white/80" />
      </a>
    </div>
  );
};

export default SocialLinks;
