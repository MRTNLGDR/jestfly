
import { ModelParameters } from './modelParameters';

export interface MaterialPreset {
  id: string;
  name: string;
  thumbnail: string;
  params: Partial<ModelParameters>;
}

export const materialPresets: MaterialPreset[] = [
  {
    id: 'crystal',
    name: 'Cristal',
    thumbnail: '/textures/presets/crystal.jpg',
    params: {
      color: "#ffffff",
      metalness: 0.1,
      roughness: 0.0,
      transmission: 0.95,
      thickness: 1.5,
      envMapIntensity: 2.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 2.75,
      reflectivity: 1.0,
      transparent: true,
      opacity: 1.0
    }
  },
  {
    id: 'glass',
    name: 'Vidro',
    thumbnail: '/textures/presets/glass.jpg',
    params: {
      color: "#ffffff",
      metalness: 0.0,
      roughness: 0.1,
      transmission: 0.98,
      thickness: 0.5,
      envMapIntensity: 1.0,
      clearcoat: 0.5,
      clearcoatRoughness: 0.05,
      ior: 1.52,
      reflectivity: 0.9,
      transparent: true,
      opacity: 0.9
    }
  },
  {
    id: 'metal',
    name: 'Metal',
    thumbnail: '/textures/presets/metal.jpg',
    params: {
      color: "#aaaacc",
      metalness: 1.0,
      roughness: 0.3,
      transmission: 0.0,
      envMapIntensity: 1.2,
      clearcoat: 0.0,
      transparent: false,
      opacity: 1.0
    }
  },
  {
    id: 'gold',
    name: 'Ouro',
    thumbnail: '/textures/presets/gold.jpg',
    params: {
      color: "#ffbb55",
      metalness: 1.0,
      roughness: 0.1,
      transmission: 0.0,
      envMapIntensity: 1.5,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transparent: false,
      opacity: 1.0
    }
  },
  {
    id: 'plastic',
    name: 'Plástico',
    thumbnail: '/textures/presets/plastic.jpg',
    params: {
      color: "#1e88e5",
      metalness: 0.0,
      roughness: 0.3,
      transmission: 0.0,
      envMapIntensity: 0.5,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      transparent: false,
      opacity: 1.0
    }
  },
  {
    id: 'wood',
    name: 'Madeira',
    thumbnail: '/textures/presets/wood.jpg',
    params: {
      color: "#a67c52",
      metalness: 0.0,
      roughness: 0.75,
      transmission: 0.0,
      envMapIntensity: 0.3,
      textureMap: "/textures/wood-diffuse.jpg",
      normalMap: "/textures/wood-normal.jpg",
      roughnessMap: "/textures/wood-roughness.jpg",
      transparent: false,
      opacity: 1.0
    }
  },
  {
    id: 'marble',
    name: 'Mármore',
    thumbnail: '/textures/presets/marble.jpg',
    params: {
      color: "#f5f5f5",
      metalness: 0.0,
      roughness: 0.2,
      transmission: 0.0,
      envMapIntensity: 0.7,
      textureMap: "/textures/marble-diffuse.jpg",
      normalMap: "/textures/marble-normal.jpg",
      transparent: false,
      opacity: 1.0
    }
  },
  {
    id: 'frosted-glass',
    name: 'Vidro Fosco',
    thumbnail: '/textures/presets/frosted-glass.jpg',
    params: {
      color: "#eeffff",
      metalness: 0.0,
      roughness: 0.4,
      transmission: 0.8,
      thickness: 0.5,
      envMapIntensity: 0.7,
      clearcoat: 0.0,
      ior: 1.5,
      transparent: true,
      opacity: 0.8
    }
  },
  {
    id: 'holographic',
    name: 'Holográfico',
    thumbnail: '/textures/presets/holographic.jpg',
    params: {
      color: "#ffffff",
      metalness: 0.5,
      roughness: 0.15,
      transmission: 0.5,
      thickness: 0.5,
      envMapIntensity: 2.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 2.0,
      iridescence: 1.0,
      iridescenceIOR: 1.5,
      transparent: true,
      opacity: 0.9
    }
  },
  {
    id: 'emissive',
    name: 'Emissivo',
    thumbnail: '/textures/presets/emissive.jpg',
    params: {
      color: "#ffffff",
      metalness: 0.0,
      roughness: 0.5,
      transmission: 0.0,
      envMapIntensity: 0.0,
      emissiveIntensity: 1.0,
      emissiveColor: "#ff5500",
      transparent: false,
      opacity: 1.0
    }
  }
];
