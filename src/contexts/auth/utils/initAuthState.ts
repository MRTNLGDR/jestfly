
import { toast } from 'sonner';
import { supabase } from '../../../integrations/supabase/client';
import { fetchUserData } from '../authMethods';
import { logAuthDiagnostic } from './diagnosticUtils';

/**
 * Initializes the authentication state
 */
export const initializeAuthState = async () => {
  try {
    console.log("Initializing auth state");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Session error:", sessionError);
      toast.error("Erro ao verificar sessão: " + sessionError.message);
      return { user: null, profile: null, error: sessionError.message };
    }
    
    console.log("Initial session:", session ? "exists" : "none");
    
    const user = session?.user ?? null;
    
    if (user) {
      console.log("Fetching initial user profile for:", user.id);
      try {
        const userProfile = await fetchUserData(user.id);
        
        if (userProfile) {
          console.log("Initial user profile loaded successfully:", userProfile.display_name);
          
          // Log successful auth initialization for diagnostics
          await logAuthDiagnostic('Auth initialization successful', {
            user_id: user.id,
            profile_type: userProfile.profile_type,
            timestamp: new Date().toISOString()
          });
          
          return { user, profile: userProfile, error: null };
        } else {
          console.warn("No user profile found for authenticated user on initialization");
          toast.error("Não foi possível carregar seu perfil. Entre em contato com o suporte.");
          
          // Log diagnostic information
          await logAuthDiagnostic('No user profile found during auth initialization', {
            user_id: user.id,
            timestamp: new Date().toISOString()
          });
          
          return { user, profile: null, error: "Perfil de usuário não encontrado" };
        }
      } catch (profileError: any) {
        console.error("Error fetching initial profile:", profileError);
        toast.error("Erro ao buscar seu perfil. Tente novamente mais tarde.");
        
        // Log diagnostic information
        await logAuthDiagnostic('Error fetching initial profile', {
          user_id: user.id,
          error: String(profileError),
          timestamp: new Date().toISOString()
        });
        
        return { user, profile: null, error: "Erro ao buscar perfil inicial" };
      }
    }
    
    return { user: null, profile: null, error: null };
  } catch (err: any) {
    console.error("Error initializing auth:", err);
    toast.error("Erro ao inicializar autenticação. Recarregue a página.");
    return { user: null, profile: null, error: "Erro ao inicializar autenticação" };
  }
};
