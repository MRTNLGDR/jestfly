
import React from 'react';
import { Menu, X } from 'lucide-react';

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MobileMenuToggle: React.FC<MobileMenuToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 rounded-md text-white/80 hover:text-white"
      aria-expanded={isOpen}
    >
      <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      {isOpen ? (
        <X className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
};

export default MobileMenuToggle;
