import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';
import { verifyAdminCode } from './adminAuth';
import { User } from '../../../models/User';

/**
 * Login with email and password
 */
export const login = async (email: string, password: string): Promise<void> => {
  try {
    // Use Supabase for authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      // Update last login time is handled by the profile fetch
      toast.success('Login realizado com sucesso!');
    }
  } catch (err: any) {
    console.error("Login error:", err);
    
    // Traduzir mensagens de erro comuns
    let errorMessage = 'Falha ao fazer login';
    if (err.message.includes('Invalid login credentials')) {
      errorMessage = 'Credenciais inválidas';
    } else if (err.message.includes('Email not confirmed')) {
      errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Register a new user with email and password
 */
export const register = async (
  email: string, 
  password: string, 
  userData: Partial<User>
): Promise<void> => {
  try {
    // Preparar dados do perfil para registro
    const userMetadata = {
      full_name: userData.displayName,
      username: userData.username,
      profile_type: userData.profileType
    };
    
    // Verificar se é cadastro de admin e validar código
    if (userData.profileType === 'admin' && userData.adminCode) {
      // Verificar o código admin antes do registro
      const { data: codeValid, error } = await supabase.rpc(
        'has_role', // Fixed function name that should exist in Supabase
        { user_id: 'system', required_role: 'admin' }
      );
      
      if (error || !codeValid) {
        throw new Error('Código de administrador inválido ou já utilizado');
      }
    }
    
    // Registrar usuário no Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
        emailRedirectTo: `${window.location.origin}/login`
      }
    });
    
    if (error) {
      throw error;
    }
    
    // Se o código chegou até aqui e é um admin, processar o código admin
    if (data?.user && userData.profileType === 'admin' && userData.adminCode) {
      await verifyAdminCode(data.user.id, userData.adminCode);
    }
    
    toast.success('Conta criada! Verifique seu email para confirmar o cadastro.');
    
  } catch (err: any) {
    console.error("Registration error:", err);
    
    // Traduzir mensagens de erro comuns
    let errorMessage = 'Falha ao criar conta';
    
    if (err.message.includes('User already registered')) {
      errorMessage = 'Este email já está em uso';
    } else if (err.message.includes('invalid email')) {
      errorMessage = 'Email inválido';
    } else if (err.message.includes('Password should be')) {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres';
    } else if (err.message.includes('Código de administrador inválido')) {
      errorMessage = 'Código de administrador inválido ou já utilizado';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Reset password for a user
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    // Use Supabase for password reset
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    toast.success('Instruções para redefinir senha foram enviadas para o seu email');
  } catch (err: any) {
    console.error("Password reset error:", err);
    
    // Traduzir mensagens de erro comuns
    let errorMessage = 'Falha ao redefinir senha';
    if (err.message.includes('Email not found')) {
      errorMessage = 'Email não encontrado';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};
