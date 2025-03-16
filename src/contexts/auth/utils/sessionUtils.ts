
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../models/User';
import { fetchUserData } from '../methods';
import { toast } from 'sonner';
import { logAuthDiagnostic } from './diagnosticUtils';

/**
 * Refreshes the user session and profile data
 */
export const refreshUserSession = async (
  currentUser: User | null
): Promise<{
  user: User | null;
  profile: UserProfile | null;
  error: string | null;
}> => {
  if (!currentUser) {
    console.warn("Cannot refresh user data: No current user");
    return { user: null, profile: null, error: null };
  }
  
  try {
    console.log("Refreshing user data for:", currentUser.id);
    
    // First refresh the session to ensure we have the latest token
    const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
    
    if (sessionError) {
      console.error("Session refresh failed:", sessionError);
      
      // Verificar se é um erro de timeout e fornecer uma mensagem mais clara
      if (sessionError.message.includes('timeout') || sessionError.message.includes('network')) {
        toast.error("Tempo limite excedido ao atualizar sessão. Verifique sua conexão e tente novamente.");
        return { user: null, profile: null, error: "Tempo limite excedido ao atualizar sessão" };
      }
      
      toast.error("Falha ao atualizar sessão. Tente fazer login novamente.");
      return { user: null, profile: null, error: sessionError.message };
    }
    
    if (!sessionData.session) {
      console.warn("No session after refresh");
      return { user: null, profile: null, error: "No session after refresh" };
    }
    
    const refreshedUser = sessionData.session.user;
    
    // Now get the latest user profile data with a longer timeout
    const fetchPromise = fetchUserData(refreshedUser.id);
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error("Tempo limite excedido ao buscar dados do perfil")), 15000);
    });
    
    // Race between fetch and timeout
    const refreshedData = await Promise.race([fetchPromise, timeoutPromise])
      .catch(error => {
        console.error("Fetch profile timeout:", error);
        logAuthDiagnostic('Profile fetch timeout during refresh', {
          user_id: refreshedUser.id,
          timestamp: new Date().toISOString()
        });
        return null;
      });
    
    if (refreshedData) {
      console.log("User data refreshed successfully:", refreshedData.display_name);
      return { user: refreshedUser, profile: refreshedData as UserProfile, error: null };
    } else {
      console.warn("Failed to refresh user data - no data returned from fetchUserData");
      toast.error("Dados do usuário não encontrados. Entre em contato com o suporte.");
      
      // Log diagnostic information
      await logAuthDiagnostic('No user profile found during refresh', {
        user_id: refreshedUser.id,
        timestamp: new Date().toISOString()
      });
      
      return { user: refreshedUser, profile: null, error: "Perfil de usuário não encontrado" };
    }
  } catch (err: any) {
    console.error("Error refreshing user data:", err);
    toast.error("Não foi possível atualizar os dados do usuário. Tente novamente mais tarde.");
    return { user: null, profile: null, error: err.message };
  }
};
