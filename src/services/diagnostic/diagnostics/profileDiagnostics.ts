
import { checkProfileStatus } from '../profileRepair';

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
