
import { useEffect, useRef } from "react";

interface SketchfabSceneProps {
  sketchfabUrl: string | null;
  onLoaded: () => void;
  onError: (error: string) => void;
}

const SketchfabScene: React.FC<SketchfabSceneProps> = ({
  sketchfabUrl,
  onLoaded,
  onError
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Se estiver carregando um modelo do Sketchfab, limpar e criar o iframe
    const container = containerRef.current;
    container.innerHTML = '';
    
    if (sketchfabUrl) {
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
          onError("Erro ao carregar o modelo do Sketchfab");
        };
        
        iframe.onload = () => {
          onLoaded();
        };
        
        container.appendChild(iframe);
      } catch (error) {
        console.error("Erro ao configurar iframe do Sketchfab:", error);
        onError("URL do modelo Sketchfab inválida");
      }
    } else {
      onError("URL do modelo Sketchfab não encontrada");
    }
    
    return () => {
      // Cleanup
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [sketchfabUrl, onLoaded, onError]);
  
  return <div ref={containerRef} className="absolute inset-0 z-10"></div>;
};

export default SketchfabScene;
