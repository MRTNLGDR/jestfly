import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { extractLinks } from '../../utils/noteUtils';
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { toast } from 'sonner';
import { Note } from '../../models/Note';

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
  
  const renderMarkdownWithClickableLinks = (markdown: string) => {
    // Renderizador customizado para links internos usando o formato [[link]]
    const renderedContent = markdown.replace(
      /\[\[(.*?)\]\]/g,
      (match, linkText) => `<a class="internal-link" data-link="${linkText}">${linkText}</a>`
    );
    
    return (
      <div 
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
        onClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('internal-link')) {
            const linkText = (e.target as HTMLElement).getAttribute('data-link');
            if (linkText && onLinkClick) {
              onLinkClick(linkText);
            }
          }
        }}
      />
    );
  };
  
  return (
    <Card className="flex flex-col h-full bg-zinc-900/50 border-zinc-800">
      <div className="p-4 border-b border-zinc-800 flex items-center">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da nota..."
          className="flex-1 text-xl font-medium bg-transparent border-none outline-none text-white placeholder:text-zinc-500"
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
            className={`text-xs ${
              autoSaveEnabled ? 'bg-green-950/30 text-green-400' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {autoSaveEnabled ? 'Auto-save: On' : 'Auto-save: Off'}
          </Button>
          <Button
            onClick={() => handleSave()}
            disabled={isSaving}
            size="sm"
            className="bg-gradient-to-r from-indigo-600 to-violet-600"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col">
        <div className="border-b border-zinc-800 px-4">
          <TabsList className="bg-zinc-800/50">
            <TabsTrigger value="edit">Editar</TabsTrigger>
            <TabsTrigger value="preview">Visualizar</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="flex-1 p-0 overflow-auto">
          <div className="p-2 border-b border-zinc-800 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}# `)}>H1</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}## `)}>H2</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}**Negrito**`)}>Negrito</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}*Itálico*`)}>Itálico</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}[Link](url)`)}>Link</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}[[`)}>Link Interno</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}![Imagem](url)`)}>Imagem</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}> `)}>Citação</Button>
            <Button size="sm" variant="outline" onClick={() => setContent(c => `${c}\`\`\`\ncodigo\n\`\`\``)}>Código</Button>
          </div>
          
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
          {renderMarkdownWithClickableLinks(content)}
        </TabsContent>
      </Tabs>
    </Card>
  );
};
