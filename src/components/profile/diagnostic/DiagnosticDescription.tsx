
import React from 'react';

const DiagnosticDescription: React.FC = () => {
  return (
    <div className="mb-4">
      <h3 className="text-white text-lg font-semibold mb-2">Ferramenta de Diagnóstico</h3>
      <p className="text-white/80 text-sm">
        Esta ferramenta resolve problemas comuns com seu perfil:
      </p>
      <ul className="text-white/70 text-sm list-disc pl-5 mt-2 space-y-1">
        <li>Perfil não encontrado ou não inicializado</li>
        <li>Erros de permissão ou recursão</li>
        <li>Dados corrompidos ou incompletos</li>
        <li>Problemas de sincronização</li>
      </ul>
    </div>
  );
};

export default DiagnosticDescription;
