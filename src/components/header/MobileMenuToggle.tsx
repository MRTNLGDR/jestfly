
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button 
      className="text-white p-1.5 bg-purple-600/80 backdrop-blur-sm rounded-md border border-purple-500/30 hover:bg-purple-700/90 transition-colors lg:hidden flex items-center justify-center"
      onClick={onToggle}
      aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
    >
      {isOpen ? <X size={18} /> : <Menu size={18} />}
    </button>
  );
};

export default MobileMenuToggle;
