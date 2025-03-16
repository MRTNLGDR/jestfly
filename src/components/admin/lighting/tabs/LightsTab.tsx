
import React from 'react';
import { Button } from '../../../ui/button';
import { Plus } from 'lucide-react';
import LightSelector from '../LightSelector';
import LightEditor from '../LightEditor';
import { useLightingContext } from '../LightingContext';

const LightsTab = () => {
  const { lights, setLights, selectedLightId, setSelectedLightId } = useLightingContext();

  const handleAddLight = (type: 'directional' | 'point' | 'ambient') => {
    const newLight = {
      id: `light-${Date.now()}`,
      type,
      color: type === 'ambient' ? '#ffffff' : '#ff00ff',
      intensity: type === 'ambient' ? 0.5 : 2,
      position: { x: 0, y: 0, z: type === 'ambient' ? 0 : 5 }
    };
    
    setLights([...lights, newLight]);
    setSelectedLightId(newLight.id);
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAddLight('directional')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Direcional
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAddLight('point')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Pontual
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleAddLight('ambient')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ambiente
        </Button>
      </div>
      
      <LightSelector />
      
      {selectedLightId && <LightEditor />}
    </>
  );
};

export default LightsTab;
