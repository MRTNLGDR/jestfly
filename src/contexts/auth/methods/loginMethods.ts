
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
    
    // Verificar se o perfil existe
    if (data.user) {
      const { data: profileExists, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (checkError) {
        console.error("Error checking if profile exists:", checkError);
      }
      
      // Se o perfil não existir, crie-o
      if (!profileExists) {
        console.log("Profile does not exist after login, creating one");
        try {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              display_name: data.user.email?.split('@')[0] || 'User',
              username: data.user.email?.split('@')[0] || `user_${Date.now()}`,
              profile_type: data.user.email?.includes('admin') ? 'admin' : 'fan',
              is_verified: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            });
          
          if (createError) {
            console.error("Error creating missing profile after login:", createError);
          } else {
            console.log("Successfully created missing profile after login");
          }
        } catch (createErr) {
          console.error("Exception creating missing profile after login:", createErr);
        }
      }
      
      // Atualizar o timestamp de último login
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
