import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import UserProfileMenu from './UserProfileMenu';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GlassHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
            <nav className="hidden md:flex items-center ml-10">
              <Link to="/" className="text-white mr-6 hover:text-purple-400 transition-colors">
                Home
              </Link>
              <Link to="/community" className="text-white mr-6 hover:text-purple-400 transition-colors">
                Community
              </Link>
              <Link to="/store" className="text-white mr-6 hover:text-purple-400 transition-colors">
                Store
              </Link>
              <Link to="/bookings" className="text-white mr-6 hover:text-purple-400 transition-colors">
                Bookings
              </Link>
              <Link to="/demo-submission" className="text-white mr-6 hover:text-purple-400 transition-colors">
                Demo Submission
              </Link>
              <Link to="/live-stream" className="text-white mr-6 hover:text-purple-400 transition-colors">
                Live Stream
              </Link>
              <Link to="/press-kit" className="text-white hover:text-purple-400 transition-colors">
                Press Kit
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <UserProfileMenu />
            ) : (
              <Button 
                asChild 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Link to="/auth/login">Entrar</Link>
              </Button>
            )}
            <button 
              className="p-2 text-white md:hidden focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="bg-black/80 backdrop-blur-md md:hidden absolute top-full left-0 w-full py-4">
          <nav className="flex flex-col items-center">
            <Link to="/" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/community" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Community
            </Link>
            <Link to="/store" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Store
            </Link>
            <Link to="/bookings" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Bookings
            </Link>
             <Link to="/demo-submission" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Demo Submission
            </Link>
            <Link to="/live-stream" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Live Stream
            </Link>
            <Link to="/press-kit" className="text-white py-2 hover:text-purple-400 transition-colors" onClick={closeMobileMenu}>
              Press Kit
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default GlassHeader;
