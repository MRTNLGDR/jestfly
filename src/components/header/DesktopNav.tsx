
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LocationIndicator from './LocationIndicator';

interface MenuItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  menuItems: MenuItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ menuItems }) => {
  const location = useLocation();
  
  return (
    <nav className="hidden lg:flex items-center">
      <div className="flex items-center space-x-6">
        {menuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`text-white/80 text-sm hover:text-white transition-colors uppercase ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="h-8 mx-6 border-l border-white/20"></div>
      
      <div className="flex items-center space-x-6">
        <LocationIndicator />
      </div>
    </nav>
  );
};

export default DesktopNav;
