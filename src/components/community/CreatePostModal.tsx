
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/auth';
import { createPost } from '../../services/feedService';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (!currentUser) {
      toast.error('Você precisa estar logado para criar um post');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await createPost({
        title,
        content,
        category: 'geral',
        user_id: currentUser.id,
      });
      
      if (result) {
        onPostCreated();
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast.error('Ocorreu um erro ao criar o post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="neo-blur w-full max-w-md rounded-xl overflow-hidden border border-white/10 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Criar Novo Post</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Título
            </label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-black/40 border-gray-700 text-white"
              placeholder="Digite um título para o seu post"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
              Conteúdo
            </label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-black/40 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Compartilhe seus pensamentos..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              {isSubmitting ? 'Enviando...' : 'Publicar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
