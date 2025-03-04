
import { useState, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useActivityLogger = () => {
  const [logLoading, setLogLoading] = useState(false);

  const logActivity = useCallback(async (
    userId: string | undefined, 
    action: string, 
    details?: Record<string, any>
  ) => {
    if (!userId) return;
    
    try {
      setLogLoading(true);
      
      const { error } = await supabase
        .from('user_activity_logs')
        .insert({
          user_id: userId,
          action,
          details,
          ip_address: 'client', // O IP real será capturado pelo RLS no Supabase
          user_agent: navigator.userAgent
        });
      
      if (error) {
        console.error('Error logging activity:', error);
      }
    } catch (err) {
      console.error('Failed to log activity:', err);
    } finally {
      setLogLoading(false);
    }
  }, []);

  return { logActivity, logLoading };
};

export default useActivityLogger;
