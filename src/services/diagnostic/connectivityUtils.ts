
import { supabase } from '../../integrations/supabase/client';
import { ConnectivityTestResult } from './types';

/**
 * Testa a conectividade básica com o Supabase
 */
export const testSupabaseConnectivity = async (): Promise<ConnectivityTestResult> => {
  try {
    const start = Date.now();
    // Use a simpler query that's less likely to hit RLS issues
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
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
 * Verifica especificamente erros de recursão em políticas
 */
export const checkPolicyRecursion = async (): Promise<{hasRecursion: boolean, details: string | null}> => {
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error && error.message && error.message.includes('infinite recursion')) {
      return {
        hasRecursion: true,
        details: error.message
      };
    }
    
    return {
      hasRecursion: false,
      details: null
    };
  } catch (err: any) {
    // Check if the error message contains recursion information
    if (err.message && err.message.includes('infinite recursion')) {
      return {
        hasRecursion: true,
        details: err.message
      };
    }
    
    return {
      hasRecursion: false,
      details: String(err)
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
