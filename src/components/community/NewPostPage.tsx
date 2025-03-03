import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunityPosts } from '@/hooks/useCommunity';
import { PostCategory } from '@/types/community';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('discussion');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { createPost } = useCommunityPosts();
  
  const { user } = useAuth();
  
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para criar um post");
      return;
    }
    
    // Verifica se os campos obrigatórios estão preenchidos
    if (!title.trim() || !content.trim()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setSubmitting(true);
    
    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
        user_id: user.id
      });
      
      // Limpa o formulário após o envio
      setTitle("");
      setContent("");
      setSelectedCategory("discussion" as PostCategory);
      
      // Navega para a página principal da comunidade
      navigate('/community');
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto mt-8 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Criar Novo Post</h1>
      <form onSubmit={handleSubmitPost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-white text-sm font-bold mb-2">
            Título:
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white/5 border-white/10 text-white placeholder:text-white/50"
            placeholder="Título do Post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-white text-sm font-bold mb-2">
            Conteúdo:
          </label>
          <textarea
            id="content"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white/5 border-white/10 text-white placeholder:text-white/50"
            placeholder="Conteúdo do Post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-white text-sm font-bold mb-2">
            Categoria:
          </label>
          <select
            id="category"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white/5 border-white/10 text-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as PostCategory)}
          >
            <option value="announcement">Anúncio</option>
            <option value="event">Evento</option>
            <option value="discussion">Discussão</option>
            <option value="collaboration">Colaboração</option>
            <option value="question">Questão</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Enviando...' : 'Criar Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostPage;
