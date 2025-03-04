
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useActivityLogger = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  /**
   * Log a user activity to the database
   * @param action Description of the action
   * @param entityType Type of entity (e.g., 'auth', 'profile', 'post')
   * @param entityId ID of the entity (optional)
   * @param success Whether the action was successful
   * @param details Additional details about the action
   */
  const logActivity = useCallback(async (
    action: string, 
    entityType?: string, 
    entityId?: string, 
    success: boolean = true,
    details?: Record<string, any>
  ) => {
    const userId = user?.id;
    if (!userId) {
      console.warn('Cannot log activity: No authenticated user');
      return;
    }
    
    setLoading(true);
    try {
      // Development logging
      console.log('Activity Log:', { 
        action, 
        userId, 
        entityType, 
        entityId, 
        success, 
        details 
      });
      
      // Insert to Supabase
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          success,
          details,
          // IP address would be collected server-side
          // Here we leave it empty
          ip_address: null
        });
        
      if (error) {
        console.error('Error logging activity:', error);
        toast.error('Falha ao registrar atividade no sistema');
      }
    } catch (error) {
      console.error('Exception logging activity:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Log an access attempt to a protected resource
   */
  const logAccessAttempt = useCallback((
    resource: string,
    success: boolean
  ) => {
    logActivity(
      `Tentativa de acesso a ${resource}`,
      'resource',
      resource,
      success,
      { resourcePath: resource }
    );
  }, [logActivity]);

  /**
   * Log a login event
   */
  const logLogin = useCallback((
    success: boolean,
    email?: string
  ) => {
    logActivity(
      success ? 'Login bem-sucedido' : 'Falha no login',
      'auth',
      undefined,
      success,
      { email }
    );
  }, [logActivity]);

  /**
   * Log a logout event
   */
  const logLogout = useCallback(() => {
    logActivity('Logout', 'auth');
  }, [logActivity]);

  /**
   * Log profile update events
   */
  const logProfileUpdate = useCallback((
    success: boolean,
    fields?: string[]
  ) => {
    logActivity(
      success ? 'Perfil atualizado' : 'Falha ao atualizar perfil',
      'profile',
      user?.id,
      success,
      fields ? { updated_fields: fields } : undefined
    );
  }, [logActivity, user]);

  /**
   * Log community post activity
   */
  const logPostActivity = useCallback((
    action: 'criar' | 'editar' | 'excluir' | 'curtir' | 'comentar',
    postId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      criar: 'Post criado',
      editar: 'Post editado',
      excluir: 'Post excluído',
      curtir: 'Post curtido',
      comentar: 'Comentário adicionado ao post'
    };
    
    logActivity(actionMap[action], 'post', postId, success, details);
  }, [logActivity]);

  /**
   * Log product/store activity
   */
  const logProductActivity = useCallback((
    action: 'visualizar' | 'adicionar' | 'remover' | 'comprar',
    productId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      visualizar: 'Produto visualizado',
      adicionar: 'Produto adicionado ao carrinho',
      remover: 'Produto removido do carrinho',
      comprar: 'Produto comprado'
    };
    
    logActivity(actionMap[action], 'product', productId, success, details);
  }, [logActivity]);

  /**
   * Log booking activity
   */
  const logBookingActivity = useCallback((
    action: 'criar' | 'editar' | 'cancelar' | 'confirmar',
    bookingId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      criar: 'Reserva criada',
      editar: 'Reserva editada',
      cancelar: 'Reserva cancelada',
      confirmar: 'Reserva confirmada'
    };
    
    logActivity(actionMap[action], 'booking', bookingId, success, details);
  }, [logActivity]);

  /**
   * Log note activity
   */
  const logNoteActivity = useCallback((
    action: 'criar' | 'editar' | 'excluir' | 'arquivar' | 'restaurar',
    noteId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      criar: 'Nota criada',
      editar: 'Nota editada',
      excluir: 'Nota excluída',
      arquivar: 'Nota arquivada',
      restaurar: 'Nota restaurada'
    };
    
    logActivity(actionMap[action], 'note', noteId, success, details);
  }, [logActivity]);

  /**
   * Log JestCoin transaction activity
   */
  const logJestCoinActivity = useCallback((
    action: 'enviar' | 'receber' | 'comprar' | 'vender' | 'resgatar',
    transactionId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      enviar: 'JestCoin enviado',
      receber: 'JestCoin recebido',
      comprar: 'JestCoin comprado',
      vender: 'JestCoin vendido',
      resgatar: 'Recompensa resgatada'
    };
    
    logActivity(actionMap[action], 'jestcoin', transactionId, success, details);
  }, [logActivity]);

  /**
   * Log NFT activity
   */
  const logNftActivity = useCallback((
    action: 'criar' | 'comprar' | 'vender' | 'transferir' | 'visualizar',
    nftId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      criar: 'NFT criado',
      comprar: 'NFT comprado',
      vender: 'NFT vendido',
      transferir: 'NFT transferido',
      visualizar: 'NFT visualizado'
    };
    
    logActivity(actionMap[action], 'nft', nftId, success, details);
  }, [logActivity]);

  /**
   * Log demo submission activity
   */
  const logDemoActivity = useCallback((
    action: 'enviar' | 'avaliar' | 'aprovar' | 'rejeitar',
    demoId: string,
    success: boolean,
    details?: Record<string, any>
  ) => {
    const actionMap = {
      enviar: 'Demo enviada',
      avaliar: 'Demo avaliada',
      aprovar: 'Demo aprovada',
      rejeitar: 'Demo rejeitada'
    };
    
    logActivity(actionMap[action], 'demo', demoId, success, details);
  }, [logActivity]);

  return {
    loading,
    logActivity,
    logAccessAttempt,
    logLogin,
    logLogout,
    logProfileUpdate,
    logPostActivity,
    logProductActivity,
    logBookingActivity,
    logNoteActivity,
    logJestCoinActivity,
    logNftActivity,
    logDemoActivity
  };
};

// Version for non-authenticated contexts
export const useSystemLogger = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Log system-level events that don't require a user context
   */
  const logSystemEvent = useCallback(async (
    level: 'info' | 'warning' | 'error' | 'debug',
    module: string,
    message: string,
    details?: Record<string, any>
  ) => {
    setLoading(true);
    try {
      // Development logging
      console[level](`[${module}] ${message}`, details);
      
      // Insert to Supabase
      const { error } = await supabase
        .from('system_logs')
        .insert({
          level,
          message,
          metadata: details || {},
          created_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error logging system event:', error);
      }
    } catch (error) {
      console.error('Exception logging system event:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    logSystemEvent
  };
};
