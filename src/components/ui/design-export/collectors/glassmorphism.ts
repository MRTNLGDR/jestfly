
import { UISchemaItem } from '../types';

export const collectGlassmorphism = (items: UISchemaItem[]): void => {
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
