
import React from 'react';
import { ModelParameters } from '../../../types/model';
import ParameterControls from './ParameterControls';
import ModelSelector from './ModelSelector';
import ColorPicker from './ColorPicker';
import ActionButtons from './ActionButtons';

interface ControlsSectionProps {
  parameters: ModelParameters;
  onParametersChange: (parameters: ModelParameters) => void;
  modelName: string;
  onModelNameChange: (name: string) => void;
  savedModels: any[];
  selectedModelId: string | null;
  onLoadModel: (id: string) => void;
  onCreateNewModel: () => void;
  onSave: () => void;
  onDelete: () => void;
  loading: boolean;
  color: string;
  opacity: number;
  onColorChange: (color: { r: number, g: number, b: number, a: number }) => void;
  showColorPicker: boolean;
  onToggleColorPicker: () => void;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  parameters,
  onParametersChange,
  modelName,
  onModelNameChange,
  savedModels,
  selectedModelId,
  onLoadModel,
  onCreateNewModel,
  onSave,
  onDelete,
  loading,
  color,
  opacity,
  onColorChange,
  showColorPicker,
  onToggleColorPicker
}) => {
  return (
    <div className="glass-morphism lg:col-span-1 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Parâmetros do Cristal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Model Selection */}
        <ModelSelector
          modelName={modelName}
          onModelNameChange={onModelNameChange}
          savedModels={savedModels}
          selectedModelId={selectedModelId}
          onLoadModel={onLoadModel}
          onCreateNewModel={onCreateNewModel}
          loading={loading}
          colorPickerButton={
            <ColorPicker
              color={color}
              opacity={opacity}
              onColorChange={onColorChange}
              showColorPicker={showColorPicker}
              onToggleColorPicker={onToggleColorPicker}
            />
          }
        />
        
        {/* Parameter Controls */}
        <ParameterControls
          parameters={parameters}
          onParametersChange={onParametersChange}
        />
        
        {/* Action Buttons */}
        <ActionButtons
          onSave={onSave}
          onDelete={onDelete}
          loading={loading}
          hasSelectedModel={!!selectedModelId}
        />
      </div>
    </div>
  );
};

export default ControlsSection;
