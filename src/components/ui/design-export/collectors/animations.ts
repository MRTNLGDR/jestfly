
import { UISchemaItem } from '../types';

export const collectAnimations = (items: UISchemaItem[]): void => {
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
