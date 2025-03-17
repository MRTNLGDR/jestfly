
import { supabase } from '../../integrations/supabase/client';
import { ConnectivityTestResult } from './types';

/**
 * Testa a conectividade básica com o Supabase
 */
export const testSupabaseConnectivity = async (): Promise<ConnectivityTestResult> => {
  try {
    const start = Date.now();
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    const duration = Date.now() - start;
    
    return {
      success: !error,
      error: error ? String(error) : null,
      duration_ms: duration,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Registra informações de diagnóstico no Supabase
 */
export const logDiagnosticInfo = async (message: string, metadata: Record<string, any>): Promise<void> => {
  try {
    await supabase.from('diagnostic_logs').insert({
      message,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString()
      }
    });
  } catch (logErr) {
    console.error("Erro ao registrar diagnóstico:", logErr);
  }
};
