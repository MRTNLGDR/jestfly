
import { UISchemaItem } from '../types';

export const collectTypography = (items: UISchemaItem[]): void => {
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
