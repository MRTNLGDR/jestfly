
export interface TextureReference {
  id: string;
  name: string;
  file: File;
  url: string;
  type: 'diffuse' | 'normal' | 'roughness' | 'metalness' | 'emissive' | 'ao' | 'displacement' | 'alpha' | 'bump' | 'env' | 'lightmap' | 'other';
}

export interface ModelReference {
  id: string;
  name: string;
  file: File;
  url: string;
  format: 'gltf' | 'glb' | 'obj' | 'fbx' | 'other';
  thumbnail?: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  file: File;
  url: string;
  type: string;
  size: number;
  isTexture: boolean;
  isModel: boolean;
  referenceType?: string;
}
