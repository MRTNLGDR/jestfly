
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button 
      className="text-white p-1.5 bg-black/60 rounded-md border border-white/10 lg:hidden flex items-center justify-center"
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      {isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  );
};

export default MobileMenuToggle;
