
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuItems } from '../../constants/menuItems';

const DesktopNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {MenuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm ${
            location.pathname === item.path
              ? 'bg-white/10 text-white'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNavigation;
