
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
    <nav className="hidden lg:flex items-center overflow-x-auto scrollbar-none">
      {/* Seção Principal */}
      <div className="flex items-center space-x-3 xl:space-x-6 whitespace-nowrap">
        {mainMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`text-white/80 text-xs xl:text-sm hover:text-white transition-colors uppercase ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="h-8 mx-3 xl:mx-6 border-l border-white/20"></div>
      
      {/* Seção de Recursos */}
      <div className="flex items-center space-x-3 xl:space-x-6 whitespace-nowrap">
        {resourceMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`text-white/80 text-xs xl:text-sm hover:text-white transition-colors uppercase ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="h-8 mx-3 xl:mx-6 border-l border-white/20"></div>
      
      {/* Seção do Usuário */}
      <div className="flex items-center space-x-3 xl:space-x-6 whitespace-nowrap">
        {userMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`text-white/80 text-xs xl:text-sm hover:text-white transition-colors uppercase ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
        
        <Link 
          to="/login" 
          className="px-2.5 py-1.5 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs xl:text-sm font-medium hover:from-purple-700 hover:to-blue-600 transition-colors"
        >
          Login
        </Link>
      </div>
      
      <div className="h-8 mx-3 xl:mx-6 border-l border-white/20"></div>
      
      <div className="flex items-center">
        <LocationIndicator />
      </div>
    </nav>
  );
};

export default DesktopNav;
