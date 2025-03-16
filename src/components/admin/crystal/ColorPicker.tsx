
import React from 'react';
import { Button } from '../../ui/button';
import { RgbaColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  opacity: number;
  onColorChange: (color: { r: number, g: number, b: number, a: number }) => void;
  showColorPicker: boolean;
  onToggleColorPicker: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  opacity,
  onColorChange,
  showColorPicker,
  onToggleColorPicker
}) => {
  const hexToRgba = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: opacity
    } : { r: 255, g: 255, b: 255, a: opacity };
  };

  return (
    <>
      <Button variant="outline" onClick={onToggleColorPicker}>
        <div 
          className="w-5 h-5 rounded-full mr-2" 
          style={{ backgroundColor: color }}
        />
        Cor
      </Button>
      
      {showColorPicker && (
        <div className="absolute z-50 mt-2 p-3 rounded-lg glass-morphism">
          <RgbaColorPicker 
            color={hexToRgba(color)} 
            onChange={onColorChange}
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2" 
            onClick={onToggleColorPicker}
          >
            Fechar
          </Button>
        </div>
      )}
    </>
  );
};

export default ColorPicker;
