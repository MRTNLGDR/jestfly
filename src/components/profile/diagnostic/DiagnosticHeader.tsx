
import React from 'react';
import { Shield, Wrench } from 'lucide-react';

const DiagnosticHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-900/50 border border-purple-500/40">
        <Shield className="h-4 w-4 text-purple-400" />
      </div>
      <div>
        <h3 className="text-white text-lg font-semibold">Diagnóstico e Reparação de Perfil</h3>
        <p className="text-white/60 text-xs">Ferramenta automática para resolver problemas</p>
      </div>
    </div>
  );
};

export default DiagnosticHeader;
