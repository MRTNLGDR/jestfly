
import { testSupabaseConnectivity, checkPolicyRecursion } from '../connectivityUtils';

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
