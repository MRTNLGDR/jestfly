
export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  username: string;
  profileType: 'fan' | 'artist' | 'collaborator' | 'admin';
  adminCode: string;
}

export interface ProfileTypeOption {
  value: 'fan' | 'artist' | 'collaborator' | 'admin';
  label: string;
}
