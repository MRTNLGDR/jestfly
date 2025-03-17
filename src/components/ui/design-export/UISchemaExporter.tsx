
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Code, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UISchemaItem {
  name: string;
  description?: string;
  type: string;
  value: string;
  usage?: string;
  className?: string;
  component?: string;
  cssProperties?: Record<string, string>;
  example?: string;
}

interface UISchemaSection {
  title: string;
  description: string;
  items: UISchemaItem[];
}

const UISchemaExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Colete dados do esquema de interface do usuário
  const collectUISchemaData = (): Record<string, UISchemaSection> => {
    const schemaData: Record<string, UISchemaSection> = {
      typography: {
        title: "Tipografia",
        description: "Fontes, tamanhos e estilos de texto utilizados no JESTFLY",
        items: []
      },
      colors: {
        title: "Cores",
        description: "Paleta de cores do sistema JESTFLY",
        items: []
      },
      glassmorphism: {
        title: "Glassmorfismo",
        description: "Estilos de vidro e blur usados na interface",
        items: []
      },
      animations: {
        title: "Animações",
        description: "Animações e transições utilizadas no JESTFLY",
        items: []
      },
      cards: {
        title: "Cards",
        description: "Variações de cards e containers",
        items: []
      },
      buttons: {
        title: "Botões",
        description: "Estilos e variantes de botões",
        items: []
      },
      spacing: {
        title: "Espaçamento",
        description: "Sistema de espaçamento e grid",
        items: []
      },
      effects: {
        title: "Efeitos",
        description: "Sombras, gradientes e efeitos especiais",
        items: []
      },
      components: {
        title: "Componentes",
        description: "Componentes reutilizáveis do sistema",
        items: []
      }
    };

    // Extrair tipografia
    collectTypography(schemaData.typography.items);
    
    // Extrair cores
    collectColors(schemaData.colors.items);
    
    // Extrair glassmorfismo
    collectGlassmorphism(schemaData.glassmorphism.items);
    
    // Extrair animações
    collectAnimations(schemaData.animations.items);
    
    // Extrair cards
    collectCards(schemaData.cards.items);
    
    // Extrair botões
    collectButtons(schemaData.buttons.items);
    
    // Extrair espaçamento
    collectSpacing(schemaData.spacing.items);
    
    // Extrair efeitos
    collectEffects(schemaData.effects.items);
    
    // Extrair componentes
    collectComponents(schemaData.components.items);

    return schemaData;
  };

  // Coleta tipografia
  const collectTypography = (items: UISchemaItem[]) => {
    // Fontes principais
    items.push({
      name: "Font Sans",
      type: "font-family",
      value: "Inter, system-ui, sans-serif",
      usage: "Fonte principal para textos e conteúdos",
      className: "font-sans"
    });
    
    items.push({
      name: "Font Display",
      type: "font-family",
      value: "Space Grotesk, sans-serif",
      usage: "Fonte para títulos e destaques",
      className: "font-display"
    });
    
    items.push({
      name: "Font Mono",
      type: "font-family",
      value: "IBM Plex Mono, monospace",
      usage: "Fonte para código e dados técnicos",
      className: "font-mono"
    });
    
    items.push({
      name: "Font Heading",
      type: "font-family",
      value: "Clash Display, sans-serif",
      usage: "Fonte para headings principais",
      className: "font-heading"
    });
    
    // Tamanhos de fonte
    const fontSizes = [
      { name: "text-xs", value: "0.75rem" },
      { name: "text-sm", value: "0.875rem" },
      { name: "text-base", value: "1rem" },
      { name: "text-lg", value: "1.125rem" },
      { name: "text-xl", value: "1.25rem" },
      { name: "text-2xl", value: "1.5rem" },
      { name: "text-3xl", value: "1.875rem" },
      { name: "text-4xl", value: "2.25rem" },
      { name: "text-5xl", value: "3rem" },
      { name: "text-6xl", value: "3.75rem" }
    ];
    
    fontSizes.forEach(size => {
      items.push({
        name: size.name,
        type: "font-size",
        value: size.value,
        className: size.name
      });
    });
    
    // Pesos de fonte
    const fontWeights = [
      { name: "font-thin", value: "100" },
      { name: "font-extralight", value: "200" },
      { name: "font-light", value: "300" },
      { name: "font-normal", value: "400" },
      { name: "font-medium", value: "500" },
      { name: "font-semibold", value: "600" },
      { name: "font-bold", value: "700" },
      { name: "font-extrabold", value: "800" },
      { name: "font-black", value: "900" }
    ];
    
    fontWeights.forEach(weight => {
      items.push({
        name: weight.name,
        type: "font-weight",
        value: weight.value,
        className: weight.name
      });
    });
    
    // Estilos de texto especiais
    items.push({
      name: "text-gradient",
      type: "text-style",
      value: "Gradiente de texto branco",
      className: "text-gradient",
      cssProperties: {
        "background": "linear-gradient(to bottom right, white, rgba(255,255,255,0.7))",
        "background-clip": "text",
        "color": "transparent"
      }
    });
    
    items.push({
      name: "text-gradient-primary",
      type: "text-style",
      value: "Gradiente de texto na cor primária",
      className: "text-gradient-primary"
    });
  };

  // Coleta cores
  const collectColors = (items: UISchemaItem[]) => {
    // Cores de fundo
    const backgroundColors = [
      { name: "bg-black", value: "#000000" },
      { name: "bg-purple-950", value: "#0d0d15" },
      { name: "bg-purple-900", value: "#1A1F2C" },
      { name: "bg-purple-800", value: "#3b266e" },
      { name: "bg-purple-700", value: "#6e59a5" },
      { name: "bg-purple-600", value: "#8B5CF6" },
      { name: "bg-purple-500", value: "#9b87f5" },
      { name: "bg-blue-600", value: "#3B82F6" },
      { name: "bg-green-500", value: "#4ade80" }
    ];
    
    backgroundColors.forEach(color => {
      items.push({
        name: color.name,
        type: "color",
        value: color.value,
        className: color.name
      });
    });
    
    // Cores de texto
    const textColors = [
      { name: "text-white", value: "#FFFFFF" },
      { name: "text-white/70", value: "rgba(255,255,255,0.7)" },
      { name: "text-white/40", value: "rgba(255,255,255,0.4)" },
      { name: "text-purple-400", value: "#b49dff" },
      { name: "text-blue-400", value: "#60a5fa" },
      { name: "text-red-400", value: "#f87171" }
    ];
    
    textColors.forEach(color => {
      items.push({
        name: color.name,
        type: "color",
        value: color.value,
        className: color.name
      });
    });
    
    // Cores de borda
    const borderColors = [
      { name: "border-white/10", value: "rgba(255,255,255,0.1)" },
      { name: "border-white/20", value: "rgba(255,255,255,0.2)" },
      { name: "border-purple-500/30", value: "rgba(139,92,246,0.3)" },
      { name: "border-red-500/30", value: "rgba(239,68,68,0.3)" }
    ];
    
    borderColors.forEach(color => {
      items.push({
        name: color.name,
        type: "color",
        value: color.value,
        className: color.name
      });
    });
  };

  // Coleta glassmorfismo
  const collectGlassmorphism = (items: UISchemaItem[]) => {
    items.push({
      name: "glass-morphism",
      type: "style",
      value: "Estilo de vidro principal",
      className: "glass-morphism",
      cssProperties: {
        "backdrop-filter": "blur(16px)",
        "background": "rgba(0,0,0,0.3)",
        "border": "1px solid rgba(255,255,255,0.1)",
        "box-shadow": "0 8px 32px rgba(100,100,255,0.05)"
      },
      example: `<div className="glass-morphism p-6 rounded-xl">Conteúdo com efeito glassmorphism</div>`
    });
    
    items.push({
      name: "glass-morphism-subtle",
      type: "style",
      value: "Estilo de vidro sutil",
      className: "glass-morphism-subtle",
      cssProperties: {
        "backdrop-filter": "blur(8px)",
        "background": "rgba(0,0,0,0.2)",
        "border-top": "1px solid rgba(255,255,255,0.05)",
        "border-bottom": "1px solid rgba(255,255,255,0.05)"
      }
    });
    
    items.push({
      name: "neo-blur",
      type: "style",
      value: "Estilo de vidro escuro com blur intenso",
      className: "neo-blur",
      cssProperties: {
        "backdrop-filter": "blur(24px)",
        "background": "rgba(0,0,0,0.4)",
        "border": "1px solid rgba(255,255,255,0.1)"
      }
    });
    
    items.push({
      name: "glass-card",
      type: "component",
      value: "Card com efeito de vidro e hover",
      className: "glass-card",
      component: "Card",
      cssProperties: {
        "background": "rgba(255,255,255,0.03)",
        "backdrop-filter": "blur(10px)",
        "border": "1px solid rgba(255,255,255,0.1)",
        "border-radius": "12px",
        "transition": "all 0.3s ease"
      }
    });
  };

  // Coleta animações
  const collectAnimations = (items: UISchemaItem[]) => {
    items.push({
      name: "animate-fade-in",
      type: "animation",
      value: "Animação de fade in",
      className: "animate-fade-in",
      cssProperties: {
        "animation": "fade-in 0.5s ease-out"
      }
    });
    
    items.push({
      name: "animate-rotate-diamond",
      type: "animation",
      value: "Rotação contínua",
      className: "animate-rotate-diamond",
      cssProperties: {
        "animation": "rotate-diamond 30s linear infinite"
      }
    });
    
    items.push({
      name: "animate-float",
      type: "animation",
      value: "Flutuação suave",
      className: "animate-float",
      cssProperties: {
        "animation": "float 4s ease-in-out infinite"
      }
    });
    
    items.push({
      name: "hover-scale",
      type: "interaction",
      value: "Escala no hover",
      className: "hover-scale",
      cssProperties: {
        "transition": "transform 0.3s ease"
      }
    });
    
    // Definições de keyframes
    items.push({
      name: "keyframe-float",
      type: "keyframe",
      value: `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}`,
      cssProperties: {}
    });
    
    items.push({
      name: "keyframe-rotate-diamond",
      type: "keyframe",
      value: `@keyframes rotate-diamond {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
      cssProperties: {}
    });
    
    items.push({
      name: "keyframe-fade-in",
      type: "keyframe",
      value: `@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}`,
      cssProperties: {}
    });
    
    items.push({
      name: "holographic-scan",
      type: "animation",
      value: "Efeito holográfico",
      className: "holographic-text",
      cssProperties: {
        "position": "relative",
        "overflow": "hidden"
      }
    });
  };

  // Coleta cards
  const collectCards = (items: UISchemaItem[]) => {
    items.push({
      name: "Card Padrão",
      type: "component",
      value: `<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição do card</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
  <CardFooter>
    Footer do card
  </CardFooter>
</Card>`,
      component: "Card"
    });
    
    items.push({
      name: "Glass Card",
      type: "component",
      value: `<Card className="glass-card">
  <CardContent>
    Card com efeito de vidro
  </CardContent>
</Card>`,
      component: "Card",
      className: "glass-card"
    });
    
    items.push({
      name: "Neo Blur Card",
      type: "component",
      value: `<Card className="neo-blur rounded-xl">
  <CardContent>
    Card com efeito neo-blur
  </CardContent>
</Card>`,
      component: "Card",
      className: "neo-blur"
    });
    
    items.push({
      name: "Hover Scale Card",
      type: "component",
      value: `<Card className="hover-scale">
  <CardContent>
    Card com escala no hover
  </CardContent>
</Card>`,
      component: "Card",
      className: "hover-scale"
    });
  };

  // Coleta botões
  const collectButtons = (items: UISchemaItem[]) => {
    items.push({
      name: "Botão Padrão",
      type: "component",
      value: `<Button>
  Botão Padrão
</Button>`,
      component: "Button",
      className: "bg-primary text-primary-foreground hover:bg-primary/90"
    });
    
    items.push({
      name: "Botão Outline",
      type: "component",
      value: `<Button variant="outline">
  Botão Outline
</Button>`,
      component: "Button",
      className: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    });
    
    items.push({
      name: "Botão Secundário",
      type: "component",
      value: `<Button variant="secondary">
  Botão Secundário
</Button>`,
      component: "Button",
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
    });
    
    items.push({
      name: "Botão Ghost",
      type: "component",
      value: `<Button variant="ghost">
  Botão Ghost
</Button>`,
      component: "Button",
      className: "hover:bg-accent hover:text-accent-foreground"
    });
    
    items.push({
      name: "Botão Link",
      type: "component",
      value: `<Button variant="link">
  Botão Link
</Button>`,
      component: "Button",
      className: "text-primary underline-offset-4 hover:underline"
    });
    
    items.push({
      name: "Botão Destructive",
      type: "component",
      value: `<Button variant="destructive">
  Botão Destructive
</Button>`,
      component: "Button",
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
    });
    
    // Tamanhos de botão
    items.push({
      name: "Botão Pequeno",
      type: "component",
      value: `<Button size="sm">
  Botão Pequeno
</Button>`,
      component: "Button",
      className: "h-9 rounded-md px-3"
    });
    
    items.push({
      name: "Botão Grande",
      type: "component",
      value: `<Button size="lg">
  Botão Grande
</Button>`,
      component: "Button",
      className: "h-11 rounded-md px-8"
    });
    
    items.push({
      name: "Botão Ícone",
      type: "component",
      value: `<Button size="icon">
  <IconName />
</Button>`,
      component: "Button",
      className: "h-10 w-10"
    });
  };

  // Coleta espaçamento
  const collectSpacing = (items: UISchemaItem[]) => {
    // Padding
    const paddingValues = [
      { name: "p-0", value: "0px" },
      { name: "p-1", value: "0.25rem" },
      { name: "p-2", value: "0.5rem" },
      { name: "p-3", value: "0.75rem" },
      { name: "p-4", value: "1rem" },
      { name: "p-6", value: "1.5rem" },
      { name: "p-8", value: "2rem" },
      { name: "p-10", value: "2.5rem" },
      { name: "p-12", value: "3rem" },
      { name: "p-16", value: "4rem" }
    ];
    
    paddingValues.forEach(p => {
      items.push({
        name: p.name,
        type: "spacing",
        value: p.value,
        className: p.name
      });
    });
    
    // Margin
    const marginValues = [
      { name: "m-0", value: "0px" },
      { name: "m-1", value: "0.25rem" },
      { name: "m-2", value: "0.5rem" },
      { name: "m-3", value: "0.75rem" },
      { name: "m-4", value: "1rem" },
      { name: "m-6", value: "1.5rem" },
      { name: "m-8", value: "2rem" },
      { name: "m-10", value: "2.5rem" },
      { name: "m-12", value: "3rem" },
      { name: "m-16", value: "4rem" }
    ];
    
    marginValues.forEach(m => {
      items.push({
        name: m.name,
        type: "spacing",
        value: m.value,
        className: m.name
      });
    });
    
    // Gap
    const gapValues = [
      { name: "gap-0", value: "0px" },
      { name: "gap-1", value: "0.25rem" },
      { name: "gap-2", value: "0.5rem" },
      { name: "gap-3", value: "0.75rem" },
      { name: "gap-4", value: "1rem" },
      { name: "gap-6", value: "1.5rem" },
      { name: "gap-8", value: "2rem" },
      { name: "gap-10", value: "2.5rem" }
    ];
    
    gapValues.forEach(g => {
      items.push({
        name: g.name,
        type: "spacing",
        value: g.value,
        className: g.name
      });
    });
    
    // Space
    const spaceYValues = [
      { name: "space-y-0", value: "0px" },
      { name: "space-y-1", value: "0.25rem" },
      { name: "space-y-2", value: "0.5rem" },
      { name: "space-y-4", value: "1rem" },
      { name: "space-y-6", value: "1.5rem" },
      { name: "space-y-8", value: "2rem" }
    ];
    
    spaceYValues.forEach(s => {
      items.push({
        name: s.name,
        type: "spacing",
        value: s.value,
        className: s.name
      });
    });
  };

  // Coleta efeitos
  const collectEffects = (items: UISchemaItem[]) => {
    // Glow
    items.push({
      name: "glow-sm",
      type: "effect",
      value: "Brilho pequeno",
      className: "glow-sm",
      cssProperties: {
        "filter": "drop-shadow(0 0 3px rgba(255, 255, 255, 0.2))"
      }
    });
    
    items.push({
      name: "glow-md",
      type: "effect",
      value: "Brilho médio",
      className: "glow-md",
      cssProperties: {
        "filter": "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))"
      }
    });
    
    items.push({
      name: "glow-lg",
      type: "effect",
      value: "Brilho grande",
      className: "glow-lg",
      cssProperties: {
        "filter": "drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))"
      }
    });
    
    items.push({
      name: "glow-purple",
      type: "effect",
      value: "Brilho roxo",
      className: "glow-purple",
      cssProperties: {
        "filter": "drop-shadow(0 0 6px rgba(147, 51, 234, 0.4))"
      }
    });
    
    items.push({
      name: "glow-blue",
      type: "effect",
      value: "Brilho azul",
      className: "glow-blue",
      cssProperties: {
        "filter": "drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))"
      }
    });
    
    items.push({
      name: "glow-red",
      type: "effect",
      value: "Brilho vermelho",
      className: "glow-red",
      cssProperties: {
        "filter": "drop-shadow(0 0 6px rgba(239, 68, 68, 0.4))"
      }
    });
    
    // Gradientes
    items.push({
      name: "bg-gradient-to-b",
      type: "gradient",
      value: "Gradiente vertical",
      className: "bg-gradient-to-b from-black via-[#0d0d15] to-[#1A1F2C]",
      cssProperties: {
        "background-image": "linear-gradient(to bottom, black, #0d0d15, #1A1F2C)"
      }
    });
    
    items.push({
      name: "bg-gradient-to-br",
      type: "gradient",
      value: "Gradiente diagonal",
      className: "bg-gradient-to-br from-purple-500 via-blue-400 to-cyan-300",
      cssProperties: {
        "background-image": "linear-gradient(to bottom right, #9b87f5, #60a5fa, #67e8f9)"
      }
    });
    
    // Grid
    items.push({
      name: "grid-background",
      type: "background",
      value: "Fundo com grid",
      className: "grid-background",
      cssProperties: {
        "background-image": "linear-gradient(rgba(25, 25, 35, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(25, 25, 35, 0.5) 1px, transparent 1px)",
        "background-size": "20px 20px"
      }
    });
  };

  // Coleta componentes
  const collectComponents = (items: UISchemaItem[]) => {
    items.push({
      name: "GlassHeader",
      type: "component",
      value: "Cabeçalho com efeito de vidro",
      component: "GlassHeader",
      className: "glass-morphism fixed top-0 w-full z-50"
    });
    
    items.push({
      name: "CrystalHero",
      type: "component",
      value: "Hero section com Crystal 3D",
      component: "CrystalHero",
      className: "min-h-screen relative flex items-center justify-center"
    });
    
    items.push({
      name: "NFTSection",
      type: "component",
      value: "Seção de NFTs com visualização 3D",
      component: "NFTSection",
      className: "py-20 relative"
    });
    
    items.push({
      name: "ArtistShowcase",
      type: "component",
      value: "Showcase de artistas",
      component: "ArtistShowcase",
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-16"
    });
    
    items.push({
      name: "ConnectionSection",
      type: "component",
      value: "Seção para inscrição em newsletter",
      component: "ConnectionSection",
      className: "py-20 relative overflow-hidden"
    });
    
    items.push({
      name: "CrystalGallery",
      type: "component",
      value: "Galeria com efeitos de cristal",
      component: "CrystalGallery",
      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    });
    
    items.push({
      name: "EventsSection",
      type: "component",
      value: "Seção de eventos",
      component: "EventsSection",
      className: "py-20 relative"
    });
    
    items.push({
      name: "FooterComponent",
      type: "component",
      value: "Rodapé da aplicação",
      component: "Footer",
      className: "neo-blur border-t border-white/10 py-16"
    });
  };

  // Exportar o schema completo para JSON
  const exportAsJson = () => {
    try {
      setIsExporting(true);
      
      const uiSchemaData = collectUISchemaData();
      
      // Formatando para JSON com indentação para melhor legibilidade
      const jsonData = JSON.stringify({
        name: "JESTFLY UI/UX Schema",
        version: "1.0",
        description: "Documentação completa da interface do JESTFLY",
        exportDate: new Date().toISOString(),
        sections: uiSchemaData
      }, null, 2);
      
      // Criando blob e iniciando download
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'jestfly-ui-schema.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Schema UI/UX exportado com sucesso');
    } catch (error) {
      console.error('Erro ao exportar schema UI/UX:', error);
      toast.error('Falha ao exportar schema UI/UX');
    } finally {
      setIsExporting(false);
    }
  };

  // Renderiza uma seção de itens do schema
  const renderSection = (section: UISchemaSection) => {
    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-lg font-medium">{section.title}</h3>
        <p className="text-sm text-white/70">{section.description}</p>
        
        <div className="grid grid-cols-1 gap-4">
          {section.items.map((item, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{item.type}</span>
                </CardTitle>
                {item.description && (
                  <CardDescription className="text-xs">{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                {item.value && (
                  <div className="text-xs bg-black/40 p-2 rounded-md font-mono">
                    {item.value}
                  </div>
                )}
                
                {item.className && (
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-white/60">Classe:</span>
                    <code className="text-xs ml-2 px-1 py-0.5 bg-purple-500/20 rounded">{item.className}</code>
                  </div>
                )}
                
                {item.component && (
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-white/60">Componente:</span>
                    <code className="text-xs ml-2 px-1 py-0.5 bg-blue-500/20 rounded">{item.component}</code>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Obter uma contagem dos itens por seção
  const getItemCounts = () => {
    const schema = collectUISchemaData();
    return Object.keys(schema).reduce((counts, key) => {
      counts[key] = schema[key].items.length;
      return counts;
    }, {} as Record<string, number>);
  };
  
  const itemCounts = getItemCounts();
  const totalItems = Object.values(itemCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold">UI/UX Schema Exporter</h2>
          <p className="text-sm text-white/70">
            Exporte a documentação completa da interface JESTFLY ({totalItems} itens)
          </p>
        </div>
        
        <Button
          onClick={exportAsJson}
          disabled={isExporting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isExporting ? (
            <>Exportando...</>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Exportar UI Schema
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="all">Todos ({totalItems})</TabsTrigger>
          <TabsTrigger value="typography">Tipografia ({itemCounts.typography})</TabsTrigger>
          <TabsTrigger value="colors">Cores ({itemCounts.colors})</TabsTrigger>
          <TabsTrigger value="components">Componentes ({itemCounts.components})</TabsTrigger>
          <TabsTrigger value="glass">Glassmorfismo ({itemCounts.glassmorphism})</TabsTrigger>
          <TabsTrigger value="effects">Efeitos ({itemCounts.effects})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Documentação UI/UX Completa</CardTitle>
              <CardDescription>
                Visualize todos os elementos de interface do JESTFLY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {Object.values(collectUISchemaData()).map((section, index) => (
                  <div key={index} className="mb-8">
                    {renderSection(section)}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4">
              <Button
                onClick={exportAsJson}
                disabled={isExporting}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isExporting ? (
                  <>Exportando...</>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Schema Completo (JSON)
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="typography" className="mt-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
              <CardDescription>
                Fontes, tamanhos e estilos de texto utilizados no JESTFLY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {renderSection(collectUISchemaData().typography)}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="mt-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Cores</CardTitle>
              <CardDescription>
                Paleta de cores do sistema JESTFLY
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {renderSection(collectUISchemaData().colors)}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Componentes</CardTitle>
              <CardDescription>
                Componentes reutilizáveis do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {renderSection(collectUISchemaData().components)}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="glass" className="mt-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Glassmorfismo</CardTitle>
              <CardDescription>
                Estilos de vidro e blur usados na interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {renderSection(collectUISchemaData().glassmorphism)}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="effects" className="mt-4">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>Efeitos e Animações</CardTitle>
              <CardDescription>
                Efeitos visuais, animações e transições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                {renderSection(collectUISchemaData().effects)}
                {renderSection(collectUISchemaData().animations)}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UISchemaExporter;
