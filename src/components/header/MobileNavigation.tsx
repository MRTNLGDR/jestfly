
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItems } from '../../constants/menuItems';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-gradient-to-b from-black/80 to-purple-900/80 backdrop-blur-md z-40 p-4 pt-20">
      <nav className="flex flex-col space-y-2">
        {MenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-3 rounded-md text-white ${
              location.pathname === item.path ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'
            }`}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MobileNavigation;
