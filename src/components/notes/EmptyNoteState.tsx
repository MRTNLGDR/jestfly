
import React from 'react';
import { PlusCircle } from 'lucide-react';

interface EmptyNoteStateProps {
  onCreateNote: () => void;
}

export const EmptyNoteState: React.FC<EmptyNoteStateProps> = ({ onCreateNote }) => {
  return (
    <div className="flex flex-col justify-center items-center h-full py-12 px-6 text-center">
      <div className="bg-zinc-800/50 p-8 rounded-lg max-w-md mx-auto">
        <PlusCircle className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">Nenhuma nota selecionada</h3>
        <p className="text-zinc-400 mb-6">
          Selecione uma nota da lista ou crie uma nova nota para começar a escrever.
        </p>
        <button
          onClick={onCreateNote}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
        >
          Criar Nova Nota
        </button>
      </div>
    </div>
  );
};
