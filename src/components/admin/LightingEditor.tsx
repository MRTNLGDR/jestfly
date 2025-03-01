
import React, { useState, useRef } from 'react';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Save, Trash, Upload, Eye, Plus, Minus } from 'lucide-react';
import CrystalPreview from './CrystalPreview';
import { ModelParameters, defaultModelParams } from '../../types/model';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Light {
  id: string;
  type: 'directional' | 'point' | 'ambient';
  color: string;
  intensity: number;
  position: { x: number; y: number; z: number };
}

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedLight = lights.find(light => light.id === selectedLightId) || null;

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Process HDR environment map upload
      console.log("HDR file selected:", file.name);
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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
            
            <TabsContent value="lights" className="space-y-6">
              <div className="flex gap-2 mb-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddLight('directional')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Direcional
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddLight('point')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Pontual
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddLight('ambient')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ambiente
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-2 mb-4">
                {lights.map(light => (
                  <Button 
                    key={light.id}
                    variant={selectedLightId === light.id ? "default" : "outline"}
                    size="sm"
                    className="flex flex-col items-center p-2 h-auto"
                    onClick={() => setSelectedLightId(light.id)}
                  >
                    <div 
                      className="w-6 h-6 rounded-full mb-1"
                      style={{ backgroundColor: light.color }}
                    />
                    <span className="text-xs">{light.type}</span>
                  </Button>
                ))}
              </div>
              
              {selectedLight && (
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
              )}
            </TabsContent>
            
            <TabsContent value="environment" className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Mapa de Ambiente HDR</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <Card className="aspect-video flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer relative overflow-hidden rounded-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/50 to-blue-500/30" />
                    <div className="z-10 text-center">
                      <p className="text-xs text-white/70">Estúdio</p>
                    </div>
                  </Card>
                  
                  <Card className="aspect-video flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer relative overflow-hidden rounded-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-800/50 to-orange-500/30" />
                    <div className="z-10 text-center">
                      <p className="text-xs text-white/70">Pôr do Sol</p>
                    </div>
                  </Card>
                  
                  <Card className="aspect-video flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer relative overflow-hidden rounded-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-purple-600/30" />
                    <div className="z-10 text-center">
                      <p className="text-xs text-white/70">Noite</p>
                    </div>
                  </Card>
                  
                  <Card className="aspect-video flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer relative overflow-hidden rounded-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-800/50 to-cyan-500/30" />
                    <div className="z-10 text-center">
                      <p className="text-xs text-white/70">Neon</p>
                    </div>
                  </Card>
                </div>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={triggerFileUpload}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Carregar HDR personalizado
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".hdr,.exr"
                      className="hidden"
                    />
                  </Button>
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label>Intensidade do Ambiente</Label>
                    <span className="text-xs text-gray-400">{params.envMapIntensity.toFixed(2)}</span>
                  </div>
                  <Slider 
                    value={[params.envMapIntensity]} 
                    min={0} 
                    max={5} 
                    step={0.1}
                    onValueChange={(value) => setParams(prev => ({ ...prev, envMapIntensity: value[0] }))}
                    className="py-2"
                  />
                </div>
              </div>
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
