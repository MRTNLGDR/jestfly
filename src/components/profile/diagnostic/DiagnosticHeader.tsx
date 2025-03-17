
import React from 'react';
import { Shield } from 'lucide-react';

const DiagnosticHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Shield className="h-5 w-5 text-purple-400" />
      <h3 className="text-white text-lg font-semibold">Diagnóstico e Reparação de Perfil</h3>
    </div>
  );
};

export default DiagnosticHeader;
