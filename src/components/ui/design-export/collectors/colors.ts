
import { UISchemaItem } from '../types';

export const collectColors = (items: UISchemaItem[]): void => {
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
