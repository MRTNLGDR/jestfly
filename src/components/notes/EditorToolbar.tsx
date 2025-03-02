
import React from 'react';
import { Button } from "../ui/button";

interface EditorToolbarProps {
  onToolClick: (content: string) => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onToolClick }) => {
  return (
    <div className="p-2 border-b border-zinc-800 flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onToolClick('# ')}>H1</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('## ')}>H2</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('**Negrito**')}>Negrito</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('*Itálico*')}>Itálico</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('[Link](url)')}>Link</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('[[')}>Link Interno</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('![Imagem](url)')}>Imagem</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('> ')}>Citação</Button>
      <Button size="sm" variant="outline" onClick={() => onToolClick('```\ncodigo\n```')}>Código</Button>
    </div>
  );
};
