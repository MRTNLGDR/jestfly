
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { ModelParameters, defaultModelParams } from '../../types/model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ModelType } from '@/integrations/supabase/schema';
import { Json } from '@/integrations/supabase/types';
import PreviewSection from './crystal/PreviewSection';
import ParameterControls from './crystal/ParameterControls';
import ModelSelector from './crystal/ModelSelector';
import ColorPicker from './crystal/ColorPicker';
import ActionButtons from './crystal/ActionButtons';

const ModelEditor = () => {
  const [parameters, setParameters] = useState<ModelParameters>({...defaultModelParams});
  const [modelName, setModelName] = useState('Novo Modelo');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [savedModels, setSavedModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
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
      {/* Preview Section */}
      <PreviewSection parameters={parameters} />
      
      {/* Controls Section */}
      <div className="glass-morphism lg:col-span-1 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Parâmetros do Cristal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Selection */}
          <ModelSelector
            modelName={modelName}
            onModelNameChange={setModelName}
            savedModels={savedModels}
            selectedModelId={selectedModelId}
            onLoadModel={loadModel}
            onCreateNewModel={createNewModel}
            loading={loading}
            colorPickerButton={
              <ColorPicker
                color={parameters.color}
                opacity={parameters.opacity}
                onColorChange={handleColorChange}
                showColorPicker={showColorPicker}
                onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
              />
            }
          />
          
          {/* Parameter Controls */}
          <ParameterControls
            parameters={parameters}
            onParametersChange={setParameters}
          />
          
          {/* Action Buttons */}
          <ActionButtons
            onSave={saveModel}
            onDelete={deleteModel}
            loading={loading}
            hasSelectedModel={!!selectedModelId}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelEditor;
