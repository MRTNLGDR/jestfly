
import React, { useState, useRef } from 'react';
import { Download, ImageIcon, FileCode, FilePlus } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Tipos de formato de exportação
type ExportFormat = 'png' | 'svg' | 'css';

const DesignExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<ExportFormat>('png');

  // Função para exportar a interface como imagem PNG
  const exportAsPNG = async () => {
    try {
      setIsExporting(true);
      
      // Capturar a interface atual como canvas
      const appRoot = document.getElementById('root') || document.body;
      const canvas = await html2canvas(appRoot, {
        scale: 2, // Melhor resolução
        useCORS: true, // Permitir imagens de outros domínios
        allowTaint: true, // Permitir que o canvas seja "manchado" com imagens de outros domínios
        backgroundColor: null, // Fundo transparente
      });
      
      // Converter para PNG e fazer download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'jestfly-design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Design exportado como PNG');
    } catch (error) {
      console.error('Erro ao exportar design como PNG:', error);
      toast.error('Erro ao exportar design');
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar como SVG
  const exportAsSVG = async () => {
    try {
      setIsExporting(true);
      
      // Capturar todos os SVGs da página
      const svgElements = document.querySelectorAll('svg');
      
      if (svgElements.length === 0) {
        toast.error('Nenhum elemento SVG encontrado na página');
        setIsExporting(false);
        return;
      }
      
      // Pegar o primeiro SVG para demonstração
      // Em uma implementação completa, poderíamos combinar todos ou permitir seleção
      const svgElement = svgElements[0];
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = 'jestfly-element.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(svgUrl);
      
      toast.success('Elemento SVG exportado');
    } catch (error) {
      console.error('Erro ao exportar SVG:', error);
      toast.error('Erro ao exportar SVG');
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar estilos CSS
  const exportCSS = () => {
    try {
      setIsExporting(true);
      
      // Coletar todos os estilos computados
      const styleSheets = document.styleSheets;
      let cssText = '';
      
      // Extrair regras CSS de todas as folhas de estilo
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const rules = styleSheets[i].cssRules || styleSheets[i].rules;
          if (rules) {
            for (let j = 0; j < rules.length; j++) {
              cssText += rules[j].cssText + '\n';
            }
          }
        } catch (e) {
          console.warn('Não foi possível acessar stylesheet', e);
        }
      }
      
      // Criar arquivo para download
      const blob = new Blob([cssText], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jestfly-styles.css';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Estilos CSS exportados');
    } catch (error) {
      console.error('Erro ao exportar CSS:', error);
      toast.error('Erro ao exportar CSS');
    } finally {
      setIsExporting(false);
    }
  };

  // Função para exportar o design no formato selecionado
  const exportDesign = async (format: ExportFormat) => {
    switch (format) {
      case 'png':
        await exportAsPNG();
        break;
      case 'svg':
        await exportAsSVG();
        break;
      case 'css':
        exportCSS();
        break;
      default:
        toast.error('Formato não suportado');
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button 
          className="text-white/40 hover:text-white/60 transition-colors flex items-center opacity-60 hover:opacity-100"
          aria-label="Exportar design"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Exportar Design</h3>
          <p className="text-xs text-muted-foreground">
            Exporte o design da interface para formatos compatíveis com Figma.
          </p>
          
          <Tabs defaultValue="png" value={activeTab} onValueChange={(value) => setActiveTab(value as ExportFormat)}>
            <TabsList className="w-full">
              <TabsTrigger value="png" className="flex-1">Imagem</TabsTrigger>
              <TabsTrigger value="svg" className="flex-1">SVG</TabsTrigger>
              <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
            </TabsList>
            
            <TabsContent value="png" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Exporta a interface como imagem PNG de alta qualidade.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => exportDesign('png')}
                disabled={isExporting}
              >
                <Download className="h-3 w-3 mr-1" />
                Exportar PNG
              </Button>
            </TabsContent>
            
            <TabsContent value="svg" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Exporta elementos SVG da interface.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => exportDesign('svg')}
                disabled={isExporting}
              >
                <FileCode className="h-3 w-3 mr-1" />
                Exportar SVG
              </Button>
            </TabsContent>
            
            <TabsContent value="css" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Exporta os estilos CSS da interface.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => exportDesign('css')}
                disabled={isExporting}
              >
                <FilePlus className="h-3 w-3 mr-1" />
                Exportar CSS
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DesignExporter;
