
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useActivityLogger = () => {
  const { profile } = useAuth();

  // Log login attempts
  const logLogin = async (success: boolean, email?: string) => {
    try {
      if (!email) return;

      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: success ? profile?.id : null,
          action: success ? 'Login bem-sucedido' : 'Tentativa de login falhou',
          entity_type: 'auth',
          success,
          details: { email },
          ip_address: await fetchIP()
        });

      if (error) {
        console.error('Error logging login activity:', error);
      }
    } catch (err) {
      console.error('Failed to log login activity:', err);
    }
  };

  // Log logout activity
  const logLogout = async () => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: profile.id,
          action: 'Logout',
          entity_type: 'auth',
          success: true,
          ip_address: await fetchIP()
        });

      if (error) {
        console.error('Error logging logout activity:', error);
      }
    } catch (err) {
      console.error('Failed to log logout activity:', err);
    }
  };

  // Log profile updates
  const logProfileUpdate = async (success: boolean, fields?: string[]) => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: profile.id,
          action: success ? 'Perfil atualizado' : 'Falha ao atualizar perfil',
          entity_type: 'profile',
          entity_id: profile.id,
          success,
          details: fields ? { updated_fields: fields } : {},
          ip_address: await fetchIP()
        });

      if (error) {
        console.error('Error logging profile update:', error);
      }
    } catch (err) {
      console.error('Failed to log profile update:', err);
    }
  };

  // Log system activities (for admin actions)
  const logSystemActivity = async (action: string, details?: Record<string, any>, success: boolean = true) => {
    try {
      if (!profile || profile.profile_type !== 'admin') return;

      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: profile.id,
          action,
          entity_type: 'system',
          success,
          details,
          ip_address: await fetchIP()
        });

      if (error) {
        console.error('Error logging system activity:', error);
      }
    } catch (err) {
      console.error('Failed to log system activity:', err);
    }
  };

  // Log access attempt to protected routes
  const logAccessAttempt = async (route: string, success: boolean) => {
    try {
      if (!profile) return;

      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: profile.id,
          action: success ? 'Acesso à rota permitido' : 'Tentativa de acesso não autorizado',
          entity_type: 'route',
          entity_id: route,
          success,
          details: { route },
          ip_address: await fetchIP()
        });

      if (error) {
        console.error('Error logging access attempt:', error);
      }
    } catch (err) {
      console.error('Failed to log access attempt:', err);
    }
  };

  // Helper to get IP address (in a real app, this could use an IP service)
  const fetchIP = async (): Promise<string> => {
    try {
      // In a real-world scenario, you might use a service or get this from the server
      // For this example, we'll return a placeholder
      return '127.0.0.1';
    } catch (error) {
      console.error('Error fetching IP:', error);
      return 'unknown';
    }
  };

  return {
    logLogin,
    logLogout,
    logProfileUpdate,
    logSystemActivity,
    logAccessAttempt
  };
};

// Export utility for system logs (can be used outside of components)
export const useSystemLogger = () => {
  const logger = useActivityLogger();
  return {
    logSystemEvent: logger.logSystemActivity
  };
};
