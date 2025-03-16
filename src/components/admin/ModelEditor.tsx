import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RgbaColorPicker } from 'react-colorful';
import CrystalPreview from './CrystalPreview';
import { ModelParameters, defaultModelParams } from '../../types/model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ModelType } from '@/integrations/supabase/schema';
import { Json } from '@/integrations/supabase/types';

const ModelEditor = () => {
  const [parameters, setParameters] = useState<ModelParameters>({...defaultModelParams});
  const [modelName, setModelName] = useState('Novo Modelo');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const hexToRgba = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
      a: 1
    } : { r: 255, g: 255, b: 255, a: 1 };
  };
  
  const rgbaToHex = ({ r, g, b }: { r: number, g: number, b: number }) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };
  
  const handleColorChange = (color: { r: number, g: number, b: number, a: number }) => {
    setParameters({
      ...parameters,
      color: rgbaToHex(color),
      opacity: color.a
    });
  };
  
  const fetchSavedModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('model_type', 'crystal')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setSavedModels(data);
      }
    } catch (error) {
      console.error('Erro ao buscar modelos:', error);
      toast.error('Não foi possível carregar os modelos salvos.');
    }
  };
  
  const loadModel = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setModelName(data.name);
        setParameters(data.params as unknown as ModelParameters);
        setSelectedModelId(data.id);
        toast.success(`Modelo "${data.name}" carregado com sucesso!`);
      }
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
      toast.error('Não foi possível carregar o modelo selecionado.');
    } finally {
      setLoading(false);
    }
  };
  
  const saveModel = async () => {
    try {
      setLoading(true);
      
      const modelData = {
        name: modelName,
        params: parameters as unknown as Json,
        model_type: 'crystal' as ModelType,
        is_active: true
      };
      
      let response;
      
      if (selectedModelId) {
        response = await supabase
          .from('models')
          .update(modelData)
          .eq('id', selectedModelId);
      } else {
        response = await supabase
          .from('models')
          .insert([modelData]);
      }
      
      const { error } = response;
      
      if (error) {
        throw error;
      }
      
      toast.success(`Modelo "${modelName}" salvo com sucesso!`);
      fetchSavedModels();
    } catch (error) {
      console.error('Erro ao salvar modelo:', error);
      toast.error('Não foi possível salvar o modelo.');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteModel = async () => {
    if (!selectedModelId) return;
    
    if (!confirm(`Tem certeza que deseja excluir o modelo "${modelName}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', selectedModelId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Modelo "${modelName}" excluído com sucesso!`);
      fetchSavedModels();
      
      setParameters({...defaultModelParams});
      setModelName('Novo Modelo');
      setSelectedModelId(null);
      
    } catch (error) {
      console.error('Erro ao excluir modelo:', error);
      toast.error('Não foi possível excluir o modelo.');
    } finally {
      setLoading(false);
    }
  };
  
  const createNewModel = () => {
    setParameters({...defaultModelParams});
    setModelName('Novo Modelo');
    setSelectedModelId(null);
    toast.info('Criando novo modelo...');
  };
  
  useEffect(() => {
    fetchSavedModels();
  }, []);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="glass-morphism lg:col-span-1 h-[400px] lg:h-[700px] overflow-hidden">
        <CardContent className="p-0 h-full">
          <CrystalPreview parameters={parameters} />
        </CardContent>
      </Card>
      
      <div className="glass-morphism lg:col-span-1 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Parâmetros do Cristal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-full">
            <Label htmlFor="modelName" className="text-white mb-2 block">Nome do Modelo</Label>
            <div className="flex gap-2">
              <Input 
                id="modelName" 
                value={modelName} 
                onChange={(e) => setModelName(e.target.value)} 
                className="bg-white/10 border-white/20 text-white"
              />
              <Button variant="outline" disabled={loading} onClick={() => setShowColorPicker(!showColorPicker)}>
                <div 
                  className="w-5 h-5 rounded-full mr-2" 
                  style={{ backgroundColor: parameters.color }}
                />
                Cor
              </Button>
            </div>
            
            {showColorPicker && (
              <div className="absolute z-50 mt-2 p-3 rounded-lg glass-morphism">
                <RgbaColorPicker 
                  color={hexToRgba(parameters.color)} 
                  onChange={handleColorChange}
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2" 
                  onClick={() => setShowColorPicker(false)}
                >
                  Fechar
                </Button>
              </div>
            )}
            
            <div className="mt-4">
              <Label htmlFor="savedModels" className="text-white mb-2 block">Modelos Salvos</Label>
              <div className="flex gap-2">
                <select 
                  id="savedModels" 
                  className="w-full bg-white/10 border-white/20 text-white rounded-md h-10 px-3"
                  value={selectedModelId || ""}
                  onChange={(e) => e.target.value && loadModel(e.target.value)}
                >
                  <option value="">Selecione um modelo</option>
                  {savedModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                <Button variant="outline" onClick={createNewModel} disabled={loading}>
                  Novo
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Metalicidade: {parameters.metalness.toFixed(2)}</Label>
              <Slider 
                value={[parameters.metalness]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={([value]) => setParameters({...parameters, metalness: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Rugosidade: {parameters.roughness.toFixed(2)}</Label>
              <Slider 
                value={[parameters.roughness]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={([value]) => setParameters({...parameters, roughness: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Transmissão: {parameters.transmission.toFixed(2)}</Label>
              <Slider 
                value={[parameters.transmission]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={([value]) => setParameters({...parameters, transmission: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Espessura: {parameters.thickness.toFixed(2)}</Label>
              <Slider 
                value={[parameters.thickness]} 
                min={0} 
                max={5} 
                step={0.1} 
                onValueChange={([value]) => setParameters({...parameters, thickness: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">IOR: {parameters.ior.toFixed(2)}</Label>
              <Slider 
                value={[parameters.ior]} 
                min={1} 
                max={3} 
                step={0.05} 
                onValueChange={([value]) => setParameters({...parameters, ior: value})}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Camada Extra: {parameters.clearcoat.toFixed(2)}</Label>
              <Slider 
                value={[parameters.clearcoat]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={([value]) => setParameters({...parameters, clearcoat: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Rugosidade da Camada: {parameters.clearcoatRoughness.toFixed(2)}</Label>
              <Slider 
                value={[parameters.clearcoatRoughness]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={([value]) => setParameters({...parameters, clearcoatRoughness: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Intensidade do Ambiente: {parameters.envMapIntensity.toFixed(2)}</Label>
              <Slider 
                value={[parameters.envMapIntensity]} 
                min={0} 
                max={5} 
                step={0.1} 
                onValueChange={([value]) => setParameters({...parameters, envMapIntensity: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">Iridescência: {parameters.iridescence.toFixed(2)}</Label>
              <Slider 
                value={[parameters.iridescence]} 
                min={0} 
                max={1} 
                step={0.01} 
                onValueChange={([value]) => setParameters({...parameters, iridescence: value})}
              />
            </div>
            
            <div>
              <Label className="text-white mb-2 block">IOR Iridescente: {parameters.iridescenceIOR.toFixed(2)}</Label>
              <Slider 
                value={[parameters.iridescenceIOR]} 
                min={1} 
                max={3} 
                step={0.05} 
                onValueChange={([value]) => setParameters({...parameters, iridescenceIOR: value})}
              />
            </div>
          </div>
          
          <div className="col-span-full flex gap-2 mt-6">
            <Button 
              onClick={saveModel} 
              className="flex-1" 
              disabled={loading}
              variant="default"
            >
              {loading ? 'Salvando...' : selectedModelId ? 'Atualizar Modelo' : 'Salvar Modelo'}
            </Button>
            
            {selectedModelId && (
              <Button 
                onClick={deleteModel} 
                variant="destructive" 
                disabled={loading}
              >
                {loading ? 'Excluindo...' : 'Excluir'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelEditor;
