
import React from 'react';
import LightControls from './LightControls';
import LightsList from './LightsList';
import LightEditor from './LightEditor';
import { Light } from './types';

interface LightsTabProps {
  lights: Light[];
  selectedLightId: string | null;
  onAddLight: (type: 'directional' | 'point' | 'ambient') => void;
  onSelectLight: (id: string) => void;
  onLightChange: (id: string, key: keyof Light, value: any) => void;
  onPositionChange: (id: string, axis: 'x' | 'y' | 'z', value: number) => void;
  onRemoveLight: (id: string) => void;
}

const LightsTab = ({ 
  lights, 
  selectedLightId, 
  onAddLight, 
  onSelectLight,
  onLightChange,
  onPositionChange,
  onRemoveLight
}: LightsTabProps) => {
  const selectedLight = lights.find(light => light.id === selectedLightId) || null;
  const isAmbientLight = selectedLight?.type === 'ambient';
  const ambientLightsCount = lights.filter(l => l.type === 'ambient').length;

  return (
    <div className="space-y-6">
      <LightControls onAddLight={onAddLight} />
      
      <LightsList 
        lights={lights} 
        selectedLightId={selectedLightId} 
        onSelectLight={onSelectLight} 
      />
      
      {selectedLight && (
        <LightEditor 
          light={selectedLight}
          onLightChange={onLightChange}
          onPositionChange={onPositionChange}
          onRemoveLight={onRemoveLight}
          disableRemove={isAmbientLight && ambientLightsCount <= 1}
        />
      )}
    </div>
  );
};

export default LightsTab;
