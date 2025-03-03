
export const PROFILE_TYPES = [
  { value: 'fan', label: 'Fã' },
  { value: 'artist', label: 'Artista' },
  { value: 'collaborator', label: 'Profissional' },
  { value: 'admin', label: 'Admin' }
] as const;

export type ProfileType = 'fan' | 'artist' | 'collaborator' | 'admin';
