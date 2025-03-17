
import { supabase } from '../../../integrations/supabase/client';
import { testSupabaseConnectivity, logDiagnosticInfo, checkPolicyRecursion } from '../connectivityUtils';
import { DiagnosticResult } from '../types';

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
    
    // Checar especificamente por erros de recursão em políticas
    const policyCheck = await checkPolicyRecursion();
    if (policyCheck.hasRecursion) {
      console.warn("Detectado erro de recursão infinita nas políticas RLS:", policyCheck.details);
      
      return {
        success: false,
        connectivity: connectivityTest,
        policy_recursion_detected: true,
        error: "Erro de recursão infinita detectado nas políticas RLS. Contate o administrador do sistema.",
        timestamp: new Date().toISOString()
      };
    }
    
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
      policy_recursion_check: policyCheck,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      connectivity: connectivityTest,
      auth_user_exists: authUserExists,
      user_data: userProfile,
      policy_recursion_detected: policyCheck.hasRecursion,
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
