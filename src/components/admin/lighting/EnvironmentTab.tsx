
import React, { useRef } from 'react';
import { Slider } from '../../ui/slider';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Card } from '../../ui/card';
import { Upload } from 'lucide-react';
import { EnvironmentTabProps } from './types';

const EnvironmentTab = ({ params, setParams }: EnvironmentTabProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  );
};

export default EnvironmentTab;
