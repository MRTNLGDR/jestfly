
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SketchfabViewerProps {
  sketchfabUrl: string | null;
}

const SketchfabViewer: React.FC<SketchfabViewerProps> = ({ sketchfabUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Se estiver carregando um modelo do Sketchfab, limpar e criar o iframe
    const container = containerRef.current;
    container.innerHTML = '';
    
    if (sketchfabUrl) {
      setLoadingModel(true);
      
      try {
        // Verificar se a URL é válida para o Sketchfab
        const isSketchfabUrl = sketchfabUrl.includes('sketchfab.com');
        if (!isSketchfabUrl) {
          throw new Error("URL inválida para o Sketchfab");
        }
        
        // Transformar para URL de embed se for uma URL normal
        let embedUrl = sketchfabUrl;
        if (sketchfabUrl.includes('sketchfab.com/models/') && !sketchfabUrl.includes('/embed')) {
          embedUrl = sketchfabUrl.replace('sketchfab.com/models/', 'sketchfab.com/models/embed/');
        }
        
        // Garantir que a URL termina com parâmetros adequados
        if (!embedUrl.includes('?')) {
          embedUrl += '?';
        } else if (!embedUrl.endsWith('&') && !embedUrl.endsWith('?')) {
          embedUrl += '&';
        }
        
        // Adicionar parâmetros para melhor visualização
        embedUrl += 'autostart=1&transparent=1&ui_infos=0&ui_controls=0&ui_stop=0';
        
        console.log("URL de embed final:", embedUrl);
        
        // Criar iframe para o Sketchfab
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.allow = 'autoplay; fullscreen; vr';
        iframe.src = embedUrl;
        
        // Tratar erros de carregamento do iframe
        iframe.onerror = () => {
          setLoadingError("Erro ao carregar o modelo do Sketchfab");
          setLoadingModel(false);
        };
        
        iframe.onload = () => {
          setLoadingModel(false);
        };
        
        container.appendChild(iframe);
      } catch (error) {
        console.error("Erro ao configurar iframe do Sketchfab:", error);
        setLoadingError("URL do modelo Sketchfab inválida");
        setLoadingModel(false);
      }
    } else {
      setLoadingError("URL do modelo Sketchfab não encontrada");
      setLoadingModel(false);
    }
    
    return () => {
      // Cleanup
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [sketchfabUrl]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-10">
      {/* Loading indicator */}
      {loadingModel && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/70 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            <div className="text-white text-xl">Carregando modelo Sketchfab...</div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {loadingError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90">
          <div className="text-red-500 text-2xl mb-4">Erro de carregamento</div>
          <div className="text-white text-lg">{loadingError}</div>
        </div>
      )}
    </div>
  );
};

export default SketchfabViewer;
