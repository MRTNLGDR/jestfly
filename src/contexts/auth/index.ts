
// Placeholder for contexts/auth module to avoid breaking imports
import { useAuth } from '../AuthContext';

export { useAuth };
export const supabaseAuthService = {
  isGoogleAuthEnabled: async () => false,
  checkAdminStatus: async () => false,
  loginAndCheckAdmin: async () => ({ isAdmin: false, user: null }),
  loginWithGoogle: async () => null,
  resetPassword: async () => {},
  logout: async () => {},
  getCurrentUser: async () => null
};
