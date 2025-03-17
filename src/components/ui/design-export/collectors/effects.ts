
import { UISchemaItem } from '../types';

export const collectEffects = (items: UISchemaItem[]): void => {
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
