
import React from 'react';
import { Button } from "../ui/button";

interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  autoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  onSave: () => void;
  isSaving: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ 
  title, 
  onTitleChange,
  autoSaveEnabled,
  toggleAutoSave,
  onSave,
  isSaving
}) => {
  return (
    <div className="p-4 border-b border-zinc-800 flex items-center">
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Título da nota..."
        className="flex-1 text-xl font-medium bg-transparent border-none outline-none text-white placeholder:text-zinc-500"
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={toggleAutoSave}
          className={`text-xs ${
            autoSaveEnabled ? 'bg-green-950/30 text-green-400' : 'bg-zinc-800 text-zinc-400'
          }`}
        >
          {autoSaveEnabled ? 'Auto-save: On' : 'Auto-save: Off'}
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          className="bg-gradient-to-r from-indigo-600 to-violet-600"
        >
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
};
