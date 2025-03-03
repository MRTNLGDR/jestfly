
import React from 'react';
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";

interface EmptyNoteStateProps {
  onCreateNote: () => void;
}

export const EmptyNoteState: React.FC<EmptyNoteStateProps> = ({ onCreateNote }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-zinc-900/50 rounded-md border border-zinc-800 text-zinc-400">
      <p>Selecione uma nota ou crie uma nova</p>
      <Button 
        onClick={onCreateNote} 
        variant="outline" 
        className="mt-4"
      >
        <PlusIcon size={16} className="mr-1" />
        Criar Nota
      </Button>
    </div>
  );
};
