
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  username: string;
  profileType: 'fan' | 'artist' | 'collaborator';
  adminCode?: string;
}
