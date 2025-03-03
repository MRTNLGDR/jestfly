
import React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuItem {
  label: string;
  href: string;
}

interface DesktopNavProps {
  menuItems: MenuItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ menuItems }) => {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {menuItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.href}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors hover:text-white/90 ${
              isActive ? 'text-white' : 'text-white/70'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default DesktopNav;
