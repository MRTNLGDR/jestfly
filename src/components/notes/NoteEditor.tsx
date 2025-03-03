
import React, { useState, useRef, useEffect } from 'react';
import { Note } from '../../models/Note';
import { TrashIcon, SaveIcon, TagIcon, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, onDelete }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [links, setLinks] = useState<string[]>(note.links || []);
  const [tagInput, setTagInput] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setLinks(note.links || []);
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('O título da nota é obrigatório');
      return;
    }

    setIsSaving(true);
    try {
      const updatedNote: Note = {
        ...note,
        title,
        content,
        tags,
        links,
        updatedAt: new Date()
      };
      
      await onSave(updatedNote);
      toast.success('Nota salva com sucesso');
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Erro ao salvar nota');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!note.id) return;
    
    if (!window.confirm('Tem certeza que deseja excluir esta nota?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(note.id);
      toast.success('Nota excluída com sucesso');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Erro ao excluir nota');
    } finally {
      setIsDeleting(false);
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addLink = () => {
    if (!linkInput.trim()) return;
    if (!links.includes(linkInput.trim())) {
      setLinks([...links, linkInput.trim()]);
    }
    setLinkInput('');
  };

  const removeLink = (linkToRemove: string) => {
    setLinks(links.filter(link => link !== linkToRemove));
  };

  return (
    <div className="flex flex-col h-full border border-zinc-800 rounded-lg bg-zinc-900/50 overflow-hidden">
      <div className="p-3 border-b border-zinc-800 flex justify-between items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da nota"
          className="bg-transparent border-none outline-none text-lg font-semibold text-white w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="p-2 bg-green-600/20 text-green-500 rounded hover:bg-green-600/30 transition-colors"
          >
            <SaveIcon className="h-4 w-4" />
          </button>
          {note.id && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-red-600/20 text-red-500 rounded hover:bg-red-600/30 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <div className="p-3 border-b border-zinc-800 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-zinc-400 text-xs">
          <TagIcon className="h-3 w-3" />
          <span>Tags:</span>
        </div>
        
        {tags.map(tag => (
          <span 
            key={tag}
            className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs flex items-center gap-1"
          >
            {tag}
            <button 
              onClick={() => removeTag(tag)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              &times;
            </button>
          </span>
        ))}
        
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
            placeholder="Adicionar tag"
            className="bg-zinc-800/50 text-xs border border-zinc-700 rounded-l px-2"
          />
          <button 
            onClick={addTag}
            className="bg-zinc-700 text-zinc-300 px-2 rounded-r text-xs"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="p-3 border-b border-zinc-800 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-zinc-400 text-xs">
          <LinkIcon className="h-3 w-3" />
          <span>Links:</span>
        </div>
        
        {links.map(link => (
          <span 
            key={link}
            className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full text-xs flex items-center gap-1"
          >
            {link}
            <button 
              onClick={() => removeLink(link)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              &times;
            </button>
          </span>
        ))}
        
        <div className="flex">
          <input
            type="text"
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
            placeholder="Adicionar link"
            className="bg-zinc-800/50 text-xs border border-zinc-700 rounded-l px-2"
          />
          <button 
            onClick={addLink}
            className="bg-zinc-700 text-zinc-300 px-2 rounded-r text-xs"
          >
            +
          </button>
        </div>
      </div>
      
      <textarea
        ref={contentRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escreva sua nota aqui..."
        className="flex-1 p-4 bg-transparent border-none outline-none resize-none text-white"
      />
    </div>
  );
};
