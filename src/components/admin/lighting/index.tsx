
import React, { useState, useRef } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Eye, Save } from 'lucide-react';
import CrystalPreview from '../CrystalPreview';
import { Light } from './types';
import { ModelParameters, defaultModelParams } from '../../../types/model';
import LightsTab from './LightsTab';
import EnvironmentTab from './EnvironmentTab';

const LightingEditor = () => {
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
  
  const handleAddLight = (type: 'directional' | 'point' | 'ambient') => {
    const newLight: Light = {
      id: `light-${Date.now()}`,
      type,
      color: type === 'ambient' ? '#ffffff' : '#ff00ff',
      intensity: type === 'ambient' ? 0.5 : 2,
      position: { x: 0, y: 0, z: type === 'ambient' ? 0 : 5 }
    };
    
    setLights([...lights, newLight]);
    setSelectedLightId(newLight.id);
  };

  const handleRemoveLight = (id: string) => {
    setLights(lights.filter(light => light.id !== id));
    if (selectedLightId === id) {
      setSelectedLightId(lights.length > 0 ? lights[0].id : null);
    }
  };

  const handleLightChange = (id: string, key: keyof Light, value: any) => {
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

  const updatePreview = () => {
    // In a real implementation, you would need to pass the lights to the preview
    setPreviewParams({...params});
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <Card className="glass-morphism overflow-hidden rounded-lg h-[600px]">
        <CrystalPreview parameters={previewParams} />
      </Card>

      {/* Controls Section */}
      <div className="space-y-6">
        <Card className="glass-morphism p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gradient">Editor de Iluminação</h3>
          
          <Tabs defaultValue="lights" className="w-full">
            <TabsList className="grid grid-cols-2 gap-2 w-full mb-4">
              <TabsTrigger value="lights" className="data-[state=active]:bg-purple-600">
                Luzes
              </TabsTrigger>
              <TabsTrigger value="environment" className="data-[state=active]:bg-purple-600">
                Ambiente HDR
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="lights">
              <LightsTab 
                lights={lights}
                selectedLightId={selectedLightId}
                onAddLight={handleAddLight}
                onSelectLight={setSelectedLightId}
                onLightChange={handleLightChange}
                onPositionChange={handlePositionChange}
                onRemoveLight={handleRemoveLight}
              />
            </TabsContent>
            
            <TabsContent value="environment">
              <EnvironmentTab 
                params={params}
                setParams={setParams}
              />
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="flex gap-3 mt-6">
          <Button 
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={updatePreview}
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
          
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Preset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LightingEditor;
