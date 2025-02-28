
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
  lightIntensity: 1.5
};
