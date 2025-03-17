
import { supabase } from '../../integrations/supabase/client';
import { testSupabaseConnectivity, logDiagnosticInfo } from './connectivityUtils';
import { DiagnosticResult } from './types';

/**
 * Executa diagnósticos de autenticação para resolver problemas
 */
export const runAuthDiagnostics = async (userId?: string): Promise<DiagnosticResult> => {
  try {
    if (!userId) {
      return {
        success: false,
        error: "ID de usuário não fornecido",
        timestamp: new Date().toISOString()
      };
    }

    console.log("Executando diagnóstico para usuário:", userId);
    
    // Verificar conectividade básica com Supabase
    const connectivityTest = await testSupabaseConnectivity();
    
    // Verificar se o usuário existe na auth.users
    let authUserExists = false;
    let userProfile = null;
    let profileError = null;
    
    try {
      // Tentar buscar perfil público
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileErr) {
        console.error("Erro ao buscar perfil durante diagnóstico:", profileErr);
        profileError = profileErr;
      } else if (profile) {
        userProfile = profile;
        authUserExists = true; // Se o perfil existe, assumimos que o auth user também existe
      }
    } catch (err) {
      console.error("Exceção ao buscar perfil durante diagnóstico:", err);
      profileError = err;
    }
    
    // Registrar resultados do diagnóstico
    await logDiagnosticInfo('Diagnóstico de autenticação executado', {
      user_id: userId,
      connectivity: connectivityTest,
      profile_found: !!userProfile,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      connectivity: connectivityTest,
      auth_user_exists: authUserExists,
      user_data: userProfile,
      errors: {
        profile_error: profileError ? String(profileError) : null
      },
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error("Erro durante diagnóstico de autenticação:", err);
    return {
      success: false,
      error: String(err),
      timestamp: new Date().toISOString()
    };
  }
};
