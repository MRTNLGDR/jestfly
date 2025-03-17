
import { useState } from 'react';
import { 
  runAuthDiagnostics, 
  attemptProfileFix, 
  forceCreateProfile,
  diagnoseAndRepairProfile
} from '../../../services/diagnostic';
import { useAuth } from '../../../contexts/auth';
import { toast } from 'sonner';

interface DiagnosticControllerProps {
  userId?: string;
  onRefresh?: () => void;
}

// Changed to a custom hook with "use" prefix
const useDiagnosticController = ({ userId, onRefresh }: DiagnosticControllerProps) => {
  const { currentUser, refreshUserData } = useAuth();
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isForceCreating, setIsForceCreating] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, any> | null>(null);
  const [autoFixAttempted, setAutoFixAttempted] = useState(false);

  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      toast.info("Executando diagnóstico do perfil...");
      const results = await runAuthDiagnostics(userId || currentUser?.id);
      setDiagnosticResults(results);
      
      if (results.success) {
        if (results.user_data) {
          toast.success("Diagnóstico concluído: Perfil encontrado no banco de dados");
          
          // Se encontramos o usuário mas há erro de recursão, tente corrigir automaticamente
          if (results.policy_recursion_detected) {
            toast.warning("Detectado problema de políticas de acesso. Tentando corrigir automaticamente...");
            await handleAttemptFix();
          }
        } else {
          toast.warning("Diagnóstico concluído: Perfil não encontrado no banco de dados");
          
          // Se o usuário está logado mas não tem perfil, sugira criação automática
          if (currentUser && !autoFixAttempted) {
            toast.info("Tentando criar perfil automaticamente...");
            setAutoFixAttempted(true);
            await handleForceCreateProfile();
          }
        }
      } else {
        // Tentar diagnóstico e reparo completo
        toast.warning("Falha no diagnóstico básico. Tentando diagnóstico avançado e reparo...");
        await handleFullDiagnostic();
      }
    } catch (error: any) {
      toast.error("Erro ao executar diagnóstico: " + error.message);
      
      // Mesmo em caso de erro, tentar reparo automático
      if (!autoFixAttempted && currentUser) {
        toast.info("Tentando reparo de emergência...");
        setAutoFixAttempted(true);
        await handleAttemptFix();
      }
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const handleFullDiagnostic = async () => {
    try {
      toast.info("Executando diagnóstico e reparo completo...");
      
      const targetId = userId || currentUser?.id;
      if (!targetId) {
        toast.error("ID de usuário não disponível para diagnóstico completo");
        return;
      }
      
      const result = await diagnoseAndRepairProfile(targetId);
      
      if (result.success) {
        toast.success("Reparo completo realizado com sucesso!");
        
        if (refreshUserData) {
          await refreshUserData();
        }
        
        if (onRefresh) {
          onRefresh();
        }
      } else {
        toast.error("Diagnóstico completo falhou: " + result.message);
      }
    } catch (error: any) {
      toast.error("Erro no diagnóstico completo: " + error.message);
    }
  };

  const handleAttemptFix = async () => {
    setIsFixing(true);
    try {
      toast.info("Tentando corrigir o perfil automaticamente...");
      const result = await attemptProfileFix();
      
      if (result.success) {
        if (refreshUserData) {
          await refreshUserData();
        }
        
        if (onRefresh) {
          onRefresh();
        }
        
        toast.success("Correção aplicada com sucesso! Recarregando dados do perfil...");
      } else {
        toast.error("A correção automática não foi bem-sucedida. Tente a criação forçada de perfil.");
        // Tentar criação forçada automaticamente
        await handleForceCreateProfile();
      }
    } catch (error: any) {
      toast.error("Erro ao tentar correção: " + error.message);
    } finally {
      setIsFixing(false);
    }
  };

  const handleForceCreateProfile = async () => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para usar esta função");
      return;
    }
    
    setIsForceCreating(true);
    try {
      toast.info("Criando novo perfil...");
      const result = await forceCreateProfile(currentUser);
      
      if (result.success) {
        if (refreshUserData) {
          await refreshUserData();
        }
        
        if (onRefresh) {
          onRefresh();
        }
        
        toast.success("Perfil criado com sucesso! Recarregando dados...");
      } else {
        toast.error("Falha ao criar perfil: " + result.message);
      }
    } catch (error: any) {
      toast.error("Erro ao criar perfil: " + error.message);
    } finally {
      setIsForceCreating(false);
    }
  };

  const refreshProfile = async () => {
    if (refreshUserData && onRefresh) {
      try {
        toast.info("Atualizando dados do perfil...");
        await refreshUserData();
        onRefresh();
        toast.success("Perfil atualizado!");
      } catch (error: any) {
        toast.error("Erro ao atualizar perfil: " + error.message);
      }
    }
  };

  return {
    isRunningDiagnostic,
    isFixing,
    isForceCreating,
    diagnosticResults,
    handleRunDiagnostic,
    handleAttemptFix,
    handleForceCreateProfile,
    refreshProfile,
    reloadPage: () => window.location.reload()
  };
};

export default useDiagnosticController;
