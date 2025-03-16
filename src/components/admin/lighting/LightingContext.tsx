
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ModelParameters, defaultModelParams } from '../../../types/model';

export interface Light {
  id: string;
  type: 'directional' | 'point' | 'ambient';
  color: string;
  intensity: number;
  position: { x: number; y: number; z: number };
}

interface LightingContextProps {
  params: ModelParameters;
  setParams: React.Dispatch<React.SetStateAction<ModelParameters>>;
  lights: Light[];
  setLights: React.Dispatch<React.SetStateAction<Light[]>>;
  selectedLightId: string | null;
  setSelectedLightId: React.Dispatch<React.SetStateAction<string | null>>;
  previewParams: ModelParameters;
  setPreviewParams: React.Dispatch<React.SetStateAction<ModelParameters>>;
  updatePreview: () => void;
}

const LightingContext = createContext<LightingContextProps | undefined>(undefined);

export const LightingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<ModelParameters>({...defaultModelParams});
  const [lights, setLights] = useState<Light[]>([
    {
      id: 'purple-dir',
      type: 'directional',
      color: '#8B5CF6',
      intensity: 3,
      position: { x: -5, y: 3, z: 5 }
    },
    {
      id: 'green-dir',
      type: 'directional',
      color: '#2ecc71',
      intensity: 3,
      position: { x: 5, y: -3, z: 5 }
    },
    {
      id: 'ambient',
      type: 'ambient',
      color: '#111111',
      intensity: 0.3,
      position: { x: 0, y: 0, z: 0 }
    }
  ]);
  const [selectedLightId, setSelectedLightId] = useState<string | null>('purple-dir');
  const [previewParams, setPreviewParams] = useState<ModelParameters>({...defaultModelParams});

  const updatePreview = () => {
    setPreviewParams({...params});
  };

  return (
    <LightingContext.Provider value={{
      params,
      setParams,
      lights,
      setLights,
      selectedLightId,
      setSelectedLightId,
      previewParams,
      setPreviewParams,
      updatePreview
    }}>
      {children}
    </LightingContext.Provider>
  );
};

export const useLightingContext = () => {
  const context = useContext(LightingContext);
  if (context === undefined) {
    throw new Error('useLightingContext must be used within a LightingProvider');
  }
  return context;
};
