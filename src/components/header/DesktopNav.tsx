
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Users, Calendar, BookOpen, PenTool, HardDrive, User, Video, Gift } from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface DesktopNavProps {
  menuItems: MenuItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ menuItems }) => {
  const location = useLocation();
  
  // Define ícones para cada item de menu
  const menuWithIcons: MenuItem[] = [
    { label: 'Início', href: '/', icon: Home },
    { label: 'Store', href: '/store', icon: ShoppingBag },
    { label: 'Community', href: '/community', icon: Users },
    { label: 'Bookings', href: '/bookings', icon: Calendar },
    { label: 'Resources', href: '/resources', icon: BookOpen },
    { label: 'Notes', href: '/notes', icon: PenTool },
    { label: 'Demo Submission', href: '/demo-submission', icon: HardDrive },
    { label: 'Press Kit', href: '/press-kit', icon: BookOpen },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Live Stream', href: '/live-stream', icon: Video },
    { label: 'Airdrop', href: '/airdrop', icon: Gift },
  ];
  
  // Encontrar ícone para cada item do menu
  const resolveMenuItem = (item: MenuItem) => {
    const foundItem = menuWithIcons.find(mi => mi.label === item.label);
    return foundItem || { ...item, icon: Home }; // Fallback para Home se não encontrar
  };
  
  // Agrupar itens de menu por categorias com ícones
  const mainMenuItems = menuItems
    .filter(item => ['Início', 'Store', 'Community', 'Bookings'].includes(item.label))
    .map(resolveMenuItem);
  
  const resourceMenuItems = menuItems
    .filter(item => ['Resources', 'Notes', 'Demo Submission', 'Press Kit'].includes(item.label))
    .map(resolveMenuItem);
  
  const userMenuItems = menuItems
    .filter(item => ['Profile', 'Live Stream', 'Airdrop'].includes(item.label))
    .map(resolveMenuItem);
  
  return (
    <nav className="hidden lg:flex items-center flex-wrap">
      {/* Seção Principal */}
      <div className="flex items-center flex-wrap space-x-1 xl:space-x-2">
        {mainMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`px-2 py-1 text-white/80 text-sm hover:text-white transition-colors flex items-center ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium bg-white/5 rounded' : ''
            }`}
          >
            <item.icon className="h-4 w-4 xl:mr-2 lg:mr-0" />
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="h-6 mx-2 xl:mx-3 border-l border-white/20"></div>
      
      {/* Seção de Recursos */}
      <div className="flex items-center flex-wrap space-x-1 xl:space-x-2">
        {resourceMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`px-2 py-1 text-white/80 text-sm hover:text-white transition-colors flex items-center ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium bg-white/5 rounded' : ''
            }`}
          >
            <item.icon className="h-4 w-4 xl:mr-2 lg:mr-0" />
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="h-6 mx-2 xl:mx-3 border-l border-white/20"></div>
      
      {/* Seção do Usuário */}
      <div className="flex items-center flex-wrap space-x-1 xl:space-x-2">
        {userMenuItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href}
            className={`px-2 py-1 text-white/80 text-sm hover:text-white transition-colors flex items-center ${
              location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium bg-white/5 rounded' : ''
            }`}
          >
            <item.icon className="h-4 w-4 xl:mr-2 lg:mr-0" />
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default DesktopNav;
