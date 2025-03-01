
import React, { useState, useRef } from 'react';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Save, Trash, Upload, Eye } from 'lucide-react';
import CrystalPreview from './CrystalPreview';
import { ModelParameters, defaultModelParams } from '../../types/model';
import { Switch } from '../ui/switch';

const ModelEditor = () => {
  const [params, setParams] = useState<ModelParameters>({...defaultModelParams});
  const [hexColor, setHexColor] = useState('#ffffff');
  const [previewParams, setPreviewParams] = useState<ModelParameters>({...defaultModelParams});
  const [previewVisible, setPreviewVisible] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (color: string) => {
    setHexColor(color);
    setParams(prev => ({ ...prev, color }));
  };

  const handleParamChange = (key: keyof ModelParameters, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleNumericInput = (key: keyof ModelParameters, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      handleParamChange(key, numValue);
    }
  };

  const updatePreview = () => {
    setPreviewParams({...params});
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Process file upload logic here
      console.log("File selected:", file.name);
      // In a real implementation, you would upload this to a server
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <Card className="glass-morphism overflow-hidden rounded-lg h-[600px] relative">
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setPreviewVisible(!previewVisible)}
            className="bg-black/20 hover:bg-black/40 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        {previewVisible && (
          <CrystalPreview parameters={previewParams} />
        )}
      </Card>

      {/* Controls Section */}
      <div className="space-y-6">
        <Card className="glass-morphism p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gradient">Parâmetros do Material</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Cor Base</Label>
              <div className="flex gap-2 items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 p-0 rounded-md"
                      style={{ backgroundColor: hexColor }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none bg-transparent">
                    <HexColorPicker color={hexColor} onChange={handleColorChange} />
                  </PopoverContent>
                </Popover>
                <Input 
                  value={hexColor} 
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="font-mono"
                />
              </div>
            </div>

            {/* Material Properties */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between">
                  <Label>Metálico</Label>
                  <span className="text-xs text-gray-400">{params.metalness.toFixed(2)}</span>
                </div>
                <Slider 
                  value={[params.metalness]} 
                  min={0} 
                  max={1} 
                  step={0.01}
                  onValueChange={(value) => handleParamChange('metalness', value[0])}
                  className="py-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label>Rugosidade</Label>
                  <span className="text-xs text-gray-400">{params.roughness.toFixed(2)}</span>
                </div>
                <Slider 
                  value={[params.roughness]} 
                  min={0} 
                  max={1} 
                  step={0.01}
                  onValueChange={(value) => handleParamChange('roughness', value[0])}
                  className="py-2"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <div className="flex justify-between">
                <Label>Transmissão</Label>
                <span className="text-xs text-gray-400">{params.transmission.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.transmission]} 
                min={0} 
                max={1} 
                step={0.01}
                onValueChange={(value) => handleParamChange('transmission', value[0])}
                className="py-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>Espessura</Label>
                <span className="text-xs text-gray-400">{params.thickness.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.thickness]} 
                min={0} 
                max={2} 
                step={0.01}
                onValueChange={(value) => handleParamChange('thickness', value[0])}
                className="py-2"
              />
            </div>
          </div>
        </Card>
        
        <Card className="glass-morphism p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gradient">Parâmetros Avançados</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between">
                <Label>Índice de Refração (IOR)</Label>
                <span className="text-xs text-gray-400">{params.ior.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.ior]} 
                min={1} 
                max={3} 
                step={0.01}
                onValueChange={(value) => handleParamChange('ior', value[0])}
                className="py-2"
              />
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
                onValueChange={(value) => handleParamChange('envMapIntensity', value[0])}
                className="py-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <div className="flex justify-between">
                <Label>Camada clara</Label>
                <span className="text-xs text-gray-400">{params.clearcoat.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.clearcoat]} 
                min={0} 
                max={1} 
                step={0.01}
                onValueChange={(value) => handleParamChange('clearcoat', value[0])}
                className="py-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>Rugosidade da camada</Label>
                <span className="text-xs text-gray-400">{params.clearcoatRoughness.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.clearcoatRoughness]} 
                min={0} 
                max={1} 
                step={0.01}
                onValueChange={(value) => handleParamChange('clearcoatRoughness', value[0])}
                className="py-2"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <div className="flex justify-between">
                <Label>Iridescência</Label>
                <span className="text-xs text-gray-400">{params.iridescence.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.iridescence]} 
                min={0} 
                max={1} 
                step={0.01}
                onValueChange={(value) => handleParamChange('iridescence', value[0])}
                className="py-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between">
                <Label>IOR da Iridescência</Label>
                <span className="text-xs text-gray-400">{params.iridescenceIOR.toFixed(2)}</span>
              </div>
              <Slider 
                value={[params.iridescenceIOR]} 
                min={1} 
                max={2.5} 
                step={0.01}
                onValueChange={(value) => handleParamChange('iridescenceIOR', value[0])}
                className="py-2"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-6">
            <Switch 
              id="wireframe"
              checked={params.wireframe}
              onCheckedChange={(checked) => handleParamChange('wireframe', checked)}
            />
            <Label htmlFor="wireframe">Exibir wireframe</Label>
          </div>
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
          
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={triggerFileUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Carregar Modelo
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".glb,.gltf,.obj"
              className="hidden"
            />
          </Button>
          
          <Button 
            variant="destructive"
            className="flex-1"
          >
            <Trash className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModelEditor;
