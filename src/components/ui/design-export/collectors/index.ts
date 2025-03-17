
import { UISchemaItem, UISchemaSection, UISchemaData } from '../types';
import { collectTypography } from './typography';
import { collectColors } from './colors';
import { collectGlassmorphism } from './glassmorphism';
import { collectAnimations } from './animations';
import { collectCards } from './cards';
import { collectButtons } from './buttons';
import { collectSpacing } from './spacing';
import { collectEffects } from './effects';
import { collectComponents } from './components';

export const collectUISchemaData = (): UISchemaData => {
  const schemaData: UISchemaData = {
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

export const getItemCounts = (): Record<string, number> => {
  const schema = collectUISchemaData();
  return Object.keys(schema).reduce((counts, key) => {
    counts[key] = schema[key].items.length;
    return counts;
  }, {} as Record<string, number>);
};

export const getTotalItems = (): number => {
  const itemCounts = getItemCounts();
  return Object.values(itemCounts).reduce((sum, count) => sum + count, 0);
};
