
import { supabase } from '../../../integrations/supabase/client';

/**
 * Sends a password reset email to the specified email address
 */
export const resetUserPassword = async (email: string) => {
  try {
    console.log("Requesting password reset for:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Password reset error:", error);
      throw error;
    }
    
    console.log("Password reset email sent to:", email);
    // O toast é feito no componente para melhor feedback visual
    return true;
  } catch (error: any) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    throw error;
  }
};

/**
 * Updates the current user's password
 */
export const updateUserPassword = async (newPassword: string) => {
  try {
    console.log("Updating user password");
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Update password error:", error);
      throw error;
    }
    
    console.log("Password updated successfully");
    // O toast é feito no componente para melhor feedback visual
    return true;
  } catch (error: any) {
    console.error('Erro ao atualizar senha:', error);
    throw error;
  }
};
