
import { User } from '@supabase/supabase-js';
import { UserProfile } from '../../models/User';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetUserPassword,
  updateUserProfile
} from './methods';

interface UseAuthMethodsProps {
  currentUser: User | null;
  userData: UserProfile | null;
  setUserData: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useAuthMethods = ({
  currentUser,
  userData,
  setUserData,
  setError
}: UseAuthMethodsProps) => {
  
  // Wrapper for login to match the expected return type in AuthContextType
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      await loginUser(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Wrapper for register to match the expected return type in AuthContextType
  const register = async (email: string, password: string, userData: Partial<UserProfile>): Promise<void> => {
    try {
      setError(null);
      await registerUser(email, password, userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Wrapper for logout to match the expected return type in AuthContextType
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Wrapper for resetPassword to match the expected return type in AuthContextType
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await resetUserPassword(email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Wrapper for updateProfile to match the expected return type in AuthContextType
  const updateProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!currentUser || !userData) {
      throw new Error("Usuário não autenticado");
    }

    try {
      await updateUserProfile(currentUser.id, data);
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    login,
    register,
    logout,
    resetPassword,
    updateProfile
  };
};
