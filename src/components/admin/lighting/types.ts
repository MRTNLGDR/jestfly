
import { ModelParameters } from '../../../types/model';

export interface Light {
  id: string;
  type: 'directional' | 'point' | 'ambient';
  color: string;
  intensity: number;
  position: { x: number; y: number; z: number };
}

export interface LightEditorProps {
  light: Light;
  onLightChange: (id: string, key: keyof Light, value: any) => void;
  onPositionChange: (id: string, axis: 'x' | 'y' | 'z', value: number) => void;
  onRemoveLight: (id: string) => void;
  disableRemove?: boolean;
}

export interface LightsListProps {
  lights: Light[];
  selectedLightId: string | null;
  onSelectLight: (id: string) => void;
}

export interface LightControlsProps {
  onAddLight: (type: 'directional' | 'point' | 'ambient') => void;
}

export interface EnvironmentTabProps {
  params: ModelParameters;
  setParams: React.Dispatch<React.SetStateAction<ModelParameters>>;
}
