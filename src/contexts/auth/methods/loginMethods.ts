
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDiagnostic } from '../utils/diagnosticUtils';

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
      await logAuthDiagnostic('Login error', {
        error: error.message,
        email: email,
        timestamp: new Date().toISOString()
      });
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
    
    await logAuthDiagnostic('Login successful', {
      user_id: data.user?.id,
      email: email,
      timestamp: new Date().toISOString()
    });
    
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
    
    // Armazenar dados de diagnóstico antes do logout
    await logAuthDiagnostic('Logout attempt', {
      timestamp: new Date().toISOString()
    });
    
    // Tentar várias vezes em caso de falha
    let attempts = 0;
    let success = false;
    let lastError = null;
    
    while (attempts < 3 && !success) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error(`Logout error (attempt ${attempts + 1}):`, error);
          lastError = error;
        } else {
          success = true;
          console.log("Logout successful");
        }
      } catch (e) {
        console.error(`Exception in logout (attempt ${attempts + 1}):`, e);
        lastError = e;
      }
      
      attempts++;
      
      if (!success && attempts < 3) {
        // Esperar um pouco antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    if (!success && lastError) {
      await logAuthDiagnostic('Logout failed after attempts', {
        error: lastError.message,
        attempts,
        timestamp: new Date().toISOString()
      });
      throw lastError;
    }
    
    // Limpar qualquer dado de usuário armazenado localmente
    localStorage.removeItem('supabase.auth.token');
    
    await logAuthDiagnostic('Logout successful', {
      timestamp: new Date().toISOString()
    });
    
    // Limpeza de cache ajuda a resolver problemas de autenticação
    await fetch('/api/reset-cache', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {
      // Ignore errors here, it's just a best-effort cleanup
    });
    
    return true;
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};
