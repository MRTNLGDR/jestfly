
import { PermissionType } from '../../../contexts/auth/types';

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  username: string;
  profileType: ProfileType;
}

// Garantir que o tipo ProfileType seja exatamente igual ao enum no banco de dados
export type ProfileType = 'admin' | 'artist' | 'fan' | 'collaborator';
