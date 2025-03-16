
import { supabase } from '../../../integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Logs diagnostic information to Supabase for auth-related issues
 */
export const logAuthDiagnostic = async (
  message: string, 
  metadata: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('diagnostic_logs')
      .insert({
        message,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          client_info: {
            user_agent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform
          }
        }
      });
    
    if (error) {
      console.error("Failed to log diagnostic:", error);
      
      // Em caso de erro de permissão, tente sem RLS usando uma função RPC
      if (error.message.includes('policy') || error.message.includes('permission')) {
        try {
          await supabase.rpc('log_auth_diagnostic', {
            message,
            metadata: {
              ...metadata,
              timestamp: new Date().toISOString()
            }
          });
        } catch (rpcError) {
          console.error("Failed to log diagnostic via RPC:", rpcError);
        }
      }
    }
  } catch (logError) {
    console.error("Exception logging diagnostic:", logError);
  }
};
