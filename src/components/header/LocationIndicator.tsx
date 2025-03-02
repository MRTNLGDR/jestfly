
import React from 'react';

const LocationIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-white/80 text-sm">[PRG]</span>
      <span className="px-3 py-1 rounded border border-white/20 text-white/90 text-sm">11:03</span>
    </div>
  );
};

export default LocationIndicator;
