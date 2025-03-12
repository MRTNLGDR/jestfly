
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Calendar, Gift, Instagram, Video } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

const CommunityNav: React.FC = () => {
  const isMobile = useIsMobile();
  
  const navItems = [
    { path: '/community', label: 'Home', icon: <Users size={isMobile ? 16 : 18} /> },
    { path: '/community/events', label: 'Events', icon: <Calendar size={isMobile ? 16 : 18} /> },
    { path: '/community/giveaways', label: 'Giveaways', icon: <Gift size={isMobile ? 16 : 18} /> },
    { path: '/community/hub', label: 'JestFlyers Hub', icon: <Instagram size={isMobile ? 16 : 18} /> },
    { path: '/live-stream', label: 'Livestream', icon: <Video size={isMobile ? 16 : 18} /> },
  ];

  return (
    <div className="backdrop-blur-md bg-black/40 border-b border-white/10 sticky top-[60px] md:top-[70px] z-10">
      <div className="container mx-auto px-2 md:px-4">
        <nav className="flex justify-between md:justify-start overflow-x-auto hide-scrollbar py-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/community'}
              className={({ isActive }) =>
                `flex items-center px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-white/60 hover:text-white'
                }`
              }
            >
              <span className="mr-1 md:mr-2">{item.icon}</span>
              {isMobile ? '' : item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CommunityNav;
