
import { useRef } from 'react';
import { ModelParameters, defaultModelParams } from './types/model';
import { useCrystalScene } from './hooks/useCrystalScene';

interface CrystalComponentProps {
  parameters?: Partial<ModelParameters>;
}

const CrystalComponent = ({ parameters = defaultModelParams }: CrystalComponentProps) => {
  const containerRef = useRef<HTMLCanvasElement>(null);
  
  // Use the same hook for consistency, we'll handle the transparent background in the hook
  useCrystalScene(containerRef, {
    ...parameters as ModelParameters,
    // Override specific properties for this component if needed
  });
  
  return <canvas ref={containerRef} style={{ width: '100%', height: '100%', background: 'transparent' }} />;
};

export default CrystalComponent;
