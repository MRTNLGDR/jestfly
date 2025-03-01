
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Diamond, ChevronRight, Plus, Minus } from 'lucide-react';

const GlassHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and welcome text */}
          <div className="flex items-center space-x-10">
            <Link to="/" className="flex items-center">
              <Diamond className="h-8 w-8 text-white glow-purple" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-xs tracking-widest opacity-70">N1:WELCOME TO THE FUTURE</span>
            </div>
          </div>
          
          {/* Center - Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {['shop', 'about', 'collection'].map((item) => (
              <Link 
                key={item} 
                to={`/${item}`}
                className="text-white/80 text-sm hover:text-white transition-colors uppercase"
              >
                {item}
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
          
          {/* Right side - Controls */}
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex text-white opacity-80 hover:opacity-100">
              <Plus className="h-5 w-5" />
            </button>
            
            <button className="hidden md:flex text-white opacity-80 hover:opacity-100">
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
      
      {/* Bottom border */}
      <div className="w-full h-px bg-white/10"></div>
    </header>
  );
};

export default GlassHeader;
