
import React from 'react';
import { Slider } from '../../ui/slider';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { HexColorPicker } from 'react-colorful';
import { Trash } from 'lucide-react';
import { Light, LightEditorProps } from './types';

const LightEditor = ({ 
  light, 
  onLightChange, 
  onPositionChange, 
  onRemoveLight,
  disableRemove = false
}: LightEditorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Luz: {light.type}</h4>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onRemoveLight(light.id)}
          disabled={disableRemove}
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
                style={{ backgroundColor: light.color }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none bg-transparent">
              <HexColorPicker 
                color={light.color} 
                onChange={(color) => onLightChange(light.id, 'color', color)} 
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Intensity slider */}
      <div>
        <div className="flex justify-between">
          <Label>Intensidade</Label>
          <span className="text-xs text-gray-400">{light.intensity.toFixed(2)}</span>
        </div>
        <Slider 
          value={[light.intensity]} 
          min={0} 
          max={10} 
          step={0.1}
          onValueChange={(value) => onLightChange(light.id, 'intensity', value[0])}
          className="py-2"
        />
      </div>
      
      {/* Position sliders (not for ambient lights) */}
      {light.type !== 'ambient' && (
        <div className="space-y-4">
          <h4 className="font-semibold">Posição</h4>
          
          <div>
            <div className="flex justify-between">
              <Label>X</Label>
              <span className="text-xs text-gray-400">{light.position.x.toFixed(2)}</span>
            </div>
            <Slider 
              value={[light.position.x]} 
              min={-10} 
              max={10} 
              step={0.1}
              onValueChange={(value) => onPositionChange(light.id, 'x', value[0])}
              className="py-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label>Y</Label>
              <span className="text-xs text-gray-400">{light.position.y.toFixed(2)}</span>
            </div>
            <Slider 
              value={[light.position.y]} 
              min={-10} 
              max={10} 
              step={0.1}
              onValueChange={(value) => onPositionChange(light.id, 'y', value[0])}
              className="py-2"
            />
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label>Z</Label>
              <span className="text-xs text-gray-400">{light.position.z.toFixed(2)}</span>
            </div>
            <Slider 
              value={[light.position.z]} 
              min={-10} 
              max={10} 
              step={0.1}
              onValueChange={(value) => onPositionChange(light.id, 'z', value[0])}
              className="py-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LightEditor;
