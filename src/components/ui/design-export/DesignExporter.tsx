
import React, { useState } from 'react';
import { Download, FileJson } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// Tipos de formato de exportação
type ExportFormat = 'figma' | 'framer';

// Interface para os estilos de um componente no formato Figma
interface FigmaComponentStyle {
  id: string;
  name: string;
  type: string;
  absoluteBoundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style: {
    fills: Array<{
      type: string;
      color: {
        r: number;
        g: number;
        b: number;
        a: number;
      };
    }>;
    effects: any[];
    strokes: any[];
  };
  children?: FigmaComponentStyle[];
}

// Interface para o arquivo de exportação do Figma
interface FigmaDesignExport {
  document: {
    id: string;
    name: string;
    type: string;
    children: FigmaComponentStyle[];
  };
  styles: {
    [key: string]: {
      name: string;
      styleType: string;
      description: string;
    };
  };
  schemaVersion: number;
  name: string;
}

// Interface para o arquivo de exportação do Framer
interface FramerDesignExport {
  version: string;
  name: string;
  components: any[];
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, any>;
}

const DesignExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  // Converte cor CSS para valores RGBA de 0 a 1 (formato Figma)
  const convertCssColorToRGBA = (color: string) => {
    // Cor padrão em caso de falha
    const defaultColor = { r: 0, g: 0, b: 0, a: 1 };
    
    try {
      if (!color || color === 'none' || color === 'transparent') {
        return { ...defaultColor, a: 0 };
      }
      
      // Se for rgba ou rgb
      if (color.startsWith('rgba') || color.startsWith('rgb')) {
        const values = color.match(/\d+(\.\d+)?/g);
        if (!values || values.length < 3) return defaultColor;
        
        return {
          r: Number(values[0]) / 255,
          g: Number(values[1]) / 255,
          b: Number(values[2]) / 255,
          a: values.length > 3 ? Number(values[3]) : 1
        };
      }
      
      // Se for hex
      if (color.startsWith('#')) {
        const hex = color.substring(1);
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        const a = hex.length > 6 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
        
        return { r, g, b, a };
      }
      
      return defaultColor;
    } catch (e) {
      console.error('Erro ao converter cor:', e);
      return defaultColor;
    }
  };

  // Extrai estilos para formato Figma
  const extractFigmaStyles = (element: Element, parentId = ''): FigmaComponentStyle | null => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return null;

    const computedStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    
    const id = element.id || `${parentId ? `${parentId}_` : ''}${element.tagName.toLowerCase()}_${Math.random().toString(36).substring(2, 9)}`;
    const name = element.getAttribute('data-component-name') || element.tagName.toLowerCase();
    
    // Extrair cor de fundo
    const bgColor = convertCssColorToRGBA(computedStyle.backgroundColor);
    
    // Criar estilo Figma
    const figmaStyle: FigmaComponentStyle = {
      id,
      name,
      type: 'FRAME',
      absoluteBoundingBox: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      },
      style: {
        fills: [{
          type: 'SOLID',
          color: bgColor
        }],
        effects: [],
        strokes: []
      }
    };

    // Recursivamente processar elementos filhos
    const children: FigmaComponentStyle[] = [];
    Array.from(element.children).forEach(child => {
      const childStyle = extractFigmaStyles(child, id);
      if (childStyle) {
        children.push(childStyle);
      }
    });

    if (children.length > 0) {
      figmaStyle.children = children;
    }

    return figmaStyle;
  };

  // Função para extrair estilos para Framer
  const extractFramerStyles = (element: Element, path = ''): any | null => {
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
    const children: any[] = [];
    Array.from(element.children).forEach(child => {
      const childStyle = extractFramerStyles(child, nodePath);
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

  // Gera exportação no formato Figma
  const generateFigmaExport = (): FigmaDesignExport => {
    const appRoot = document.getElementById('root') || document.body;
    const components: FigmaComponentStyle[] = [];

    Array.from(appRoot.children).forEach(child => {
      const componentStyle = extractFigmaStyles(child);
      if (componentStyle) {
        components.push(componentStyle);
      }
    });

    // Criar objeto de exportação no formato do Figma
    return {
      document: {
        id: 'jestfly-design',
        name: 'JESTFLY Design System',
        type: 'DOCUMENT',
        children: components
      },
      styles: {
        // Cores do sistema
        primary: {
          name: 'Primary',
          styleType: 'FILL',
          description: 'Primary brand color'
        },
        secondary: {
          name: 'Secondary',
          styleType: 'FILL',
          description: 'Secondary brand color'
        },
        // Tipografia
        heading1: {
          name: 'Heading 1',
          styleType: 'TEXT',
          description: 'Main heading style'
        },
        body: {
          name: 'Body',
          styleType: 'TEXT',
          description: 'Body text style'
        }
      },
      schemaVersion: 0.1,
      name: 'JESTFLY Design System'
    };
  };

  // Gera exportação no formato Framer
  const generateFramerExport = (): FramerDesignExport => {
    const appRoot = document.getElementById('root') || document.body;
    const components: any[] = [];

    // Extrair componentes principais
    Array.from(appRoot.children).forEach(child => {
      const componentStyle = extractFramerStyles(child);
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
      let exportData;
      let fileName;
      
      if (format === 'figma') {
        exportData = generateFigmaExport();
        fileName = 'jestfly-design-figma.json';
      } else { // framer
        exportData = generateFramerExport();
        fileName = 'jestfly-design-framer.json';
      }
      
      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Criar link para download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
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
