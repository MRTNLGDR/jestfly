
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDiagnostic } from '../contexts/auth/utils/diagnosticUtils';

/**
 * Runs diagnostic checks for database connectivity and authentication
 */
export const runAuthDiagnostics = async (userId?: string): Promise<Record<string, any>> => {
  try {
    console.log("Running auth diagnostics...");
    const startTime = Date.now();
    
    // First check if we can query basic tables
    let connectivityData = null;
    let connectivityError = null;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
        
      connectivityData = { success: !error, count: data?.length || 0 };
      connectivityError = error;
      
      console.log(`DB Connectivity check completed in ${Date.now() - startTime}ms:`, 
        error ? "Failed" : "Success");
    } catch (err: any) {
      connectivityError = err;
      console.error(`DB Connectivity check failed in ${Date.now() - startTime}ms:`, err);
    }
    
    // Check specific user data if userId is provided
    let userData = null;
    let userError = null;
    
    if (userId) {
      try {
        console.log(`Checking profile data for user ${userId}`);
        const userCheckStartTime = Date.now();
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, display_name, username, profile_type, is_verified, created_at, last_login')
          .eq('id', userId)
          .maybeSingle();
        
        userData = data;
        userError = error;
        
        console.log(`User data check completed in ${Date.now() - userCheckStartTime}ms:`,
          error ? "Failed" : "Success");
      } catch (err: any) {
        userError = err;
        console.error(`User data check failed: ${err.message}`);
      }
    }
    
    // Check auth session status
    let sessionData = null;
    let sessionError = null;
    
    try {
      console.log("Checking current auth session");
      const sessionCheckStartTime = Date.now();
      
      const { data, error } = await supabase.auth.getSession();
      
      sessionData = {
        has_session: !!data.session,
        user_id: data.session?.user?.id || null,
        expires_at: data.session?.expires_at || null
      };
      sessionError = error;
      
      console.log(`Session check completed in ${Date.now() - sessionCheckStartTime}ms:`,
        error ? "Failed" : (data.session ? "Has valid session" : "No active session"));
    } catch (err: any) {
      sessionError = err;
      console.error(`Session check failed: ${err.message}`);
    }
    
    // Log the diagnostic information
    await logAuthDiagnostic('Auth diagnostics run from client', {
      connectivity: connectivityData,
      user_data: userData,
      session: sessionData,
      user_error: userError ? userError.message : null,
      session_error: sessionError ? sessionError.message : null,
      connectivity_error: connectivityError ? connectivityError.message : null,
      timestamp: new Date().toISOString(),
      page: 'profile',
      browser: navigator.userAgent,
      diagnostics_time_ms: Date.now() - startTime
    });
    
    console.log(`Auth diagnostics completed in ${Date.now() - startTime}ms`);
    
    return {
      success: true,
      connectivity: connectivityData,
      user_data: userData,
      session: sessionData,
      errors: {
        connectivity: connectivityError?.message || null,
        user: userError?.message || null,
        session: sessionError?.message || null
      },
      execution_time_ms: Date.now() - startTime
    };
  } catch (error: any) {
    console.error("Failed to run auth diagnostics:", error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Checks if a user profile exists in the database
 */
export const checkUserProfile = async (userId: string): Promise<boolean> => {
  try {
    console.log(`Verificando existência do perfil para usuário: ${userId}`);
    const startTime = Date.now();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    console.log(`Verificação concluída em ${Date.now() - startTime}ms:`, 
      error ? "Perfil não encontrado" : "Perfil encontrado");
    
    if (error) {
      console.error("Error checking user profile:", error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Exception checking user profile:", error);
    return false;
  }
};

/**
 * Attempts to fix common profile issues by refreshing the auth session
 */
export const attemptProfileFix = async (): Promise<boolean> => {
  try {
    console.log("Attempting to fix profile issues...");
    const startTime = Date.now();
    
    // 1. Refresh the session
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error(`Session refresh failed in ${Date.now() - startTime}ms:`, refreshError);
      
      // Se for timeout, tentar novamente com um timeout menor
      if (refreshError.message.includes('timeout') || refreshError.message.includes('network')) {
        toast.warning("Tempo limite excedido. Tentando método alternativo...");
        
        // Tentar desconectar e reconectar para forçar nova sessão
        try {
          await supabase.auth.signOut();
          toast.info("Sessão encerrada. Por favor, faça login novamente.");
          return false;
        } catch (signOutErr) {
          console.error("Erro ao tentar logout:", signOutErr);
          return false;
        }
      }
      
      return false;
    }
    
    console.log(`Session refreshed in ${Date.now() - startTime}ms`);
    
    if (!refreshData.session) {
      console.warn("No session after refresh");
      return false;
    }
    
    // 2. Check if the user has a profile
    const userId = refreshData.session.user.id;
    const hasProfile = await checkUserProfile(userId);
    
    if (!hasProfile) {
      console.warn("User has no profile in the database");
      
      // 3. Tentar criar um perfil se não existir
      try {
        console.log("Attempting to create missing profile");
        const user = refreshData.session.user;
        const userMeta = user.user_metadata || {};
        
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            display_name: userMeta.name || user.email?.split('@')[0] || 'User',
            username: userMeta.username || user.email?.split('@')[0] || `user_${Date.now()}`,
            profile_type: 'fan',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });
          
        if (createError) {
          console.error("Error creating profile:", createError);
          toast.error("Não foi possível criar perfil. Entre em contato com o suporte.");
          return false;
        }
        
        console.log("Profile created successfully");
        toast.success("Perfil criado com sucesso!");
        return true;
      } catch (createErr) {
        console.error("Error creating profile:", createErr);
        return false;
      }
    }
    
    console.log(`Profile fix attempt completed successfully in ${Date.now() - startTime}ms`);
    toast.success("Sessão atualizada com sucesso!");
    return true;
  } catch (error) {
    console.error("Error during profile fix attempt:", error);
    return false;
  }
};
