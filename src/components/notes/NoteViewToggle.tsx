
import React from 'react';
import { Button } from "../ui/button";
import { LayoutListIcon, NetworkIcon } from "lucide-react";

interface NoteViewToggleProps {
  view: 'list' | 'graph';
  onViewChange: (view: 'list' | 'graph') => void;
}

export const NoteViewToggle: React.FC<NoteViewToggleProps> = ({
  view,
  onViewChange
}) => {
  return (
    <div className="bg-zinc-800 rounded-md p-1 flex">
      <Button
        size="sm"
        variant={view === 'list' ? 'default' : 'ghost'}
        onClick={() => onViewChange('list')}
        className={view === 'list' ? 'bg-zinc-700' : ''}
      >
        <LayoutListIcon size={18} />
      </Button>
      <Button
        size="sm"
        variant={view === 'graph' ? 'default' : 'ghost'}
        onClick={() => onViewChange('graph')}
        className={view === 'graph' ? 'bg-zinc-700' : ''}
      >
        <NetworkIcon size={18} />
      </Button>
    </div>
  );
};
