
import { toast } from 'sonner';
import { supabase } from '../../../integrations/supabase/client';
import { fetchUserData } from '../methods';
import { logAuthDiagnostic } from './diagnosticUtils';
import { UserProfile } from '../../../models/User';

/**
 * Initializes the authentication state
 */
export const initializeAuthState = async () => {
  try {
    console.log("Initializing auth state");
    
    // Use a timeout promise para evitar que a operação fique presa
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<{data: {session: null}, error: Error}>((_, reject) => {
      setTimeout(() => reject(new Error("Tempo limite excedido ao buscar sessão")), 8000);
    });
    
    // Race entre a operação normal e o timeout
    const { data: { session }, error: sessionError } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]) as { data: { session: any }, error: any };
    
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
        // Verifique se o perfil existe com timeout
        const checkProfilePromise = supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        const checkTimeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
          setTimeout(() => reject(new Error("Tempo limite excedido ao verificar perfil")), 8000);
        });
        
        const { data: profileExists, error: checkError } = await Promise.race([
          checkProfilePromise,
          checkTimeoutPromise
        ]) as { data: any, error: any };
        
        if (checkError) {
          console.error("Error checking if profile exists:", checkError);
          await logAuthDiagnostic('Error checking if profile exists during init', {
            user_id: user.id,
            error: String(checkError),
            timestamp: new Date().toISOString()
          });
        }
        
        // Se o perfil não existir, crie-o com dados básicos
        if (!profileExists) {
          console.log("Profile does not exist, creating one for user:", user.id);
          try {
            const userMetadata = user.user_metadata || {};
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                display_name: userMetadata.display_name || userMetadata.name || user.email?.split('@')[0] || 'User',
                username: userMetadata.username || user.email?.split('@')[0] || `user_${Date.now()}`,
                profile_type: userMetadata.profile_type || 'fan',
                avatar: userMetadata.avatar_url || null,
                is_verified: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                last_login: new Date().toISOString()
              });
            
            if (insertError) {
              console.error("Error creating profile:", insertError);
              // Log diagnostic information
              await logAuthDiagnostic('Error creating profile during init', {
                user_id: user.id,
                error: String(insertError),
                timestamp: new Date().toISOString()
              });
            } else {
              console.log("Successfully created profile for:", user.id);
            }
          } catch (createErr) {
            console.error("Exception when creating profile:", createErr);
          }
        }
        
        // Agora busque o perfil completo com timeout
        const fetchProfilePromise = fetchUserData(user.id);
        const fetchTimeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("Tempo limite excedido ao buscar dados de perfil")), 10000);
        });
        
        const userProfile = await Promise.race([fetchProfilePromise, fetchTimeoutPromise])
          .catch(async (error) => {
            console.error("Profile fetch timeout during init:", error);
            await logAuthDiagnostic('Profile fetch timeout during init', {
              user_id: user.id,
              error: String(error),
              timestamp: new Date().toISOString()
            });
            return null;
          });
        
        if (userProfile) {
          // Type assertion to ensure TypeScript knows this is a UserProfile
          const typedUserProfile = userProfile as UserProfile;
          console.log("Initial user profile loaded successfully:", typedUserProfile.display_name);
          
          // Log successful auth initialization for diagnostics
          await logAuthDiagnostic('Auth initialization successful', {
            user_id: user.id,
            profile_type: typedUserProfile.profile_type,
            timestamp: new Date().toISOString()
          });
          
          return { user, profile: typedUserProfile, error: null };
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
