
import React from 'react';
import { Button } from "../../ui/button";
import { LoadingSpinner } from '../../ui/loading-spinner';
import { 
  Bug, 
  AlertTriangle, 
  Wrench, 
  RefreshCw, 
  RotateCw 
} from 'lucide-react';

interface DiagnosticButtonsProps {
  isRunningDiagnostic: boolean;
  isFixing: boolean;
  isForceCreating: boolean;
  onRunDiagnostic: () => Promise<void>;
  onAttemptFix: () => Promise<void>;
  onForceCreateProfile: () => Promise<void>;
  onRefreshProfile: () => Promise<void>;
  onReloadPage: () => void;
}

const DiagnosticButtons: React.FC<DiagnosticButtonsProps> = ({
  isRunningDiagnostic,
  isFixing,
  isForceCreating,
  onRunDiagnostic,
  onAttemptFix,
  onForceCreateProfile,
  onRefreshProfile,
  onReloadPage
}) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRunDiagnostic}
        disabled={isRunningDiagnostic}
        className="flex items-center gap-2 bg-yellow-900/20 border-yellow-700/50 hover:bg-yellow-900/40"
      >
        {isRunningDiagnostic ? <LoadingSpinner size="sm" /> : <Bug className="h-4 w-4" />}
        Executar Diagnóstico
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onAttemptFix}
        disabled={isFixing}
        className="flex items-center gap-2 bg-purple-900/20 border-purple-700/50 hover:bg-purple-900/40"
      >
        {isFixing ? <LoadingSpinner size="sm" /> : <AlertTriangle className="h-4 w-4" />}
        Tentar Correção
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onForceCreateProfile}
        disabled={isForceCreating}
        className="flex items-center gap-2 bg-red-900/20 border-red-700/50 hover:bg-red-900/40"
      >
        {isForceCreating ? <LoadingSpinner size="sm" /> : <Wrench className="h-4 w-4" />}
        Forçar Criação de Perfil
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={onRefreshProfile}
        className="flex items-center gap-2 bg-blue-900/20 border-blue-700/50 hover:bg-blue-900/40"
      >
        <RefreshCw className="h-4 w-4" />
        Recarregar Perfil
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onReloadPage}
        className="flex items-center gap-2 bg-green-900/20 border-green-700/50 hover:bg-green-900/40"
      >
        <RotateCw className="h-4 w-4" />
        Recarregar Página
      </Button>
    </div>
  );
};

export default DiagnosticButtons;
