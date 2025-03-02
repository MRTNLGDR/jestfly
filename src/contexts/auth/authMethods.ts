
import { User } from '../../models/User';
import { authService } from './authService';
import { supabaseAuthService } from './supabaseAuthService';

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
        // Determinar o tipo de perfil baseado em algum critério
        // Como o campo profile_type ainda não existe, usamos uma lógica temporária
        let profileType: 'artist' | 'fan' | 'admin' | 'collaborator' = 'fan';
        if (profile.full_name?.includes('Admin')) {
          profileType = 'admin';
        }
        
        const userDataFromSupabase: User = {
          id: profile.id,
          email: user.email || '',
          username: profile.username || '',
          displayName: profile.full_name || user.email?.split('@')[0] || '',
          profileType,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
          lastLogin: new Date(),
          isVerified: user.email_confirmed_at !== null,
          twoFactorEnabled: false,
          socialLinks: {},
          preferences: {
            theme: 'system',
            language: 'pt',
            currency: 'BRL',
            notifications: {
              email: true,
              push: true,
              sms: false
            }
          },
          collectionItems: [],
          transactions: []
        };
        
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
