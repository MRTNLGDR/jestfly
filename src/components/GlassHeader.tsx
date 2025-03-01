
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Diamond, ChevronRight, Plus, Minus, Menu, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';

interface MenuItem {
  label: string;
  href: string;
}

interface GlassHeaderProps {
  menuItems?: MenuItem[];
}

const GlassHeader: React.FC<GlassHeaderProps> = ({ menuItems = [] }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and welcome text */}
          <div className="flex items-center space-x-4 sm:space-x-10">
            <Link to="/" className="flex items-center">
              <Diamond className="h-6 w-6 sm:h-8 sm:w-8 text-white glow-purple" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-xs tracking-widest opacity-70">N1:WELCOME TO THE FUTURE</span>
            </div>
          </div>
          
          {/* Center - Navigation (desktop only) */}
          <nav className="hidden lg:flex items-center space-x-6 sm:space-x-8">
            {menuItems.map((item) => (
              <Link 
                key={item.href} 
                to={item.href}
                className="text-white/80 text-sm hover:text-white transition-colors uppercase"
              >
                {item.label}
              </Link>
            ))}
            
            <div className="h-10 mx-4 border-l border-white/20"></div>
            
            <Link 
              to="/info"
              className="text-white/80 text-sm hover:text-white transition-colors"
            >
              .info
            </Link>
            
            <div className="flex items-center space-x-2">
              <span className="text-white/80 text-sm">[PRG]</span>
              <span className="px-3 py-1 rounded border border-white/20 text-white/90 text-sm">11:03</span>
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
          
          {/* Right side - Controls (hide on small mobile) */}
          <div className="hidden sm:flex md:flex items-center space-x-4">
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
                className="block text-white py-2 hover:text-purple-400 transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
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
      
      {/* Bottom border */}
      <div className="w-full h-px bg-white/10"></div>
    </header>
  );
};

export default GlassHeader;
