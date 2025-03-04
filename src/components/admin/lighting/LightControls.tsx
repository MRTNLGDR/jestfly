
import React from 'react';
import { Button } from '../../ui/button';
import { Plus } from 'lucide-react';
import { LightControlsProps } from './types';

const LightControls = ({ onAddLight }: LightControlsProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onAddLight('directional')}
      >
        <Plus className="h-4 w-4 mr-2" />
        Direcional
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onAddLight('point')}
      >
        <Plus className="h-4 w-4 mr-2" />
        Pontual
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onAddLight('ambient')}
      >
        <Plus className="h-4 w-4 mr-2" />
        Ambiente
      </Button>
    </div>
  );
};

export default LightControls;
