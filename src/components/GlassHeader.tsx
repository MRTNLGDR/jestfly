
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import UserProfileMenu from './UserProfileMenu';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Comunidade', href: '/community' },
  { label: 'Loja', href: '/store' },
  { label: 'Reservas', href: '/bookings' },
  { label: 'Demo', href: '/demo-submission' },
  { label: 'Ao Vivo', href: '/live-stream' },
  { label: 'Press Kit', href: '/press-kit' },
  { label: 'Airdrop', href: '/airdrop' },
];

const GlassHeader: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo className="mr-2" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm text-white/70 hover:text-white transition-colors",
                  location.pathname === item.href || location.pathname.startsWith(`${item.href}/`) 
                    ? "text-white font-medium" 
                    : ""
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            {user ? (
              <UserProfileMenu />
            ) : (
              <Link
                to="/auth/login"
                className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-2 rounded text-white hover:opacity-90 transition-opacity"
              >
                Entrar
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="ml-4 md:hidden text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 border-t border-white/10">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm text-white/70 hover:text-white transition-colors py-2",
                    location.pathname === item.href || location.pathname.startsWith(`${item.href}/`) 
                      ? "text-white font-medium" 
                      : ""
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlassHeader;
