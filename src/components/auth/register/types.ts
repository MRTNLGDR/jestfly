
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  username: string;
  profileType: ProfileType;
}

export type ProfileType = 'fan' | 'artist' | 'collaborator' | 'admin';
