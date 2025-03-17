
export * from './connectivityUtils';
export type { DiagnosticResult, ConnectivityTestResult, ProfileFixResult, PolicyCheckResult } from './types';

// Exportando todas as funções do profileRepair
export {
  checkProfileStatus,
  ProfileStatus,
  createMissingProfile,
  repairIncompleteProfile,
  repairCorruptProfile,
  checkUserExists,
  checkUserData
} from './profileRepair';

export type { ProfileCheckResult } from './profileRepair';

// Exportando funções do runDiagnostics
export {
  runAuthDiagnostics,
  runProfileDiagnostics,
  runConnectionDiagnostics,
  diagnoseAndRepairProfile
} from './runDiagnostics';

// Funções auxiliares adicionais para uso direto em componentes
export const attemptProfileFix = async (userId?: string) => {
  const { currentUser } = await import('../../contexts/auth').then(m => m.useAuth());
  const targetId = userId || currentUser?.id;
  
  if (!targetId) {
    return {
      success: false,
      message: "ID de usuário não disponível para reparo"
    };
  }
  
  try {
    const { diagnoseAndRepairProfile } = await import('./runDiagnostics');
    return await diagnoseAndRepairProfile(targetId);
  } catch (error) {
    console.error("Erro ao tentar corrigir perfil:", error);
    return {
      success: false,
      message: `Erro ao tentar corrigir perfil: ${String(error)}`
    };
  }
};

export const forceCreateProfile = async (user: any) => {
  if (!user || !user.id) {
    return {
      success: false,
      message: "Dados de usuário inválidos para criar perfil"
    };
  }
  
  try {
    const { createMissingProfile } = await import('./profileRepair');
    const created = await createMissingProfile(user.id);
    return {
      success: created,
      message: created ? "Perfil criado com sucesso" : "Falha ao criar perfil"
    };
  } catch (error) {
    console.error("Erro ao criar perfil forçadamente:", error);
    return {
      success: false,
      message: `Erro ao criar perfil: ${String(error)}`
    };
  }
};
