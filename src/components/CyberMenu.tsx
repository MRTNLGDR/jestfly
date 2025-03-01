
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';

interface MenuItem {
  label: string;
  href: string;
}

interface CyberMenuProps {
  items: MenuItem[];
}

const CyberMenu: React.FC<CyberMenuProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  // Only show a limited number of items on mobile
  const displayedItems = isMobile ? items.slice(0, 5) : items;
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-full px-4 sm:px-0 sm:w-auto">
      <div className="neo-blur rounded-xl overflow-hidden px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-1 sm:flex-nowrap sm:space-x-1">
          {displayedItems.map((item, index) => (
            <motion.div
              key={index}
              className="relative"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              initial={{ opacity: 0.8, y: 0 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0.8,
                y: hoveredIndex === index ? -5 : 0,
                transition: { duration: 0.2 }
              }}
            >
              <Link
                to={item.href}
                className="relative block px-2 sm:px-4 py-1.5 sm:py-2 text-white hover:text-white/90"
              >
                {/* Multiple glass-like polygons forming the button */}
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-white/5 transform rotate-45 translate-x-2 translate-y-1 backdrop-blur-sm"
                    style={{ 
                      clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
                      borderLeft: '1px solid rgba(255,255,255,0.1)',
                      borderTop: '1px solid rgba(255,255,255,0.25)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-purple-500/20 transform -rotate-12 -translate-x-1 translate-y-0.5 backdrop-blur-sm"
                    style={{ 
                      clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
                      borderRight: '1px solid rgba(139,92,246,0.3)',
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-white/10 backdrop-blur-sm"
                    style={{ 
                      clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                      borderBottom: '1px solid rgba(255,255,255,0.15)',
                    }}
                  />
                </div>
                
                {/* Text */}
                <span className="relative z-10 font-medium text-xs sm:text-sm tracking-wide">
                  {item.label}
                </span>
                
                {/* Glow effect when hovered */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 -z-10 bg-purple-500/20 filter blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CyberMenu;
