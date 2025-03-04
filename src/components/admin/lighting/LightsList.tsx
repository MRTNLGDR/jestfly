
import React from 'react';
import { Button } from '../../ui/button';
import { LightsListProps } from './types';

const LightsList = ({ lights, selectedLightId, onSelectLight }: LightsListProps) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      {lights.map(light => (
        <Button 
          key={light.id}
          variant={selectedLightId === light.id ? "default" : "outline"}
          size="sm"
          className="flex flex-col items-center p-2 h-auto"
          onClick={() => onSelectLight(light.id)}
        >
          <div 
            className="w-6 h-6 rounded-full mb-1"
            style={{ backgroundColor: light.color }}
          />
          <span className="text-xs">{light.type}</span>
        </Button>
      ))}
    </div>
  );
};

export default LightsList;
