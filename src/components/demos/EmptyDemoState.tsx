
import React from 'react';
import { Clock } from 'lucide-react';

const EmptyDemoState: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-black/30 rounded-lg border border-white/10 p-6">
      <div className="text-center">
        <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-200 mb-2">Selecione uma submissão</h3>
        <p className="text-gray-400">Escolha uma submissão de demo na lista para revisar</p>
      </div>
    </div>
  );
};

export default EmptyDemoState;
