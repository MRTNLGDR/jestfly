
import React, { useState } from 'react';
import { Button } from "../ui/button";
import { runAuthDiagnostics, attemptProfileFix } from '../../services/diagnosticService';
import { useAuth } from '../../contexts/auth';
import { toast } from 'sonner';
import { AlertTriangle, RefreshCw, Bug, Activity } from 'lucide-react';
import { LoadingSpinner } from '../ui/loading-spinner';

interface ProfileDiagnosticProps {
  userId?: string;
  onRefresh?: () => void;
}

const ProfileDiagnostic: React.FC<ProfileDiagnosticProps> = ({ userId, onRefresh }) => {
  const { currentUser, refreshUserData } = useAuth();
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<Record<string, any> | null>(null);

  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const results = await runAuthDiagnostics(userId || currentUser?.id);
      setDiagnosticResults(results);
      
      if (results.success) {
        toast.success("Diagnóstico concluído");
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
        toast.error("A correção automática não foi bem-sucedida. Entre em contato com o suporte.");
      }
    } catch (error: any) {
      toast.error("Erro ao tentar correção: " + error.message);
    } finally {
      setIsFixing(false);
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white flex items-center">
          <Activity className="mr-2 h-5 w-5 text-yellow-400" />
          Diagnóstico de Perfil
        </h3>
      </div>
      
      <div className="space-y-2">
        <p className="text-white/70 text-sm">
          Detectamos um problema ao carregar seu perfil. Use as opções abaixo para diagnosticar e corrigir:
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRunDiagnostic}
            disabled={isRunningDiagnostic}
            className="flex items-center gap-2 bg-yellow-900/20 border-yellow-700/50 hover:bg-yellow-900/40"
          >
            {isRunningDiagnostic ? <LoadingSpinner size="sm" /> : <Bug className="h-4 w-4" />}
            Executar Diagnóstico
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAttemptFix}
            disabled={isFixing}
            className="flex items-center gap-2 bg-purple-900/20 border-purple-700/50 hover:bg-purple-900/40"
          >
            {isFixing ? <LoadingSpinner size="sm" /> : <AlertTriangle className="h-4 w-4" />}
            Tentar Correção
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshProfile}
            className="flex items-center gap-2 bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/40"
          >
            <RefreshCw className="h-4 w-4" />
            Recarregar Perfil
          </Button>
        </div>
        
        {diagnosticResults && (
          <div className="mt-4 p-3 rounded-md bg-gray-800/50">
            <h4 className="text-sm font-medium text-white mb-2">Resultados do Diagnóstico:</h4>
            <pre className="text-xs overflow-auto max-h-40 text-green-400 whitespace-pre-wrap">
              {JSON.stringify(diagnosticResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDiagnostic;
