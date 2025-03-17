
import React from 'react';
import { AlertCircle, CheckCircle, Settings } from 'lucide-react';

const DiagnosticDescription: React.FC = () => {
  return (
    <div className="mb-4">
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-md p-4 border border-purple-500/20 mb-4">
        <p className="text-white/90 text-sm">
          Esta ferramenta resolve automaticamente problemas comuns com seu perfil:
        </p>
        <ul className="text-white/80 text-sm mt-2 space-y-2">
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
            <span>Erros de "recursão infinita" ou permissões quebradas</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <span>Perfil não encontrado ou não inicializado corretamente</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
            <span>Problemas de sincronização entre autenticação e dados</span>
          </li>
          <li className="flex items-start gap-2">
            <Settings className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <span>Configuração inicial de perfil para novos usuários</span>
          </li>
        </ul>
      </div>
      
      <p className="text-white/70 text-sm">
        Ao clicar em "Executar Diagnóstico", nossa ferramenta vai tentar identificar e corrigir 
        automaticamente os problemas encontrados no seu perfil. O processo é rápido e seguro.
      </p>
    </div>
  );
};

export default DiagnosticDescription;
