
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Versão modificada que não depende do useAuth inicialmente
export const useActivityLogger = () => {
  const [loading, setLoading] = useState(false);

  const logActivity = useCallback(async (
    action: string, 
    userId?: string, 
    entityType?: string, 
    entityId?: string, 
    success: boolean = true,
    details?: Record<string, any>
  ) => {
    if (!userId) return; // Não registra se não houver ID de usuário
    
    setLoading(true);
    try {
      // Log para o console durante o desenvolvimento
      console.log('Activity Log:', { 
        action, 
        userId, 
        entityType, 
        entityId, 
        success, 
        details 
      });
      
      // Em produção, enviar para o Supabase
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          success,
          ip_address: null, // Seria coletado no servidor
          details
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logAccessAttempt = useCallback((
    resource: string,
    success: boolean,
    userId?: string
  ) => {
    if (!userId) return; // Não registra se não houver ID de usuário
    
    logActivity(
      `Tentativa de acesso a ${resource}`,
      userId,
      'resource',
      resource,
      success,
      { resourcePath: resource }
    );
  }, [logActivity]);

  return {
    loading,
    logActivity,
    logAccessAttempt
  };
};
