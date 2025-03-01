
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Diamond, ChevronRight, Plus, Minus, Menu, X, Globe, DollarSign } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { useLanguage } from '../contexts/LanguageContext';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';

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
  
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    t, 
    availableLanguages, 
    availableCurrencies 
  } = useLanguage();
  
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
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 ${glassEffect}`}>
      <div className="max-w-full mx-auto px-6 sm:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and welcome text */}
          <div className="flex items-center space-x-6 sm:space-x-12">
            <Link to="/" className="flex items-center">
              <Diamond className="h-6 w-6 sm:h-8 sm:w-8 text-white glow-purple" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-xs tracking-widest opacity-70">N1:WELCOME TO THE FUTURE</span>
            </div>
          </div>
          
          {/* Center - Navigation (desktop only) */}
          <nav className="hidden lg:flex items-center">
            <div className="flex items-center space-x-6">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  to={item.href}
                  className={`text-white/80 text-sm hover:text-white transition-colors uppercase ${
                    location.pathname.includes(item.href) && item.href !== '/' ? 'text-white font-medium' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <div className="h-8 mx-6 border-l border-white/20"></div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-white/80 text-sm">[PRG]</span>
                <span className="px-3 py-1 rounded border border-white/20 text-white/90 text-sm">11:03</span>
              </div>
            </div>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Right side - Controls */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Language selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Globe size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-black/90 border border-white/20 text-white p-0" align="end">
                <div className="p-2">
                  <h3 className="text-sm font-medium mb-2 text-white/70">Languages</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {availableLanguages.map((lang) => (
                      <Button 
                        key={lang}
                        variant={lang === language ? "secondary" : "ghost"}
                        size="sm"
                        className="justify-start"
                        onClick={() => setLanguage(lang)}
                      >
                        {t(`language.${lang}`)}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {/* Currency selector */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <DollarSign size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-black/90 border border-white/20 text-white p-0" align="end">
                <div className="p-2">
                  <h3 className="text-sm font-medium mb-2 text-white/70">Currencies</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {availableCurrencies.map((curr) => (
                      <Button 
                        key={curr}
                        variant={curr === currency ? "secondary" : "ghost"}
                        size="sm"
                        className="justify-start"
                        onClick={() => setCurrency(curr)}
                      >
                        {t(`currency.${curr}`)}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <button className="text-white opacity-80 hover:opacity-100" aria-label="Zoom in">
              <Plus className="h-5 w-5" />
            </button>
            
            <button className="text-white opacity-80 hover:opacity-100" aria-label="Zoom out">
              <Minus className="h-5 w-5" />
            </button>
            
            <Link 
              to="/order" 
              className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors"
            >
              <span className="text-sm font-medium uppercase">Pre-order</span>
              <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                <ChevronRight className="h-3 w-3 text-black" />
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black/90 backdrop-blur-md">
          <div className="px-6 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className={`block text-white py-2 hover:text-purple-400 transition-colors uppercase ${
                  location.pathname.includes(item.href) && item.href !== '/' ? 'text-purple-400' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language and currency selectors for mobile */}
            <div className="pt-4 border-t border-white/10">
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-white/70">Language</h3>
                <div className="grid grid-cols-3 gap-2">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        lang === language 
                          ? 'bg-purple-700 text-white' 
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                      onClick={() => setLanguage(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-white/70">Currency</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableCurrencies.map((curr) => (
                    <button
                      key={curr}
                      className={`px-3 py-1.5 text-sm rounded-md ${
                        curr === currency 
                          ? 'bg-purple-700 text-white' 
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      }`}
                      onClick={() => setCurrency(curr)}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Mobile-only controls */}
            <div className="sm:hidden pt-4 border-t border-white/10 flex justify-center space-x-8">
              <Link 
                to="/order" 
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors"
              >
                <span className="text-xs font-medium uppercase">Pre-order</span>
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                  <ChevronRight className="h-2 w-2 text-black" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlassHeader;
