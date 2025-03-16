
import React from 'react';
import LightingPreview from './LightingPreview';
import LightingControls from './LightingControls';

const LightingEditor = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <LightingPreview />
      
      {/* Controls Section */}
      <LightingControls />
    </div>
  );
};

export default LightingEditor;
