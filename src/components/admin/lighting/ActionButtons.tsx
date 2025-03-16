
import React from 'react';
import { Button } from '../../ui/button';
import { Eye, Save } from 'lucide-react';
import { useLightingContext } from './LightingContext';

const ActionButtons = () => {
  const { updatePreview } = useLightingContext();
  
  return (
    <div className="flex gap-3 mt-6">
      <Button 
        className="flex-1 bg-purple-600 hover:bg-purple-700"
        onClick={updatePreview}
      >
        <Eye className="mr-2 h-4 w-4" />
        Visualizar
      </Button>
      
      <Button 
        className="flex-1 bg-green-600 hover:bg-green-700"
      >
        <Save className="mr-2 h-4 w-4" />
        Salvar Preset
      </Button>
    </div>
  );
};

export default ActionButtons;
