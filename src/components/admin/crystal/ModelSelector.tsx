
import React from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface SavedModel {
  id: string;
  name: string;
  [key: string]: any;
}

interface ModelSelectorProps {
  modelName: string;
  onModelNameChange: (name: string) => void;
  savedModels: SavedModel[];
  selectedModelId: string | null;
  onLoadModel: (id: string) => void;
  onCreateNewModel: () => void;
  loading: boolean;
  colorPickerButton: React.ReactNode;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  modelName,
  onModelNameChange,
  savedModels,
  selectedModelId,
  onLoadModel,
  onCreateNewModel,
  loading,
  colorPickerButton
}) => {
  return (
    <div className="col-span-full">
      <Label htmlFor="modelName" className="text-white mb-2 block">Nome do Modelo</Label>
      <div className="flex gap-2">
        <Input 
          id="modelName" 
          value={modelName} 
          onChange={(e) => onModelNameChange(e.target.value)} 
          className="bg-white/10 border-white/20 text-white"
        />
        {colorPickerButton}
      </div>
      
      <div className="mt-4">
        <Label htmlFor="savedModels" className="text-white mb-2 block">Modelos Salvos</Label>
        <div className="flex gap-2">
          <select 
            id="savedModels" 
            className="w-full bg-white/10 border-white/20 text-white rounded-md h-10 px-3"
            value={selectedModelId || ""}
            onChange={(e) => e.target.value && onLoadModel(e.target.value)}
          >
            <option value="">Selecione um modelo</option>
            {savedModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <Button variant="outline" onClick={onCreateNewModel} disabled={loading}>
            Novo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
