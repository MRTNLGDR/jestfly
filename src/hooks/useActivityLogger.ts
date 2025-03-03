
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LogActivityParams {
  action: string;
  entityType?: string;
  entityId?: string;
  details?: Record<string, any>;
  success?: boolean;
}

export const useActivityLogger = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const logActivity = async ({
    action,
    entityType,
    entityId,
    details = {},
    success = true
  }: LogActivityParams) => {
    if (!user) return null;

    try {
      // Chamar a função RPC para registrar a atividade
      const { data, error } = await supabase.rpc('log_user_activity', {
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        success
      });

      if (error) {
        console.error('Erro ao registrar atividade:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Exceção ao registrar atividade:', error);
      return null;
    }
  };

  // Função para registrar tentativas de login
  const logLogin = async (success: boolean, email?: string) => {
    return logActivity({
      action: 'user.login',
      entityType: 'auth.users',
      details: { email },
      success
    });
  };

  // Função para registrar logout
  const logLogout = async () => {
    return logActivity({
      action: 'user.logout',
      entityType: 'auth.users'
    });
  };

  // Função para registrar alterações de perfil
  const logProfileUpdate = async (success: boolean, fields?: string[]) => {
    return logActivity({
      action: 'profile.update',
      entityType: 'profiles',
      entityId: user?.id,
      details: { fields },
      success
    });
  };

  // Função para registrar tentativas de acesso não autorizado
  const logAccessAttempt = async (resource: string, allowed: boolean) => {
    return logActivity({
      action: 'access.attempt',
      entityType: 'resource',
      details: { resource, allowed },
      success: allowed
    });
  };

  return {
    logActivity,
    logLogin,
    logLogout,
    logProfileUpdate,
    logAccessAttempt
  };
};
