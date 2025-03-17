
import React, { useState, useRef } from 'react';
import { Download, ImageIcon, FileCode, FilePlus, Printer, Layers, Copy, FileDown } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SchemaExporter from './SchemaExporter';

// Tipos de formato de exportação
type ExportFormat = 'png' | 'svg' | 'css' | 'all' | 'schema';

// Lista de rotas principais do JESTFLY para captura completa
const mainRoutes = [
  { path: '/', name: 'Home' },
  { path: '/store', name: 'Store' },
  { path: '/community', name: 'Community' },
  { path: '/bookings', name: 'Bookings' },
  { path: '/profile', name: 'Profile' },
  { path: '/press-kit', name: 'Press Kit' },
  { path: '/live-stream', name: 'Live Stream' },
  { path: '/notes', name: 'Notes' }
];

const DesignExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<ExportFormat>('png');
  const [captureProgress, setCaptureProgress] = useState(0);
  const [totalScreenshots, setTotalScreenshots] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Função para capturar todas as janelas principais
  const captureAllScreens = async () => {
    try {
      setIsExporting(true);
      setTotalScreenshots(mainRoutes.length);
      
      // Criar um elemento para organizar as capturas
      const zip = document.createElement('div');
      zip.style.display = 'none';
      document.body.appendChild(zip);
      
      // Processar cada rota
      for (let i = 0; i < mainRoutes.length; i++) {
        const route = mainRoutes[i];
        setCaptureProgress(i + 1);
        
        // Criar um iframe para carregar a página
        const iframe = document.createElement('iframe');
        iframe.style.width = '1920px';
        iframe.style.height = '1080px';
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.src = route.path;
        
        // Adicionar iframe ao DOM
        document.body.appendChild(iframe);
        
        // Esperar o carregamento
        await new Promise((resolve) => {
          iframe.onload = resolve;
          // Timeout de segurança
          setTimeout(resolve, 5000);
        });
        
        // Capturar como PNG
        try {
          const canvas = await html2canvas(iframe.contentDocument?.body || iframe.contentDocument?.documentElement || iframe, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#000',
            windowWidth: 1920,
            windowHeight: 1080,
          });
          
          // Criar o download individual
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `jestfly-${route.name.toLowerCase()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.success(`Captura de ${route.name} concluída`);
        } catch (err) {
          console.error(`Erro ao capturar ${route.name}:`, err);
          toast.error(`Falha ao capturar ${route.name}`);
        }
        
        // Remover o iframe
        document.body.removeChild(iframe);
      }
      
      document.body.removeChild(zip);
      toast.success('Captura de todas as janelas concluída');
      
    } catch (error) {
      console.error('Erro ao capturar todas as janelas:', error);
      toast.error('Erro ao capturar todas as janelas');
    } finally {
      setIsExporting(false);
      setCaptureProgress(0);
    }
  };

  // Função para capturar a tela atual e copiar para a área de transferência
  const copyCurrentScreenToClipboard = async () => {
    try {
      setIsExporting(true);
      
      const appRoot = document.getElementById('root') || document.body;
      const canvas = await html2canvas(appRoot, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            toast.success('Captura copiada para a área de transferência');
          } catch (err) {
            console.error('Erro ao copiar para a área de transferência:', err);
            toast.error('Não foi possível copiar para a área de transferência');
            
            // Fallback - oferecer download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'jestfly-screenshot.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }
      });
    } catch (error) {
      console.error('Erro ao capturar tela:', error);
      toast.error('Erro ao capturar tela');
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
      case 'all':
        await captureAllScreens();
        break;
      case 'schema':
        // Redirecionar para a página de recursos com a aba UI Schema
        window.location.href = '/resources';
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
            Exporte o design da interface para formatos compatíveis com Figma ou o schema UI/UX completo.
          </p>
          
          <Tabs defaultValue="png" value={activeTab} onValueChange={(value) => setActiveTab(value as ExportFormat)}>
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="png" className="flex-1">Imagem</TabsTrigger>
              <TabsTrigger value="svg" className="flex-1">SVG</TabsTrigger>
              <TabsTrigger value="css" className="flex-1">CSS</TabsTrigger>
              <TabsTrigger value="all" className="flex-1">Todas</TabsTrigger>
              <TabsTrigger value="schema" className="flex-1">Schema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="png" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Exporta a interface como imagem PNG de alta qualidade.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1" 
                  onClick={() => exportDesign('png')}
                  disabled={isExporting}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Exportar PNG
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-none" 
                  onClick={copyCurrentScreenToClipboard}
                  disabled={isExporting}
                  title="Copiar para área de transferência"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
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

            <TabsContent value="all" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Captura todas as janelas principais do JESTFLY.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => exportDesign('all')}
                disabled={isExporting}
              >
                <Layers className="h-3 w-3 mr-1" />
                Capturar todas as janelas
              </Button>
              
              {captureProgress > 0 && (
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(captureProgress / totalScreenshots) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1 text-muted-foreground">
                    Capturando {captureProgress} de {totalScreenshots}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="schema" className="mt-4">
              <p className="text-xs text-muted-foreground mb-3">
                Exporta o schema UI/UX completo do JESTFLY, incluindo cores, tipografia, componentes e layout.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => exportDesign('schema')}
              >
                <FileCode className="h-3 w-3 mr-1" />
                Acessar UI Schema Completo
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DesignExporter;
