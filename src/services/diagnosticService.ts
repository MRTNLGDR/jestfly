
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { logAuthDiagnostic } from '../contexts/auth/utils/diagnosticUtils';

/**
 * Runs diagnostic checks for database connectivity and authentication
 */
export const runAuthDiagnostics = async (userId?: string): Promise<Record<string, any>> => {
  try {
    console.log("Running auth diagnostics...");
    
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
    } catch (err: any) {
      connectivityError = err;
    }
    
    console.log("Database connectivity results:", connectivityData);
    
    // Check specific user data if userId is provided
    let userData = null;
    let userError = null;
    
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        
        userData = data;
        userError = error;
      } catch (err: any) {
        userError = err;
      }
      
      if (userError) {
        console.error("User data check failed:", userError);
      } else {
        console.log("User data check results:", userData);
      }
    }
    
    // Log the diagnostic information
    await logAuthDiagnostic('Auth diagnostics run from client', {
      connectivity: connectivityData,
      user_data: userData,
      user_error: userError ? userError.message : null,
      timestamp: new Date().toISOString(),
      page: 'profile',
      browser: navigator.userAgent
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
