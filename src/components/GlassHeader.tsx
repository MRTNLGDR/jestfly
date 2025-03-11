
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CyberMenu from './CyberMenu';
import JestCoinTicker from './JestCoinTicker';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from './ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import WalletWidget from './jestcoin/WalletWidget';
import HeaderLogo from './header/HeaderLogo';
import DesktopNavigation from './header/DesktopNavigation';
import MobileNavigation from './header/MobileNavigation';
import UserDropdown from './header/UserDropdown';

const GlassHeader = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <HeaderLogo />
          
          {/* Desktop Navigation */}
          <DesktopNavigation />

          {/* Right side: JestCoin, Auth */}
          <div className="flex items-center space-x-4">
            {/* JestCoin Ticker (Desktop) */}
            {!isMobile && <JestCoinTicker compact />}
            
            {/* Wallet Widget (when logged in) */}
            {user && profile && <WalletWidget />}
            
            {/* Authentication */}
            {user && profile ? (
              <UserDropdown />
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                  Entrar
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <CyberMenu isOpen={menuOpen} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <MobileNavigation isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
};

export default GlassHeader;
