
import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { extractLinks } from '../../utils/noteUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { toast } from 'sonner';
import { Note } from '../../models/Note';
import { MarkdownRenderer } from './MarkdownRenderer';
import { EditorToolbar } from './EditorToolbar';
import { EditorHeader } from './EditorHeader';

interface NoteEditorProps {
  initialNote?: Note;
  onSave: (note: Partial<Note>) => Promise<void>;
  onLinkClick?: (noteId: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  initialNote, 
  onSave,
  onLinkClick
}) => {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isSaving, setIsSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  const debouncedContent = useDebounce(content, 1500);
  
  // Auto-save quando o conteúdo muda
  useEffect(() => {
    if (autoSaveEnabled && initialNote && debouncedContent !== initialNote.content) {
      handleSave(true);
    }
  }, [debouncedContent]);
  
  const handleSave = useCallback(async (isAutoSave = false) => {
    if (!title.trim()) {
      if (!isAutoSave) {
        toast.error('Por favor, adicione um título para a nota');
      }
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Extrai links de saída do conteúdo
      const outgoingLinks = extractLinks(content);
      
      await onSave({
        id: initialNote?.id,
        title,
        content,
        links: {
          ...initialNote?.links,
          outgoing: outgoingLinks
        },
        updatedAt: new Date()
      });
      
      if (!isAutoSave) {
        toast.success('Nota salva com sucesso');
      }
    } catch (error) {
      console.error('Falha ao salvar nota:', error);
      toast.error('Falha ao salvar nota');
    } finally {
      setIsSaving(false);
    }
  }, [title, content, initialNote, onSave]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Salvar com Ctrl+S ou Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };
  
  const handleToolClick = (textToInsert: string) => {
    setContent(c => `${c}${textToInsert}`);
  };
  
  const toggleAutoSave = () => {
    setAutoSaveEnabled(!autoSaveEnabled);
  };
  
  return (
    <Card className="flex flex-col h-full bg-zinc-900/50 border-zinc-800">
      <EditorHeader 
        title={title}
        onTitleChange={setTitle}
        autoSaveEnabled={autoSaveEnabled}
        toggleAutoSave={toggleAutoSave}
        onSave={() => handleSave()}
        isSaving={isSaving}
      />
      
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col">
        <div className="border-b border-zinc-800 px-4">
          <TabsList className="bg-zinc-800/50">
            <TabsTrigger value="edit">Editar</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="flex-1 p-0 overflow-auto">
          <EditorToolbar onToolClick={handleToolClick} />
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escreva sua nota em markdown..."
            className="w-full h-full p-4 bg-transparent text-white resize-none outline-none font-mono text-sm"
            style={{ minHeight: '50vh' }}
          />
        </TabsContent>
        
        <TabsContent value="preview" className="flex-1 p-4 overflow-auto">
          <MarkdownRenderer content={content} onLinkClick={onLinkClick} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
