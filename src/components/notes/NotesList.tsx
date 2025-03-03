
import React from 'react';
import { Note } from '../../models/Note';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PinIcon, SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';

interface NotesListProps {
  notes: Note[];
  selectedNoteId?: string;
  onNoteSelect: (noteId: string) => void;
  isLoading: boolean;
  view?: 'list' | 'graph';
}

export const NotesList: React.FC<NotesListProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  isLoading,
  view = 'list'
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredNotes = React.useMemo(() => {
    if (!searchTerm.trim()) return notes;
    
    const lowerSearch = searchTerm.toLowerCase();
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerSearch) || 
      note.content.toLowerCase().includes(lowerSearch) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
    );
  }, [notes, searchTerm]);
  
  // Organiza as notas: primeiro as fixadas, depois por data de atualização
  const sortedNotes = React.useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Após ordenar por fixação, ordenar por data de atualização (mais recente primeiro)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filteredNotes]);
  
  const formatDate = (date: Date) => {
    try {
      // Se a data for um objeto Date, formatar
      if (date instanceof Date) {
        return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
      }
      // Se a data for uma string ou timestamp, converter para Date e formatar
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-zinc-900/50 border border-zinc-800 rounded-md overflow-hidden">
      <div className="p-3 border-b border-zinc-800">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
          <Input
            type="text"
            placeholder="Pesquisar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-zinc-800/50 border-zinc-700 pl-8 text-white placeholder:text-zinc-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="text-center p-4 text-zinc-500">
            {searchTerm ? 'Nenhuma nota encontrada' : 'Nenhuma nota criada ainda'}
          </div>
        ) : (
          <div className="divide-y divide-zinc-800">
            {sortedNotes.map(note => (
              <div
                key={note.id}
                className={`p-3 cursor-pointer hover:bg-zinc-800/50 transition-colors ${
                  selectedNoteId === note.id ? 'bg-zinc-800/80' : ''
                }`}
                onClick={() => onNoteSelect(note.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      {note.isPinned && (
                        <PinIcon className="h-3 w-3 text-yellow-500" />
                      )}
                      <h3 className="font-medium text-white truncate">{note.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{note.content}</p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 whitespace-nowrap pl-2">
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
