
import React from 'react';
import { Plus, Minus } from 'lucide-react';

const ZoomControls: React.FC = () => {
  return (
    <>
      <button className="text-white opacity-80 hover:opacity-100" aria-label="Zoom in">
        <Plus className="h-5 w-5" />
      </button>
      
      <button className="text-white opacity-80 hover:opacity-100" aria-label="Zoom out">
        <Minus className="h-5 w-5" />
      </button>
    </>
  );
};

export default ZoomControls;
