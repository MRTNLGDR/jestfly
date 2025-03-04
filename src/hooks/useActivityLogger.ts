
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

  // Fix the logSystemActivity function to use the correct structure for system_logs
  const logSystemActivity = useCallback(async (
    action: string,
    details?: Record<string, any>,
    success: boolean = true
  ) => {
    try {
      setLogLoading(true);
      
      const { error } = await supabase
        .from('system_logs')
        .insert({
          level: success ? 'info' : 'error',
          message: action,
          metadata: details
        });
      
      if (error) {
        console.error('Error logging system activity:', error);
      }
    } catch (err) {
      console.error('Failed to log system activity:', err);
    } finally {
      setLogLoading(false);
    }
  }, []);

  const logProfileUpdate = useCallback(async (
    userId: string | undefined,
    details?: Record<string, any> | Array<string>
  ) => {
    return logActivity(userId, 'profile_update', 
      Array.isArray(details) 
        ? { updated_fields: details } 
        : details
    );
  }, [logActivity]);

  const logAccessAttempt = useCallback(async (
    userId: string | undefined,
    resource: string,
    success: boolean = true
  ) => {
    return logActivity(userId, 'access_attempt', { resource, success });
  }, [logActivity]);

  return {
    logActivity,
    logSystemActivity,
    logProfileUpdate,
    logAccessAttempt,
    logLoading
  };
};

export default useActivityLogger;
