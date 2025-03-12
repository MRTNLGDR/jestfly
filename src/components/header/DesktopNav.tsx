
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
  
  // Agrupar itens de menu por categorias
  const mainMenuItems = menuItems.filter(item => 
    ['Início', 'Store', 'Community', 'Bookings'].includes(item.label)
  );
  
  const resourceMenuItems = menuItems.filter(item => 
    ['Resources', 'Notes', 'Demo Submission', 'Press Kit'].includes(item.label)
  );
  
  const userMenuItems = menuItems.filter(item => 
    ['Profile', 'Live Stream', 'Airdrop'].includes(item.label)
  );
  
  return (
    <nav className="hidden lg:flex items-center overflow-x-auto scrollbar-thin">
      {/* Seção Principal */}
      <div className="flex items-center space-x-1 xl:space-x-3 whitespace-nowrap">
        {mainMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`px-2 py-1 text-white/80 text-sm hover:text-white transition-colors ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium bg-white/5 rounded' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="h-6 mx-2 xl:mx-3 border-l border-white/20"></div>
      
      {/* Seção de Recursos */}
      <div className="flex items-center space-x-1 xl:space-x-3 whitespace-nowrap">
        {resourceMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`px-2 py-1 text-white/80 text-sm hover:text-white transition-colors ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium bg-white/5 rounded' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="h-6 mx-2 xl:mx-3 border-l border-white/20"></div>
      
      {/* Seção do Usuário */}
      <div className="flex items-center space-x-1 xl:space-x-3 whitespace-nowrap">
        {userMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`px-2 py-1 text-white/80 text-sm hover:text-white transition-colors ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium bg-white/5 rounded' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DesktopNav;
