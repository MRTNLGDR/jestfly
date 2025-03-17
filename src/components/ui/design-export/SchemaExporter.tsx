import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';

// Tipos de elementos UI para exportação
type UIElement = {
  type: string;
  name: string;
  properties: Record<string, any>;
  children?: UIElement[];
};

// Interface para o schema completo
interface UISchema {
  version: string;
  platform: string;
  theme: {
    colors: Record<string, string>;
    typography: Record<string, any>;
    spacing: Record<string, string | number>;
    breakpoints: Record<string, string | number>;
    effects: Record<string, any>;
  };
  components: UIElement[];
  pages: {
    name: string;
    route: string;
    components: UIElement[];
  }[];
}

const SchemaExporter: React.FC = () => {
  // Função para coletar o esquema completo de UI/UX
  const collectUISchema = (): UISchema => {
    // Cores do sistema (extraídas do CSS)
    const extractColors = (): Record<string, string> => {
      const colors: Record<string, string> = {};
      
      // Extrai variáveis CSS do root
      const rootStyles = getComputedStyle(document.documentElement);
      
      // Procura por variáveis de cor
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith('--')) {
          // Filtra apenas propriedades de cor
          if (
            prop.includes('color') || 
            prop.includes('bg-') || 
            prop.includes('border-') ||
            prop.includes('ring-') ||
            prop.includes('fill-') ||
            prop.includes('stroke-')
          ) {
            const value = rootStyles.getPropertyValue(prop).trim();
            if (value) {
              colors[prop] = value;
            }
          }
        }
      }
      
      // Adiciona cores do Tailwind que estão em uso
      const allElements = document.querySelectorAll('*');
      const tailwindClasses = new Set<string>();
      
      allElements.forEach(el => {
        const classes = el.classList;
        classes.forEach(className => {
          // Captura classes de cor do Tailwind
          if (
            className.startsWith('bg-') ||
            className.startsWith('text-') ||
            className.startsWith('border-') ||
            className.startsWith('ring-') ||
            className.startsWith('fill-') ||
            className.startsWith('stroke-')
          ) {
            tailwindClasses.add(className);
          }
        });
      });
      
      // Adiciona classes Tailwind encontradas
      tailwindClasses.forEach(className => {
        colors[`tailwind:${className}`] = className;
      });
      
      return colors;
    };
    
    // Extrai tipografia
    const extractTypography = (): Record<string, any> => {
      const typography: Record<string, any> = {
        fonts: {},
        sizes: {},
        weights: {},
        lineHeights: {}
      };
      
      // Extrai fontes em uso
      const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea');
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontFamily = styles.fontFamily;
        const fontSize = styles.fontSize;
        const fontWeight = styles.fontWeight;
        const lineHeight = styles.lineHeight;
        
        // Adiciona à lista de fontes
        if (fontFamily && !typography.fonts[fontFamily]) {
          typography.fonts[fontFamily] = fontFamily;
        }
        
        // Adiciona a lista de tamanhos
        if (fontSize && !typography.sizes[fontSize]) {
          typography.sizes[fontSize] = fontSize;
        }
        
        // Adiciona a lista de pesos
        if (fontWeight && !typography.weights[fontWeight]) {
          typography.weights[fontWeight] = fontWeight;
        }
        
        // Adiciona a lista de alturas de linha
        if (lineHeight && !typography.lineHeights[lineHeight]) {
          typography.lineHeights[lineHeight] = lineHeight;
        }
      });
      
      return typography;
    };
    
    // Extrai espaçamento
    const extractSpacing = (): Record<string, string | number> => {
      const spacing: Record<string, string | number> = {};
      
      // Procura classes de margin e padding
      const allElements = document.querySelectorAll('*');
      const spacingClasses = new Set<string>();
      
      allElements.forEach(el => {
        const classes = el.classList;
        classes.forEach(className => {
          // Captura classes de espaçamento do Tailwind
          if (
            className.match(/^(m|p)[tblrxy]?-[0-9]+/) ||
            className.match(/^(gap|space)-(x|y)?-[0-9]+/)
          ) {
            spacingClasses.add(className);
          }
        });
      });
      
      // Adiciona classes de espaçamento encontradas
      spacingClasses.forEach(className => {
        spacing[className] = className;
      });
      
      return spacing;
    };
    
    // Extrai breakpoints
    const extractBreakpoints = (): Record<string, string | number> => {
      return {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      };
    };
    
    // Extrai efeitos (sombras, blur, etc)
    const extractEffects = (): Record<string, any> => {
      const effects: Record<string, any> = {
        shadows: {},
        blurs: {},
        transitions: {},
        animations: {}
      };
      
      // Procura efeitos em uso
      const allElements = document.querySelectorAll('*');
      
      allElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        
        // Sombras
        if (styles.boxShadow && styles.boxShadow !== 'none') {
          effects.shadows[styles.boxShadow] = styles.boxShadow;
        }
        
        // Blur
        if (styles.filter && styles.filter.includes('blur')) {
          effects.blurs[styles.filter] = styles.filter;
        }
        
        // Transições
        if (styles.transition && styles.transition !== 'all 0s ease 0s') {
          effects.transitions[styles.transition] = styles.transition;
        }
        
        // Animações
        if (styles.animation && styles.animation !== 'none') {
          effects.animations[styles.animation] = styles.animation;
        }
        
        // Classes Tailwind para efeitos
        const classes = el.classList;
        classes.forEach(className => {
          if (
            className.startsWith('shadow-') ||
            className.startsWith('blur-') ||
            className.startsWith('transition-') ||
            className.startsWith('animate-')
          ) {
            const category = className.split('-')[0];
            switch (category) {
              case 'shadow':
                effects.shadows[className] = className;
                break;
              case 'blur':
                effects.blurs[className] = className;
                break;
              case 'transition':
                effects.transitions[className] = className;
                break;
              case 'animate':
                effects.animations[className] = className;
                break;
            }
          }
        });
      });
      
      return effects;
    };
    
    // Extrai componentes
    const extractComponents = (): UIElement[] => {
      const components: UIElement[] = [];
      
      // Lista de possíveis componentes shadcn
      const shadcnSelectors = [
        '.btn', 'button[class*="btn-"]', 
        '.card', '.dialog', '.popover', 
        '.dropdown', '.tooltip', '.avatar',
        '.badge', '.alert', '.toast',
        'input[type]', 'select', 'textarea',
        '.tabs', '.accordion', '.menu'
      ];
      
      try {
        // Procura componentes shadcn
        const potentialComponents = document.querySelectorAll(shadcnSelectors.join(','));
        
        potentialComponents.forEach((el, index) => {
          // Tenta determinar o tipo de componente
          let type = 'unknown';
          
          if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
            type = 'Button';
          } else if (el.classList.contains('card')) {
            type = 'Card';
          } else if (el.tagName === 'INPUT') {
            type = 'Input';
          } else if (el.tagName === 'SELECT') {
            type = 'Select';
          } else if (el.classList.contains('tabs')) {
            type = 'Tabs';
          } else if (el.classList.contains('accordion')) {
            type = 'Accordion';
          }
          
          // Coleta propriedades
          const computedStyle = window.getComputedStyle(el);
          const properties: Record<string, any> = {
            classes: Array.from(el.classList),
            styles: {
              backgroundColor: computedStyle.backgroundColor,
              color: computedStyle.color,
              padding: computedStyle.padding,
              margin: computedStyle.margin,
              borderRadius: computedStyle.borderRadius,
              boxShadow: computedStyle.boxShadow
            }
          };
          
          // Adiciona atributos
          const attributes: Record<string, string> = {};
          Array.from(el.attributes).forEach(attr => {
            if (attr.name !== 'class' && attr.name !== 'style') {
              attributes[attr.name] = attr.value;
            }
          });
          
          if (Object.keys(attributes).length > 0) {
            properties.attributes = attributes;
          }
          
          components.push({
            type,
            name: `${type}_${index}`,
            properties
          });
        });
      } catch (error) {
        console.error('Erro ao extrair componentes:', error);
      }
      
      return components;
    };
    
    // Extrai páginas
    const extractPages = () => {
      // Simples para demonstração - na prática precisaria de acesso ao React Router
      return [
        {
          name: 'Current Page',
          route: window.location.pathname,
          components: extractComponents()
        }
      ];
    };
    
    // Constrói e retorna o schema completo
    return {
      version: '1.0',
      platform: 'JESTFLY',
      theme: {
        colors: extractColors(),
        typography: extractTypography(),
        spacing: extractSpacing(),
        breakpoints: extractBreakpoints(),
        effects: extractEffects()
      },
      components: extractComponents(),
      pages: extractPages()
    };
  };
  
  // Função para exportar o schema completo
  const exportFullSchema = () => {
    try {
      const uiSchema = collectUISchema();
      
      // Converte para JSON
      const schemaJSON = JSON.stringify(uiSchema, null, 2);
      
      // Cria blob para download
      const blob = new Blob([schemaJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Cria elemento de download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jestfly-ui-schema.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Schema UI/UX exportado com sucesso');
    } catch (error) {
      console.error('Erro ao exportar schema:', error);
      toast.error('Falha ao exportar schema UI/UX');
    }
  };
  
  return (
    <Button 
      onClick={exportFullSchema}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      <FileDown size={14} />
      Exportar UI Schema
    </Button>
  );
};

export default SchemaExporter;
