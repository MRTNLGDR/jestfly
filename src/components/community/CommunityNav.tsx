
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Calendar, Gift, Instagram, Video } from 'lucide-react';

const CommunityNav: React.FC = () => {
  const navItems = [
    { path: '/community', label: 'Home', icon: <Users size={18} /> },
    { path: '/community/events', label: 'Events', icon: <Calendar size={18} /> },
    { path: '/community/giveaways', label: 'Giveaways', icon: <Gift size={18} /> },
    { path: '/community/hub', label: 'JestFlyers Hub', icon: <Instagram size={18} /> },
    { path: '/live-stream', label: 'Livestream', icon: <Video size={18} /> },
  ];

  return (
    <div className="backdrop-blur-md bg-black/40 border-b border-white/10 sticky top-20 z-10">
      <div className="container mx-auto px-4">
        <nav className="flex overflow-x-auto pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.path === '/community'}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white border-b-2 border-purple-500'
                    : 'text-white/60 hover:text-white'
                }`
              }
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CommunityNav;
