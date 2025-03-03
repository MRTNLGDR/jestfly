
import React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  menuItems: MenuItem[];
  onItemClick: () => void;
  activePathname: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  menuItems,
  onItemClick,
  activePathname,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 bg-black/70 backdrop-blur-xl border-b border-white/10">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            onClick={onItemClick}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-base font-medium ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
