
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Logs in a user with email and password
 */
export const loginUser = async (email: string, password: string) => {
  try {
    console.log("Attempting login for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    console.log("Login successful for:", email);
    
    // Atualizar o timestamp de último login
    if (data.user) {
      console.log("Updating last login for user:", data.user.id);
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', data.user.id);
        
      if (updateError) {
        console.error('Erro ao atualizar last_login:', updateError);
      }
    }
    
    toast.success('Login realizado com sucesso!');
    return data;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * Logs out the current user
 */
export const logoutUser = async () => {
  try {
    console.log("Logging out user");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    console.log("Logout successful");
    toast.success('Logout realizado com sucesso');
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};
