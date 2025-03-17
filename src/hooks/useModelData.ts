
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { ModelParameters, defaultModelParams } from '@/types/model';
import { ModelType, SavedModel } from '@/types/model';

export const useModelData = () => {
  // Usar a preferência de modelo do localStorage ou o padrão (diamond)
  const [currentModel, setCurrentModel] = useState(() => {
    const savedModel = localStorage.getItem("preferredModel");
    return savedModel || "diamond";
  });
  
  // Sketchfab URL para embedar
  const [sketchfabUrl, setSketchfabUrl] = useState<string | null>(null);
  const [sketchfabModelData, setSketchfabModelData] = useState<SavedModel | null>(null);
  
  // Carregar parâmetros do modelo do localStorage
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const savedParams = localStorage.getItem("modelParameters");
    return savedParams ? JSON.parse(savedParams) : defaultModelParams;
  });

  // Carregar o título e subtítulo do localStorage
  const [titleText, setTitleText] = useState(() => {
    return localStorage.getItem("siteTitle") || "MKSHA";
  });
  
  const [subtitleText, setSubtitleText] = useState(() => {
    return localStorage.getItem("siteSubtitle") || "It was the year 2076. The substance had arrived.";
  });

  // Carregar o modelo ativo do Supabase
  useEffect(() => {
    const fetchActiveModel = async () => {
      try {
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('is_active', true)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          console.log("Modelo ativo encontrado:", data);
          // Cast model_type to ensure type safety
          const typedData = {
            ...data,
            model_type: data.model_type as ModelType
          };
          
          localStorage.setItem("preferredModel", typedData.model_type);
          setCurrentModel(typedData.model_type);
          
          if (typedData.model_type === 'sketchfab' && typedData.url) {
            setSketchfabUrl(typedData.url);
            setSketchfabModelData(typedData as SavedModel);
            localStorage.setItem("sketchfabUrl", typedData.url);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar modelo ativo:", error);
      }
    };
    
    fetchActiveModel();
  }, []);

  // Verificar alterações nos parâmetros e textos salvos no localStorage
  useEffect(() => {
    const checkForUpdates = () => {
      // Verificar parâmetros do modelo
      const savedParams = localStorage.getItem("modelParameters");
      if (savedParams) {
        const newParams = JSON.parse(savedParams);
        // Comparar com os parâmetros atuais para ver se precisa atualizar
        if (JSON.stringify(newParams) !== JSON.stringify(modelParams)) {
          console.log("Atualizando parâmetros do modelo na página inicial");
          setModelParams(newParams);
        }
      }
      
      // Verificar tipo de modelo
      const savedModel = localStorage.getItem("preferredModel");
      if (savedModel && savedModel !== currentModel) {
        console.log("Atualizando tipo de modelo na página inicial:", savedModel);
        setCurrentModel(savedModel);
        
        // Se mudou para Sketchfab, verificar URL
        if (savedModel === 'sketchfab') {
          const url = localStorage.getItem("sketchfabUrl");
          if (url) {
            setSketchfabUrl(url);
          }
        }
      }
      
      // Verificar textos
      const savedTitle = localStorage.getItem("siteTitle");
      if (savedTitle && savedTitle !== titleText) {
        setTitleText(savedTitle);
      }
      
      const savedSubtitle = localStorage.getItem("siteSubtitle");
      if (savedSubtitle && savedSubtitle !== subtitleText) {
        setSubtitleText(savedSubtitle);
      }
    };
    
    // Verificar a cada 500ms por mudanças para uma atualização mais rápida
    const interval = setInterval(checkForUpdates, 500);
    
    // Adicionar event listener para o evento storage
    window.addEventListener('storage', checkForUpdates);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkForUpdates);
    };
  }, [modelParams, currentModel, titleText, subtitleText]);

  return {
    currentModel,
    sketchfabUrl,
    sketchfabModelData,
    modelParams,
    titleText,
    subtitleText
  };
};

export default useModelData;
