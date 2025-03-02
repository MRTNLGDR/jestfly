
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const PreOrderButton: React.FC = () => {
  return (
    <Link 
      to="/order" 
      className="flex items-center space-x-2 px-4 py-2 rounded-full border border-white/30 text-white bg-black/40 hover:bg-black/60 transition-colors"
    >
      <span className="text-sm font-medium uppercase">Pre-order</span>
      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
        <ChevronRight className="h-3 w-3 text-black" />
      </div>
    </Link>
  );
};

export default PreOrderButton;
