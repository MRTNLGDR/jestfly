
import { supabase } from '../../../integrations/supabase/client';

/**
 * Logs diagnostic information to Supabase for auth-related issues
 */
export const logAuthDiagnostic = async (
  message: string, 
  metadata: Record<string, any>
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('log_auth_diagnostic', {
      message,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });
    
    if (error) {
      console.error("Failed to log diagnostic:", error);
    }
  } catch (logError) {
    console.error("Exception logging diagnostic:", logError);
  }
};
