
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Runs diagnostic checks for database connectivity and authentication
 */
export const runAuthDiagnostics = async (userId?: string): Promise<Record<string, any>> => {
  try {
    console.log("Running auth diagnostics...");
    
    // First check database connectivity
    const { data: connectivityData, error: connectivityError } = await supabase
      .rpc('check_auth_connectivity');
    
    if (connectivityError) {
      console.error("Database connectivity check failed:", connectivityError);
      return {
        success: false,
        database_connection: false,
        error: connectivityError.message
      };
    }
    
    console.log("Database connectivity results:", connectivityData);
    
    // Check specific user data if userId is provided
    let userData = null;
    let userError = null;
    
    if (userId) {
      const { data: userCheckData, error: userCheckError } = await supabase
        .rpc('check_user_data', { user_id: userId });
      
      userData = userCheckData;
      userError = userCheckError;
      
      if (userCheckError) {
        console.error("User data check failed:", userCheckError);
      } else {
        console.log("User data check results:", userCheckData);
      }
    }
    
    // Log the diagnostic information
    await supabase.rpc('log_auth_diagnostic', {
      message: 'Auth diagnostics run from client',
      metadata: {
        connectivity: connectivityData,
        user_data: userData,
        user_error: userError ? userError.message : null,
        timestamp: new Date().toISOString(),
        page: 'profile',
        browser: navigator.userAgent
      }
    });
    
    return {
      success: true,
      connectivity: connectivityData,
      user_data: userData,
      errors: {
        connectivity: connectivityError?.message || null,
        user: userError?.message || null
      }
    };
  } catch (error: any) {
    console.error("Failed to run auth diagnostics:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Checks if a user profile exists in the database
 */
export const checkUserProfile = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
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
    
    // 1. Refresh the session
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError) {
      console.error("Session refresh failed:", refreshError);
      return false;
    }
    
    if (!refreshData.session) {
      console.warn("No session after refresh");
      return false;
    }
    
    // 2. Check if the user has a profile
    const userId = refreshData.session.user.id;
    const hasProfile = await checkUserProfile(userId);
    
    if (!hasProfile) {
      console.warn("User has no profile in the database");
      toast.error("Perfil de usuário não encontrado. Entre em contato com o suporte.");
      return false;
    }
    
    console.log("Profile fix attempt completed successfully");
    toast.success("Sessão atualizada com sucesso!");
    return true;
  } catch (error) {
    console.error("Error during profile fix attempt:", error);
    return false;
  }
};
