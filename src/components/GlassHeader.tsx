
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Diamond, Home, Image, Settings } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const GlassHeader: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const navItems: NavItem[] = [
    { icon: <Home className="h-5 w-5" />, label: 'Início', href: '/' },
    { icon: <Diamond className="h-5 w-5" />, label: 'Cristais', href: '/galeria' },
    { icon: <Image className="h-5 w-5" />, label: 'Galeria', href: '/galeria' },
    { icon: <Settings className="h-5 w-5" />, label: 'Admin', href: '/admin' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="glass-polygon-container relative h-16 flex items-center justify-between overflow-hidden backdrop-blur-xl">
          {/* Background polygons */}
          <div className="absolute inset-0 -z-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i}
                className="absolute bg-white/5 border border-white/10"
                style={{
                  width: '70%',
                  height: '160%',
                  top: `${Math.random() * 50 - 80}%`,
                  left: `${i * 15}%`,
                  transform: `rotate(${15 + i * 5}deg)`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Diamond className="h-8 w-8 text-purple-500 glow-purple" />
              <span className="ml-2 text-xl font-bold text-white text-gradient">JESTFLY</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                initial={{ opacity: 0.9 }}
                animate={{ 
                  opacity: hoveredIndex === index ? 1 : 0.9,
                  y: hoveredIndex === index ? -2 : 0
                }}
              >
                <Link 
                  to={item.href}
                  className="relative block px-4 py-2"
                >
                  {/* Glass polygons for each nav item */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-white/5 transform rotate-45 backdrop-blur-sm"
                      style={{ 
                        clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        borderTop: '1px solid rgba(255,255,255,0.25)',
                      }}
                    />
                    <div 
                      className="absolute inset-0 bg-purple-500/10 transform -rotate-12 backdrop-blur-sm"
                      style={{ 
                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                        borderRight: '1px solid rgba(139,92,246,0.3)',
                      }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center">
                    {item.icon}
                    <span className="text-xs font-medium mt-1 text-white/90">{item.label}</span>
                  </div>
                  
                  {/* Glow effect when hovered */}
                  {hoveredIndex === index && (
                    <motion.div
                      className="absolute inset-0 -z-10 bg-purple-500/20 filter blur-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Mobile menu button - simplified for now */}
          <div className="md:hidden">
            <button className="p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlassHeader;
