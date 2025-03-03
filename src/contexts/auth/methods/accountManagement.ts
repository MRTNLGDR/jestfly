
import { supabase } from '../../../integrations/supabase/client';
import { User as AppUser } from '../../../models/User';
import { toast } from 'sonner';
import { prepareUserDataForSupabase } from '../userDataTransformer';

/**
 * Fazer logout do usuário atual
 */
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    toast.success('Logout realizado com sucesso');
  } catch (err: any) {
    console.error("Erro no logout:", err);
    throw err;
  }
};

/**
 * Resetar a senha de um usuário
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
    
    toast.success('Instruções para redefinir senha foram enviadas para o seu email');
  } catch (err: any) {
    console.error("Erro ao resetar senha:", err);
    
    let errorMessage = 'Falha ao redefinir senha';
    if (err.message.includes('Email not found')) {
      errorMessage = 'Email não encontrado';
    }
    
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Atualizar dados do perfil do usuário
 */
export const updateProfile = async (userData: Partial<AppUser>): Promise<void> => {
  try {
    const supabaseData = prepareUserDataForSupabase(userData);
    
    const { error } = await supabase
      .from('profiles')
      .update(supabaseData)
      .eq('id', userData.id);
    
    if (error) {
      throw error;
    }
    
    toast.success('Perfil atualizado com sucesso');
  } catch (err: any) {
    console.error("Erro ao atualizar perfil:", err);
    toast.error('Falha ao atualizar perfil');
    throw err;
  }
};
