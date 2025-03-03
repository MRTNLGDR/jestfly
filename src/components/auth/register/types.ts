
import { ProfileType } from './constants';

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  username: string;
  profileType: ProfileType;
  adminCode: string;
}
