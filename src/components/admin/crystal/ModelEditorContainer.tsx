
import React, { useState, useEffect } from 'react';
import { ModelParameters, defaultModelParams } from '../../../types/model';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';
import PreviewSection from './PreviewSection';
import ControlsSection from './ControlsSection';

const ModelEditorContainer = () => {
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
        model_type: 'crystal' as string,
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
      <ControlsSection 
        parameters={parameters}
        onParametersChange={setParameters}
        modelName={modelName}
        onModelNameChange={setModelName}
        savedModels={savedModels}
        selectedModelId={selectedModelId}
        onLoadModel={loadModel}
        onCreateNewModel={createNewModel}
        onSave={saveModel}
        onDelete={deleteModel}
        loading={loading}
        color={parameters.color}
        opacity={parameters.opacity}
        onColorChange={handleColorChange}
        showColorPicker={showColorPicker}
        onToggleColorPicker={() => setShowColorPicker(!showColorPicker)}
      />
    </div>
  );
};

export default ModelEditorContainer;
