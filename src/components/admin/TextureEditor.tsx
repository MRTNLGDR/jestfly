
import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { Upload, Save, Eye, Trash, ImagePlus } from 'lucide-react';
import CrystalPreview from './CrystalPreview';
import { ModelParameters, defaultModelParams } from '../../types/model';

interface TextureItem {
  id: string;
  name: string;
  type: 'diffuse' | 'normal' | 'roughness' | 'metalness' | 'displacement' | 'emissive';
  url: string | null;
  file: File | null;
}

const TextureEditor = () => {
  const [params, setParams] = useState<ModelParameters>({...defaultModelParams});
  const [previewParams, setPreviewParams] = useState<ModelParameters>({...defaultModelParams});
  const [textures, setTextures] = useState<TextureItem[]>([
    { id: 'diffuse', name: 'Difusa', type: 'diffuse', url: null, file: null },
    { id: 'normal', name: 'Normal', type: 'normal', url: null, file: null },
    { id: 'roughness', name: 'Rugosidade', type: 'roughness', url: null, file: null },
    { id: 'metalness', name: 'Metálica', type: 'metalness', url: null, file: null },
    { id: 'displacement', name: 'Deslocamento', type: 'displacement', url: null, file: null },
    { id: 'emissive', name: 'Emissiva', type: 'emissive', url: null, file: null },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTextureId, setSelectedTextureId] = useState<string | null>('diffuse');

  const selectedTexture = textures.find(texture => texture.id === selectedTextureId) || null;

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>, textureId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      
      setTextures(textures.map(texture => 
        texture.id === textureId ? { ...texture, url, file } : texture
      ));
      
      // Update the corresponding texture map in params
      if (textureId === 'diffuse') {
        setParams(prev => ({ ...prev, textureMap: url }));
      } else if (textureId === 'normal') {
        setParams(prev => ({ ...prev, normalMap: url }));
      } else if (textureId === 'roughness') {
        setParams(prev => ({ ...prev, roughnessMap: url }));
      } else if (textureId === 'metalness') {
        setParams(prev => ({ ...prev, metalnessMap: url }));
      } else if (textureId === 'displacement') {
        setParams(prev => ({ ...prev, displacementMap: url }));
      } else if (textureId === 'emissive') {
        setParams(prev => ({ ...prev, emissiveColor: url }));
      }
    }
  };

  const triggerFileUpload = (textureId: string) => {
    setSelectedTextureId(textureId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeTexture = (textureId: string) => {
    setTextures(textures.map(texture => 
      texture.id === textureId ? { ...texture, url: null, file: null } : texture
    ));
    
    // Update the corresponding texture map in params
    if (textureId === 'diffuse') {
      setParams(prev => ({ ...prev, textureMap: '' }));
    } else if (textureId === 'normal') {
      setParams(prev => ({ ...prev, normalMap: '' }));
    } else if (textureId === 'roughness') {
      setParams(prev => ({ ...prev, roughnessMap: '' }));
    } else if (textureId === 'metalness') {
      setParams(prev => ({ ...prev, metalnessMap: '' }));
    } else if (textureId === 'displacement') {
      setParams(prev => ({ ...prev, displacementMap: '' }));
    } else if (textureId === 'emissive') {
      setParams(prev => ({ ...prev, emissiveColor: '#000000' }));
    }
  };

  const updatePreview = () => {
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
          <h3 className="text-xl font-bold mb-4 text-gradient">Editor de Texturas</h3>
          
          <Tabs defaultValue="textures" className="w-full">
            <TabsList className="grid grid-cols-2 gap-2 w-full mb-4">
              <TabsTrigger value="textures" className="data-[state=active]:bg-purple-600">
                Mapas de Textura
              </TabsTrigger>
              <TabsTrigger value="presets" className="data-[state=active]:bg-purple-600">
                Presets
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="textures" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {textures.map(texture => (
                  <Card 
                    key={texture.id}
                    className={`overflow-hidden ${selectedTextureId === texture.id ? 'ring-2 ring-purple-500' : ''}`}
                    onClick={() => setSelectedTextureId(texture.id)}
                  >
                    <div className="aspect-square relative">
                      {texture.url ? (
                        <img 
                          src={texture.url} 
                          alt={texture.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <ImagePlus className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                        <p className="text-xs text-white truncate">{texture.name}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {selectedTexture && (
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Textura: {selectedTexture.name}</h4>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => triggerFileUpload(selectedTexture.id)}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload
                      </Button>
                      
                      {selectedTexture.url && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTexture(selectedTexture.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleTextureUpload(e, selectedTexture.id)}
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  {selectedTexture.id === 'displacement' && (
                    <div>
                      <div className="flex justify-between">
                        <Label>Escala de Deslocamento</Label>
                        <span className="text-xs text-gray-400">{params.displacementScale.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[params.displacementScale]} 
                        min={0} 
                        max={1} 
                        step={0.01}
                        onValueChange={(value) => setParams(prev => ({ ...prev, displacementScale: value[0] }))}
                        className="py-2"
                      />
                    </div>
                  )}
                  
                  {selectedTexture.id === 'emissive' && (
                    <div>
                      <div className="flex justify-between">
                        <Label>Intensidade Emissiva</Label>
                        <span className="text-xs text-gray-400">{params.emissiveIntensity.toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[params.emissiveIntensity]} 
                        min={0} 
                        max={2} 
                        step={0.01}
                        onValueChange={(value) => setParams(prev => ({ ...prev, emissiveIntensity: value[0] }))}
                        className="py-2"
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="presets" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                  <div className="aspect-square relative">
                    <img 
                      src="/textures/presets/crystal.jpg" 
                      alt="Crystal" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                      <p className="text-sm text-white">Cristal</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                  <div className="aspect-square relative">
                    <img 
                      src="/textures/presets/glass.jpg" 
                      alt="Glass" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                      <p className="text-sm text-white">Vidro</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                  <div className="aspect-square relative">
                    <img 
                      src="/textures/presets/metal.jpg" 
                      alt="Metal" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                      <p className="text-sm text-white">Metal</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-purple-500 transition-all">
                  <div className="aspect-square relative">
                    <img 
                      src="/textures/presets/holographic.jpg" 
                      alt="Holographic" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                      <p className="text-sm text-white">Holográfico</p>
                    </div>
                  </div>
                </Card>
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
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextureEditor;
