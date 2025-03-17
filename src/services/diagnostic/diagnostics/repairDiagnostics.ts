
import { toast } from 'sonner';
import { ProfileStatus, createMissingProfile, repairIncompleteProfile, repairCorruptProfile, checkProfileStatus } from '../profileRepair';

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
