
export interface EnvironmentPreset {
  id: string;
  name: string;
  thumbnail: string;
  hdriPath: string;
  intensity: number;
}

export const environmentPresets: EnvironmentPreset[] = [
  {
    id: 'studio',
    name: 'Estúdio',
    thumbnail: '/textures/environments/studio.jpg',
    hdriPath: '/textures/environments/studio.hdr',
    intensity: 1.0
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    thumbnail: '/textures/environments/sunset.jpg',
    hdriPath: '/textures/environments/sunset.hdr',
    intensity: 1.2
  },
  {
    id: 'night',
    name: 'Noite',
    thumbnail: '/textures/environments/night.jpg',
    hdriPath: '/textures/environments/night.hdr',
    intensity: 0.8
  },
  {
    id: 'warehouse',
    name: 'Galpão',
    thumbnail: '/textures/environments/warehouse.jpg',
    hdriPath: '/textures/environments/warehouse.hdr',
    intensity: 1.0
  },
  {
    id: 'city',
    name: 'Cidade',
    thumbnail: '/textures/environments/city.jpg',
    hdriPath: '/textures/environments/city.hdr',
    intensity: 1.1
  }
];
