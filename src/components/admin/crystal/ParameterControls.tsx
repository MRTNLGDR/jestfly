
import React from 'react';
import { Slider } from '../../ui/slider';
import { Label } from '../../ui/label';
import { ModelParameters } from '../../../types/model';

interface ParameterControlsProps {
  parameters: ModelParameters;
  onParametersChange: (parameters: ModelParameters) => void;
}

const ParameterControls: React.FC<ParameterControlsProps> = ({ 
  parameters, 
  onParametersChange 
}) => {
  const updateParameter = (key: keyof ModelParameters, value: number) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Metalicidade: {parameters.metalness.toFixed(2)}</Label>
          <Slider 
            value={[parameters.metalness]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={([value]) => updateParameter('metalness', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Rugosidade: {parameters.roughness.toFixed(2)}</Label>
          <Slider 
            value={[parameters.roughness]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={([value]) => updateParameter('roughness', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Transmissão: {parameters.transmission.toFixed(2)}</Label>
          <Slider 
            value={[parameters.transmission]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={([value]) => updateParameter('transmission', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Espessura: {parameters.thickness.toFixed(2)}</Label>
          <Slider 
            value={[parameters.thickness]} 
            min={0} 
            max={5} 
            step={0.1} 
            onValueChange={([value]) => updateParameter('thickness', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">IOR: {parameters.ior.toFixed(2)}</Label>
          <Slider 
            value={[parameters.ior]} 
            min={1} 
            max={3} 
            step={0.05} 
            onValueChange={([value]) => updateParameter('ior', value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Camada Extra: {parameters.clearcoat.toFixed(2)}</Label>
          <Slider 
            value={[parameters.clearcoat]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={([value]) => updateParameter('clearcoat', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Rugosidade da Camada: {parameters.clearcoatRoughness.toFixed(2)}</Label>
          <Slider 
            value={[parameters.clearcoatRoughness]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={([value]) => updateParameter('clearcoatRoughness', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Intensidade do Ambiente: {parameters.envMapIntensity.toFixed(2)}</Label>
          <Slider 
            value={[parameters.envMapIntensity]} 
            min={0} 
            max={5} 
            step={0.1} 
            onValueChange={([value]) => updateParameter('envMapIntensity', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">Iridescência: {parameters.iridescence.toFixed(2)}</Label>
          <Slider 
            value={[parameters.iridescence]} 
            min={0} 
            max={1} 
            step={0.01} 
            onValueChange={([value]) => updateParameter('iridescence', value)}
          />
        </div>
        
        <div>
          <Label className="text-white mb-2 block">IOR Iridescente: {parameters.iridescenceIOR.toFixed(2)}</Label>
          <Slider 
            value={[parameters.iridescenceIOR]} 
            min={1} 
            max={3} 
            step={0.05} 
            onValueChange={([value]) => updateParameter('iridescenceIOR', value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ParameterControls;
