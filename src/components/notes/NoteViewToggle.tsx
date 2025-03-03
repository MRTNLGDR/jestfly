
import React from 'react';
import { LayoutGrid, LineChart } from 'lucide-react';

type ViewType = 'list' | 'graph';

interface NoteViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const NoteViewToggle: React.FC<NoteViewToggleProps> = ({ 
  currentView, 
  onViewChange 
}) => {
  return (
    <div className="bg-zinc-800 rounded-md p-1 flex">
      <button
        onClick={() => onViewChange('list')}
        className={`p-1.5 rounded ${
          currentView === 'list' 
            ? 'bg-purple-600 text-white' 
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        aria-label="Visualização em lista"
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => onViewChange('graph')}
        className={`p-1.5 rounded ${
          currentView === 'graph' 
            ? 'bg-purple-600 text-white' 
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
        aria-label="Visualização em grafo"
      >
        <LineChart size={18} />
      </button>
    </div>
  );
};
