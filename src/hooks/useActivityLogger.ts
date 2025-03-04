
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
          ip_address: 'client', // The real IP will be captured by RLS in Supabase
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

  // Fixed logSystemActivity function to use correct structure for system_logs
  const logSystemActivity = useCallback(async (
    message: string,
    metadata?: Record<string, any>,
    success: boolean = true
  ) => {
    try {
      setLogLoading(true);
      
      const { error } = await supabase
        .from('system_logs')
        .insert({
          level: success ? 'info' : 'error',
          message,
          metadata
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
