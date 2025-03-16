
import React from 'react';
import { Activity } from 'lucide-react';

const DiagnosticHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold text-white flex items-center">
        <Activity className="mr-2 h-5 w-5 text-yellow-400" />
        Diagnóstico de Perfil
      </h3>
    </div>
  );
};

export default DiagnosticHeader;
