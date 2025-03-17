
import React, { useState } from 'react';
import { Download, FileJson } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Tipos de formato de exportação
type ExportFormat = 'figma' | 'framer';

// Interface para os estilos de um componente
interface ComponentStyle {
  id: string;
  type: string;
  name: string;
  styles: Record<string, any>;
  children?: ComponentStyle[];
}

// Interface para o arquivo de exportação
interface DesignExport {
  version: string;
  format: ExportFormat;
  name: string;
  components: ComponentStyle[];
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, any>;
}

const DesignExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Função para extrair estilos de um componente DOM
  const extractStyles = (element: Element, path = ''): ComponentStyle | null => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return null;

    const computedStyle = window.getComputedStyle(element);
    const id = element.id || `${element.tagName.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
    const name = element.getAttribute('data-component-name') || element.tagName.toLowerCase();
    const nodePath = path ? `${path} > ${name}` : name;

    // Extrair estilos computados relevantes
    const styles: Record<string, any> = {
      width: computedStyle.width,
      height: computedStyle.height,
      backgroundColor: computedStyle.backgroundColor,
      color: computedStyle.color,
      fontFamily: computedStyle.fontFamily,
      fontSize: computedStyle.fontSize,
      fontWeight: computedStyle.fontWeight,
      borderRadius: computedStyle.borderRadius,
      boxShadow: computedStyle.boxShadow,
      margin: computedStyle.margin,
      padding: computedStyle.padding,
      display: computedStyle.display,
      position: computedStyle.position,
      zIndex: computedStyle.zIndex,
      opacity: computedStyle.opacity,
      transform: computedStyle.transform,
    };

    // Recursivamente processar elementos filhos
    const children: ComponentStyle[] = [];
    Array.from(element.children).forEach(child => {
      const childStyle = extractStyles(child, nodePath);
      if (childStyle) {
        children.push(childStyle);
      }
    });

    return {
      id,
      type: element.tagName.toLowerCase(),
      name,
      styles,
      children: children.length > 0 ? children : undefined
    };
  };

  // Função para gerar arquivo de exportação
  const generateExport = (format: ExportFormat): DesignExport => {
    const appRoot = document.getElementById('root') || document.body;
    const components: ComponentStyle[] = [];

    // Extrair componentes principais
    Array.from(appRoot.children).forEach(child => {
      const componentStyle = extractStyles(child);
      if (componentStyle) {
        components.push(componentStyle);
      }
    });

    // Extrair paleta de cores do CSS
    const colors: Record<string, string> = {
      primary: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
      secondary: getComputedStyle(document.documentElement).getPropertyValue('--secondary'),
      background: getComputedStyle(document.documentElement).getPropertyValue('--background'),
      foreground: getComputedStyle(document.documentElement).getPropertyValue('--foreground'),
      // Adicione mais cores conforme necessário
    };

    // Extrair tipografia
    const typography = {
      fontFamilies: {
        sans: getComputedStyle(document.documentElement).getPropertyValue('--font-sans'),
        mono: getComputedStyle(document.documentElement).getPropertyValue('--font-mono'),
      },
      fontSizes: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
    };

    // Extrair espaçamentos
    const spacing = {
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      6: '1.5rem',
      8: '2rem',
      12: '3rem',
      16: '4rem',
    };

    return {
      version: '1.0.0',
      format,
      name: 'JESTFLY Design System',
      components,
      colors,
      typography,
      spacing,
    };
  };

  // Função para exportar o design
  const exportDesign = async (format: ExportFormat) => {
    try {
      setIsExporting(true);
      
      // Gerar dados de exportação
      const exportData = generateExport(format);
      
      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Criar link para download
      const link = document.createElement('a');
      link.href = url;
      link.download = `jestfly-design.${format === 'figma' ? 'fig' : 'framer'}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Limpar
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Design exportado para ${format === 'figma' ? 'Figma' : 'Framer'}`);
    } catch (error) {
      console.error('Erro ao exportar design:', error);
      toast.error('Erro ao exportar design');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button 
          className="text-white/40 hover:text-white/60 transition-colors flex items-center opacity-60 hover:opacity-100"
          aria-label="Exportar design"
        >
          <FileJson className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Exportar Design</h3>
          <p className="text-xs text-muted-foreground">
            Exporte o design da interface atual para uso em Figma ou Framer.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => exportDesign('figma')}
              disabled={isExporting}
            >
              <Download className="h-3 w-3 mr-1" />
              Figma
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full" 
              onClick={() => exportDesign('framer')}
              disabled={isExporting}
            >
              <Download className="h-3 w-3 mr-1" />
              Framer
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DesignExporter;
