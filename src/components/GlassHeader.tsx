
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
import Logo from './header/Logo';
import WelcomeText from './header/WelcomeText';
import DesktopNav from './header/DesktopNav';
import MobileMenuToggle from './header/MobileMenuToggle';
import HeaderControls from './header/HeaderControls';
import MobileMenu from './header/MobileMenu';

interface MenuItem {
  label: string;
  href: string;
}

interface GlassHeaderProps {
  menuItems?: MenuItem[];
}

const GlassHeader: React.FC<GlassHeaderProps> = ({ menuItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Track page changes and scrolling
  useEffect(() => {
    // Add initial glassmorphism effect when navigating to a new page
    setScrolled(true);
    
    // Reset the effect after a delay (for animation purposes)
    const timer = setTimeout(() => {
      setScrolled(false);
    }, 1000);
    
    // Track scrolling
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [location.pathname]); // Re-run when the path changes
  
  // Define glass effect classes based on scrolled state
  const glassEffect = scrolled 
    ? "bg-black/40 backdrop-blur-xl border-b border-white/20 shadow-lg transition-all duration-500" 
    : "bg-black/20 backdrop-blur-sm transition-all duration-500";
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 ${glassEffect}`}>
      <div className="max-w-full mx-auto px-6 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and welcome text */}
          <div className="flex items-center space-x-6 sm:space-x-12">
            <Logo />
            <WelcomeText />
          </div>
          
          {/* Center - Navigation (desktop only) */}
          <DesktopNav menuItems={menuItems} />
          
          {/* Mobile menu button */}
          <MobileMenuToggle isOpen={mobileMenuOpen} onToggle={toggleMobileMenu} />
          
          {/* Right side - Controls */}
          <HeaderControls />
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        menuItems={menuItems} 
        onItemClick={() => setMobileMenuOpen(false)} 
        activePathname={location.pathname}
      />
    </header>
  );
};

export default GlassHeader;
