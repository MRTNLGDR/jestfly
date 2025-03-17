
import { supabase } from '../../../integrations/supabase/client';

/**
 * Registra diagnósticos de autenticação para fins de depuração
 */
export const logAuthDiagnostic = async (message: string, metadata: any = {}) => {
  try {
    console.log(`[Auth Diagnostic] ${message}`, metadata);
    
    // Registrar diagnóstico no banco de dados se possível
    const { error } = await supabase.rpc('log_auth_diagnostic', {
      message,
      metadata
    });
    
    if (error) {
      console.error('Erro ao registrar diagnóstico:', error);
    }
    
    return true;
  } catch (err) {
    console.error('Erro ao registrar diagnóstico:', err);
    return false;
  }
};

/**
 * Verifica a conectividade com a autenticação Supabase
 */
export const checkAuthConnectivity = async () => {
  try {
    // Verifica se pode acessar a sessão atual
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return {
        success: false,
        message: 'Erro ao verificar sessão',
        error: sessionError.message
      };
    }
    
    // Verifica se pode acessar o usuário atual
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      return {
        success: false,
        message: 'Erro ao verificar usuário',
        error: userError.message
      };
    }
    
    return {
      success: true,
      message: 'Conectividade com autenticação OK',
      session: sessionData?.session ? true : false,
      user: userData?.user ? true : false
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Exceção ao verificar conectividade com autenticação',
      error: err.message
    };
  }
};
