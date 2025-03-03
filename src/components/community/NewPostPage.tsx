
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';
import { mainMenuItems } from '@/constants/menuItems';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PostCategory } from '@/types/community';

const NewPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('discussion');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Título e conteúdo são obrigatórios para criar uma publicação."
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate('/auth');
        return;
      }
      
      const { error } = await supabase
        .from('community_posts')
        .insert({
          title,
          content,
          category,
          user_id: userData.user.id
        });
        
      if (error) throw error;
      
      toast({
        title: "Publicação criada",
        description: "Sua publicação foi criada com sucesso!",
      });
      
      navigate('/community');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar publicação",
        description: "Não foi possível criar sua publicação. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={mainMenuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 text-white/80 hover:text-white"
            onClick={() => navigate('/community')}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Comunidade
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
              Nova Publicação
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-white font-medium">Título</label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título da sua publicação" 
                  className="bg-black/20 border-purple-500/30"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-white font-medium">Categoria</label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as PostCategory)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-black/20 border-purple-500/30 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    <SelectItem value="announcement" className="text-white hover:bg-purple-900/50">Anúncio</SelectItem>
                    <SelectItem value="event" className="text-white hover:bg-purple-900/50">Evento</SelectItem>
                    <SelectItem value="discussion" className="text-white hover:bg-purple-900/50">Discussão</SelectItem>
                    <SelectItem value="collaboration" className="text-white hover:bg-purple-900/50">Colaboração</SelectItem>
                    <SelectItem value="question" className="text-white hover:bg-purple-900/50">Pergunta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="text-white font-medium">Conteúdo</label>
                <Textarea 
                  id="content" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva o conteúdo da sua publicação aqui..." 
                  rows={8}
                  className="bg-black/20 border-purple-500/30"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/community')}
                  className="border-purple-500/50 text-white"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    'Publicar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostPage;
