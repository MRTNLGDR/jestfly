
import React from 'react';
import { Slider } from '../../ui/slider';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Trash } from 'lucide-react';
import { useLightingContext } from './LightingContext';

const LightEditor = () => {
  const { lights, setLights, selectedLightId, setSelectedLightId } = useLightingContext();
  
  const selectedLight = lights.find(light => light.id === selectedLightId) || null;
  if (!selectedLight) return null;

  const handleRemoveLight = (id: string) => {
    setLights(lights.filter(light => light.id !== id));
    if (selectedLightId === id) {
      setSelectedLightId(lights.length > 0 ? lights[0].id : null);
    }
  };

  const handleLightChange = (id: string, key: string, value: any) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, [key]: value } : light
    ));
  };

  const handlePositionChange = (id: string, axis: 'x' | 'y' | 'z', value: number) => {
    setLights(lights.map(light => 
      light.id === id ? { 
        ...light, 
        position: { ...light.position, [axis]: value } 
      } : light
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Luz: {selectedLight.type}</h4>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => handleRemoveLight(selectedLight.id)}
          disabled={selectedLight.type === 'ambient' && lights.filter(l => l.type === 'ambient').length <= 1}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Color picker */}
      <div className="space-y-2">
        <Label>Cor</Label>
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-10 h-10 p-0 rounded-md"
                style={{ backgroundColor: selectedLight.color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none bg-transparent">
              <HexColorPicker 
                color={selectedLight.color} 
                onChange={(color) => handleLightChange(selectedLight.id, 'color', color)} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Intensity slider */}
      <div>
        <div className="flex justify-between">
          <Label>Intensidade</Label>
          <span className="text-xs text-gray-400">{selectedLight.intensity.toFixed(2)}</span>
        </div>
        <Slider 
          value={[selectedLight.intensity]} 
          min={0} 
          max={10} 
          step={0.1}
          onValueChange={(value) => handleLightChange(selectedLight.id, 'intensity', value[0])}
          className="py-2"
        />
      </div>
      
      {/* Position sliders (not for ambient lights) */}
      {selectedLight.type !== 'ambient' && (
        <div className="space-y-4">
          <h4 className="font-semibold">Posição</h4>
          
          <div>
            <div className="flex justify-between">
              <Label>X</Label>
              <span className="text-xs text-gray-400">{selectedLight.position.x.toFixed(2)}</span>
            </div>
            <Slider 
              value={[selectedLight.position.x]} 
              min={-10} 
              max={10} 
              step={0.1}
              onValueChange={(value) => handlePositionChange(selectedLight.id, 'x', value[0])}
              className="py-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label>Y</Label>
              <span className="text-xs text-gray-400">{selectedLight.position.y.toFixed(2)}</span>
            </div>
            <Slider 
              value={[selectedLight.position.y]} 
              min={-10} 
              max={10} 
              step={0.1}
              onValueChange={(value) => handlePositionChange(selectedLight.id, 'y', value[0])}
              className="py-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label>Z</Label>
              <span className="text-xs text-gray-400">{selectedLight.position.z.toFixed(2)}</span>
            </div>
            <Slider 
              value={[selectedLight.position.z]} 
              min={-10} 
              max={10} 
              step={0.1}
              onValueChange={(value) => handlePositionChange(selectedLight.id, 'z', value[0])}
              className="py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LightEditor;
