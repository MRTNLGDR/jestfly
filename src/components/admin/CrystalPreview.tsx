
import React, { useRef } from 'react';
import { ModelParameters, defaultModelParams } from '../../types/model';
import { useCrystalScene } from '../../hooks/useCrystalScene';

interface CrystalPreviewProps {
  parameters?: Partial<ModelParameters>;
}

const CrystalPreview: React.FC<CrystalPreviewProps> = ({ 
  parameters = defaultModelParams 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Use our custom hook to handle all Babylon.js setup and rendering
  useCrystalScene(canvasRef, parameters as ModelParameters);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default CrystalPreview;
