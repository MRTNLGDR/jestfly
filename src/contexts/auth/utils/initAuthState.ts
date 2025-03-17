
import { toast } from 'sonner';
import { supabase } from '../../../integrations/supabase/client';
import { fetchUserData } from '../methods/profileMethods';
import { logAuthDiagnostic } from './diagnosticUtils';
import { UserProfile } from '../../../types/auth';
import { forceCreateProfile } from '../../../services/diagnostic/profileRepair';

/**
 * Inicializa o estado de autenticação
 */
export const initializeAuthState = async () => {
  try {
    console.log("Inicializando estado de autenticação");
    
    // Usar um timeout promise para evitar que a operação fique presa
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise<{data: {session: null}, error: Error}>((_, reject) => {
      setTimeout(() => reject(new Error("Tempo limite excedido ao buscar sessão")), 10000);
    });
    
    // Race entre a operação normal e o timeout
    const { data: { session }, error: sessionError } = await Promise.race([
      sessionPromise,
      timeoutPromise
    ]) as { data: { session: any }, error: any };
    
    if (sessionError) {
      console.error("Erro de sessão:", sessionError);
      toast.error("Erro ao verificar sessão: " + sessionError.message);
      return { user: null, profile: null, error: sessionError.message };
    }
    
    console.log("Sessão inicial:", session ? "existe" : "nenhuma");
    
    const user = session?.user ?? null;
    
    if (user) {
      console.log("Buscando perfil inicial para:", user.id);
      try {
        // Verificar se o perfil existe com timeout
        const checkProfilePromise = supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        const checkTimeoutPromise = new Promise<{data: null, error: Error}>((_, reject) => {
          setTimeout(() => reject(new Error("Tempo limite excedido ao verificar perfil")), 10000);
        });
        
        const { data: profileExists, error: checkError } = await Promise.race([
          checkProfilePromise,
          checkTimeoutPromise
        ]) as { data: any, error: any };
        
        if (checkError) {
          console.error("Erro ao verificar se o perfil existe:", checkError);
          await logAuthDiagnostic('Erro ao verificar perfil durante inicialização', {
            user_id: user.id,
            error: String(checkError),
            timestamp: new Date().toISOString()
          });
        }
        
        // Se o perfil não existir, crie-o com dados básicos
        if (!profileExists) {
          console.log("Perfil não existe, criando um para o usuário:", user.id);
          const created = await forceCreateProfile(user);
          
          if (!created.success) {
            console.error("Falha ao criar perfil usando método forçado");
            toast.error("Falha ao criar seu perfil. Tente novamente ou entre em contato com o suporte.");
            return { user, profile: null, error: "Falha ao criar perfil" };
          }
          
          console.log("Perfil criado com sucesso usando método forçado");
        }
        
        // Agora busque o perfil completo com timeout
        const fetchProfilePromise = fetchUserData(user.id);
        const fetchTimeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error("Tempo limite excedido ao buscar dados de perfil")), 10000);
        });
        
        const userProfile = await Promise.race([fetchProfilePromise, fetchTimeoutPromise])
          .catch(async (error) => {
            console.error("Timeout na busca de perfil durante inicialização:", error);
            await logAuthDiagnostic('Timeout na busca de perfil durante inicialização', {
              user_id: user.id,
              error: String(error),
              timestamp: new Date().toISOString()
            });
            return null;
          });
        
        if (userProfile) {
          // Type assertion para garantir que o TypeScript reconheça isso como UserProfile
          const typedUserProfile = userProfile as UserProfile;
          console.log("Perfil de usuário inicial carregado com sucesso:", typedUserProfile.display_name);
          
          // Registrar inicialização de autenticação bem-sucedida para diagnóstico
          await logAuthDiagnostic('Inicialização de autenticação bem-sucedida', {
            user_id: user.id,
            profile_type: typedUserProfile.profile_type,
            timestamp: new Date().toISOString()
          });
          
          return { user, profile: typedUserProfile, error: null };
        } else {
          console.warn("Nenhum perfil de usuário encontrado para usuário autenticado na inicialização");
          toast.error("Não foi possível carregar seu perfil. Use a função diagnóstico para resolver o problema.");
          
          // Registrar informações de diagnóstico
          await logAuthDiagnostic('Nenhum perfil de usuário encontrado durante inicialização de autenticação', {
            user_id: user.id,
            timestamp: new Date().toISOString()
          });
          
          return { user, profile: null, error: "Perfil de usuário não encontrado" };
        }
      } catch (profileError: any) {
        console.error("Erro ao buscar perfil inicial:", profileError);
        toast.error("Erro ao buscar seu perfil. Use a função diagnóstico para resolver o problema.");
        
        // Registrar informações de diagnóstico
        await logAuthDiagnostic('Erro ao buscar perfil inicial', {
          user_id: user.id,
          error: String(profileError),
          timestamp: new Date().toISOString()
        });
        
        return { user, profile: null, error: "Erro ao buscar perfil inicial" };
      }
    }
    
    return { user: null, profile: null, error: null };
  } catch (err: any) {
    console.error("Erro ao inicializar autenticação:", err);
    toast.error("Erro ao inicializar autenticação. Recarregue a página.");
    return { user: null, profile: null, error: "Erro ao inicializar autenticação" };
  }
};
