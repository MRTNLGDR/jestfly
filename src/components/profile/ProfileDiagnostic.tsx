
import React, { useState } from 'react';
import { 
  runAuthDiagnostics, 
  attemptProfileFix, 
  forceCreateProfile 
} from '../../services/diagnostic';
import { useAuth } from '../../contexts/auth';
import { toast } from 'sonner';
import {
  DiagnosticHeader,
  DiagnosticDescription,
  DiagnosticButtons,
  DiagnosticResults
} from './diagnostic';

interface ProfileDiagnosticProps {
  userId?: string;
  onRefresh?: () => void;
}

const ProfileDiagnostic: React.FC<ProfileDiagnosticProps> = ({ userId, onRefresh }) => {
  const { currentUser, refreshUserData } = useAuth();
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isForceCreating, setIsForceCreating] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, any> | null>(null);

  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const results = await runAuthDiagnostics(userId || currentUser?.id);
      setDiagnosticResults(results);
      
      if (results.success) {
        if (results.user_data) {
          toast.success("Diagnóstico concluído: Perfil encontrado no banco de dados");
        } else {
          toast.warning("Diagnóstico concluído: Perfil não encontrado no banco de dados");
        }
      } else {
        toast.error("Falha no diagnóstico: " + results.error);
      }
    } catch (error: any) {
      toast.error("Erro ao executar diagnóstico: " + error.message);
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  const handleAttemptFix = async () => {
    setIsFixing(true);
    try {
      const success = await attemptProfileFix();
      
      if (success) {
        if (refreshUserData) {
          await refreshUserData();
        }
        
        if (onRefresh) {
          onRefresh();
        }
        
        toast.success("Correção aplicada com sucesso! Recarregando dados do perfil...");
      } else {
        toast.error("A correção automática não foi bem-sucedida. Tente a criação forçada de perfil.");
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
      const success = await forceCreateProfile(currentUser);
      
      if (success) {
        if (refreshUserData) {
          await refreshUserData();
        }
        
        if (onRefresh) {
          onRefresh();
        }
        
        toast.success("Perfil criado com sucesso! Recarregando dados...");
      } else {
        toast.error("Falha ao criar perfil. Por favor, entre em contato com o suporte.");
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
        await refreshUserData();
        onRefresh();
        toast.success("Perfil atualizado!");
      } catch (error: any) {
        toast.error("Erro ao atualizar perfil: " + error.message);
      }
    }
  };

  return (
    <div className="neo-blur rounded-xl border border-white/10 p-6 my-4 space-y-4">
      <DiagnosticHeader />
      
      <div className="space-y-2">
        <DiagnosticDescription />
        
        <DiagnosticButtons 
          isRunningDiagnostic={isRunningDiagnostic}
          isFixing={isFixing}
          isForceCreating={isForceCreating}
          onRunDiagnostic={handleRunDiagnostic}
          onAttemptFix={handleAttemptFix}
          onForceCreateProfile={handleForceCreateProfile}
          onRefreshProfile={refreshProfile}
          onReloadPage={() => window.location.reload()}
        />
        
        <DiagnosticResults diagnosticResults={diagnosticResults} />
      </div>
    </div>
  );
};

export default ProfileDiagnostic;
