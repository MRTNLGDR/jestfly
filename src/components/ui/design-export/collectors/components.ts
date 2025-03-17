
import { UISchemaItem } from '../types';

export const collectComponents = (items: UISchemaItem[]): void => {
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
