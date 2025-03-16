
import React, { useState } from 'react';
import { Button } from "../../ui/button";

interface DiagnosticResultsProps {
  diagnosticResults: Record<string, any> | null;
}

const DiagnosticResults: React.FC<DiagnosticResultsProps> = ({ diagnosticResults }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  if (!diagnosticResults) return null;

  return (
    <div className="mt-4 p-3 rounded-md bg-gray-800/50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white">Resultados do Diagnóstico:</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="text-xs h-6 px-2"
        >
          {showTechnicalDetails ? "Ocultar detalhes" : "Mostrar detalhes técnicos"}
        </Button>
      </div>
      
      {!showTechnicalDetails ? (
        <div className="text-sm text-white/80">
          <p>Status: {diagnosticResults.success ? "Sucesso" : "Falha"}</p>
          <p>Conexão com banco de dados: {diagnosticResults.connectivity?.success ? "OK" : "Falha"}</p>
          <p>Perfil encontrado: {diagnosticResults.user_data ? "Sim" : "Não"}</p>
          {diagnosticResults.errors && Object.values(diagnosticResults.errors).some(e => e) && (
            <p className="text-red-400">Erros detectados. Veja os detalhes técnicos para mais informações.</p>
          )}
        </div>
      ) : (
        <pre className="text-xs overflow-auto max-h-40 text-green-400 whitespace-pre-wrap">
          {JSON.stringify(diagnosticResults, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DiagnosticResults;
