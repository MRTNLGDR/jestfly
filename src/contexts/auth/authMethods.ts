
import { User } from '../../models/User';
import { authService } from './authService';
import { supabaseAuthService } from './supabaseAuthService';
import { createSupabaseUserData } from './userDataTransformer';

// Login method
export const login = async (
  email: string, 
  password: string, 
  setUserData: (userData: User | null) => void
) => {
  // Primeiro tentamos login com Supabase
  try {
    const { isAdmin, user } = await supabaseAuthService.loginAndCheckAdmin(email, password);
    
    // Se for admin no Supabase, obtemos o perfil
    if (user) {
      const profile = await supabaseAuthService.getUserProfile(user.id);
      
      if (profile) {
        // Use our updated transformer function
        const userDataFromSupabase = createSupabaseUserData(user, profile);
        setUserData(userDataFromSupabase);
        return;
      }
    }
  } catch (supabaseError) {
    console.error("Erro no login Supabase, tentando Firebase:", supabaseError);
    // Se falhar no Supabase, tentamos no Firebase
  }
  
  // Se chegou aqui, é porque não conseguiu no Supabase, então tentamos no Firebase
  await authService.login(email, password);
};

// Login with Google method
export const loginWithGoogle = async (
  setUserData: (userData: User | null) => void
) => {
  // Primeiro tentamos com Supabase
  try {
    await supabaseAuthService.loginWithGoogle();
    return;
  } catch (supabaseError) {
    console.error("Erro no login Google pelo Supabase, tentando Firebase:", supabaseError);
  }
  
  // Se falhar, tenta com Firebase
  await authService.loginWithGoogle();
};

// Register method
export const register = async (
  email: string, 
  password: string, 
  userData: Partial<User>,
  setUserData: (userData: User | null) => void
) => {
  // Registro no Supabase
  try {
    await supabaseAuthService.registerUser(email, password, userData);
    return;
  } catch (supabaseError) {
    console.error("Erro no registro pelo Supabase, tentando Firebase:", supabaseError);
  }
  
  // Se falhar no Supabase, tenta no Firebase
  await authService.register(email, password, userData);
};

// Logout method
export const logout = async () => {
  // Logout do Supabase
  try {
    await supabaseAuthService.logout();
  } catch (supabaseError) {
    console.error("Erro no logout do Supabase:", supabaseError);
  }
  
  // Logout do Firebase
  await authService.logout();
};

// Reset password method
export const resetPassword = async (email: string) => {
  // Reset de senha pelo Supabase
  try {
    await supabaseAuthService.resetPassword(email);
    return;
  } catch (supabaseError) {
    console.error("Erro no reset de senha pelo Supabase, tentando Firebase:", supabaseError);
  }
  
  // Se falhar no Supabase, tenta no Firebase
  await authService.resetPassword(email);
};
