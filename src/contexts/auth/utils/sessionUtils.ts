
import { User } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { UserProfile } from '../../../types/auth';
import { fetchUserData } from '../methods/profileMethods';
import { toast } from 'sonner';
import { logAuthDiagnostic } from './diagnosticUtils';

/**
 * Atualiza a sessão do usuário e dados do perfil
 */
export const refreshUserSession = async (
  currentUser: User | null
): Promise<{
  user: User | null;
  profile: UserProfile | null;
  error: string | null;
}> => {
  if (!currentUser) {
    console.warn("Não é possível atualizar dados: Nenhum usuário atual");
    return { user: null, profile: null, error: null };
  }
  
  try {
    console.log("Atualizando dados do usuário para:", currentUser.id);
    
    // Primeiro atualizar a sessão para garantir que temos o token mais recente
    const { data: sessionData, error: sessionError } = await supabase.auth.refreshSession();
    
    if (sessionError) {
      console.error("Falha na atualização da sessão:", sessionError);
      
      // Verificar se é um erro de timeout e fornecer uma mensagem mais clara
      if (sessionError.message.includes('timeout') || sessionError.message.includes('network')) {
        toast.error("Tempo limite excedido ao atualizar sessão. Verifique sua conexão e tente novamente.");
        return { user: null, profile: null, error: "Tempo limite excedido ao atualizar sessão" };
      }
      
      toast.error("Falha ao atualizar sessão. Tente fazer login novamente.");
      return { user: null, profile: null, error: sessionError.message };
    }
    
    if (!sessionData.session) {
      console.warn("Nenhuma sessão após atualização");
      return { user: null, profile: null, error: "Nenhuma sessão após atualização" };
    }
    
    const refreshedUser = sessionData.session.user;
    
    // Agora obter os dados mais recentes do perfil do usuário com um timeout maior
    const fetchPromise = fetchUserData(refreshedUser.id);
    const timeoutPromise = new Promise<null>((_, reject) => {
      setTimeout(() => reject(new Error("Tempo limite excedido ao buscar dados do perfil")), 10000);
    });
    
    // Race entre busca e timeout
    const refreshedData = await Promise.race([fetchPromise, timeoutPromise])
      .catch(error => {
        console.error("Timeout na busca de perfil:", error);
        logAuthDiagnostic('Timeout na busca de perfil durante atualização', {
          user_id: refreshedUser.id,
          timestamp: new Date().toISOString()
        });
        return null;
      });
    
    if (refreshedData) {
      console.log("Dados do usuário atualizados com sucesso:", refreshedData.display_name);
      return { user: refreshedUser, profile: refreshedData as UserProfile, error: null };
    } else {
      console.warn("Falha ao atualizar dados do usuário - nenhum dado retornado de fetchUserData");
      
      // Tentar criação/correção de perfil automaticamente
      const { error: insertError } = await supabase
        .from('profiles')
        .upsert({
          id: refreshedUser.id,
          email: refreshedUser.email,
          display_name: refreshedUser.user_metadata?.display_name || refreshedUser.email?.split('@')[0] || 'User',
          username: refreshedUser.user_metadata?.username || refreshedUser.email?.split('@')[0] || `user_${Date.now()}`,
          profile_type: refreshedUser.user_metadata?.profile_type || 'fan',
          avatar: refreshedUser.user_metadata?.avatar_url || null,
          is_verified: false,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (insertError) {
        console.error("Erro na criação automática de perfil durante atualização:", insertError);
        toast.error("Não foi possível recuperar seu perfil. Tente novamente ou entre em contato com o suporte.");
        return { user: refreshedUser, profile: null, error: "Perfil de usuário não encontrado" };
      }
      
      // Tentar buscar novamente após criação automática
      try {
        const newData = await fetchUserData(refreshedUser.id);
        if (newData) {
          toast.success("Perfil recuperado com sucesso!");
          return { user: refreshedUser, profile: newData as UserProfile, error: null };
        }
      } catch (err) {
        console.error("Erro ao buscar perfil após criação automática:", err);
      }
      
      // Se ainda não conseguimos carregar, mostrar erro
      toast.error("Dados do usuário não encontrados. Tente novamente ou entre em contato com o suporte.");
      
      // Registrar informações de diagnóstico
      await logAuthDiagnostic('Nenhum perfil de usuário encontrado durante atualização', {
        user_id: refreshedUser.id,
        timestamp: new Date().toISOString()
      });
      
      return { user: refreshedUser, profile: null, error: "Perfil de usuário não encontrado" };
    }
  } catch (err: any) {
    console.error("Erro ao atualizar dados do usuário:", err);
    toast.error("Não foi possível atualizar os dados do usuário. Tente novamente mais tarde.");
    return { user: null, profile: null, error: err.message };
  }
};
