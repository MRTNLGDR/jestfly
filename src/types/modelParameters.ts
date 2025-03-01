
export interface ModelParameters {
  color: string;
  metalness: number;
  roughness: number;
  transmission: number;
  thickness: number;
  envMapIntensity: number;
  clearcoat: number;
  clearcoatRoughness: number;
  ior: number;
  reflectivity: number;
  iridescence: number;
  iridescenceIOR: number;
  lightIntensity: number;
  opacity: number;
  transparent: boolean;
  textureMap: string;
  normalMap: string;
  roughnessMap: string;
  metalnessMap: string;
  emissiveIntensity: number;
  emissiveColor: string;
  aoMapIntensity: number;
  displacementScale: number;
  wireframe: boolean;
  side: 'front' | 'back' | 'double';
  bumpMap?: string;
  bumpScale?: number;
  envMap?: string;
  displacementMap?: string;
  alphaMap?: string;
  lightMap?: string;
  lightMapIntensity?: number;
}

export const defaultModelParams: ModelParameters = {
  color: "#ffffff",
  metalness: 0.2,
  roughness: 0.01,
  transmission: 0.98,
  thickness: 1.0,
  envMapIntensity: 2.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.01,
  ior: 2.75,
  reflectivity: 1.0,
  iridescence: 0.3,
  iridescenceIOR: 1.3,
  lightIntensity: 1.5,
  opacity: 1.0,
  transparent: true,
  textureMap: "",
  normalMap: "",
  roughnessMap: "",
  metalnessMap: "",
  emissiveIntensity: 0,
  emissiveColor: "#000000",
  aoMapIntensity: 1.0,
  displacementScale: 0.1,
  wireframe: false,
  side: 'front',
  bumpScale: 0.05,
  lightMapIntensity: 1.0
};
