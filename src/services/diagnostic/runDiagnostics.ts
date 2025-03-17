
import { supabase } from '../../integrations/supabase/client';
import { testSupabaseConnectivity, logDiagnosticInfo, checkPolicyRecursion } from './connectivityUtils';
import { DiagnosticResult } from './types';
import { User } from '@supabase/supabase-js';
import { checkProfileStatus, createMissingProfile, repairIncompleteProfile, repairCorruptProfile, ProfileStatus } from './profileRepair';
import { toast } from 'sonner';

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

/**
 * Executa diagnósticos especificamente no perfil do usuário
 */
export const runProfileDiagnostics = async (userId: string) => {
  try {
    const profileCheck = await checkProfileStatus(userId);
    
    return {
      success: true,
      profile_status: profileCheck.status,
      missing_fields: profileCheck.missingFields || [],
      corrupt_fields: profileCheck.corruptFields || [],
      can_repair: profileCheck.canRepair,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Executa diagnósticos de conectividade
 */
export const runConnectionDiagnostics = async () => {
  try {
    const connectivity = await testSupabaseConnectivity();
    const policyCheck = await checkPolicyRecursion();
    
    return {
      success: true,
      connectivity,
      policy_recursion_detected: policyCheck.hasRecursion,
      policy_details: policyCheck.details,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      error: String(error),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Função completa para diagnóstico e reparo automático de perfil
 */
export const diagnoseAndRepairProfile = async (userId: string) => {
  try {
    console.log("Iniciando diagnóstico e reparo para usuário:", userId);
    
    // Verificar status atual do perfil
    const profileStatus = await checkProfileStatus(userId);
    console.log("Status do perfil:", profileStatus);
    
    // Se o perfil estiver OK, retornar sem fazer nada
    if (profileStatus.status === ProfileStatus.OK) {
      return {
        success: true,
        message: "Perfil está em bom estado, não são necessários reparos",
        action_taken: "none"
      };
    }
    
    // Se o perfil estiver ausente, criar um novo
    if (profileStatus.status === ProfileStatus.MISSING) {
      const created = await createMissingProfile(userId);
      if (!created) {
        return {
          success: false,
          message: "Falha ao criar perfil ausente",
          action_taken: "create_attempted"
        };
      }
      
      return {
        success: true,
        message: "Perfil criado com sucesso",
        action_taken: "created"
      };
    }
    
    // Se o perfil estiver incompleto, reparar os campos ausentes
    if (profileStatus.status === ProfileStatus.INCOMPLETE && profileStatus.missingFields) {
      const repaired = await repairIncompleteProfile(userId, profileStatus.missingFields);
      if (!repaired) {
        return {
          success: false,
          message: "Falha ao reparar perfil incompleto",
          action_taken: "repair_incomplete_attempted",
          fields: profileStatus.missingFields
        };
      }
      
      return {
        success: true,
        message: "Perfil incompleto reparado com sucesso",
        action_taken: "repaired_incomplete",
        fields: profileStatus.missingFields
      };
    }
    
    // Se o perfil estiver corrompido, reparar os campos corrompidos
    if (profileStatus.status === ProfileStatus.CORRUPT && profileStatus.corruptFields) {
      const repaired = await repairCorruptProfile(userId, profileStatus.corruptFields);
      if (!repaired) {
        return {
          success: false,
          message: "Falha ao reparar perfil corrompido",
          action_taken: "repair_corrupt_attempted",
          fields: profileStatus.corruptFields
        };
      }
      
      return {
        success: true,
        message: "Perfil corrompido reparado com sucesso",
        action_taken: "repaired_corrupt",
        fields: profileStatus.corruptFields
      };
    }
    
    // Status desconhecido ou não reparável
    return {
      success: false,
      message: `Perfil em estado não reparável: ${profileStatus.status}`,
      action_taken: "none"
    };
  } catch (error) {
    console.error("Erro ao diagnosticar e reparar perfil:", error);
    return {
      success: false,
      message: `Erro ao diagnosticar e reparar perfil: ${String(error)}`,
      action_taken: "none",
      error: String(error)
    };
  }
};
