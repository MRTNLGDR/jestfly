
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommunityPosts } from '@/hooks/community';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { PostCategory } from '@/types/community';

const NewPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createPost } = useCommunityPosts();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('discussion');
  
  React.useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/community/new-post' } });
    }
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category || !user) {
      return;
    }
    
    try {
      await createPost.mutateAsync({
        title,
        content,
        category,
        is_pinned: false,
        is_featured: false,
        user_id: user.id
      });
      
      navigate('/community');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <span className="ml-2 text-white">Redirecionando para login...</span>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto pt-24 px-6 pb-24">
      <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>
      
      <Card className="bg-black/40 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Criar Nova Publicação</CardTitle>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-white">Categoria</Label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as PostCategory)}
              >
                <SelectTrigger className="bg-black/30 border-white/10 text-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10 text-white">
                  <SelectItem value="announcement">Anúncio</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                  <SelectItem value="discussion">Discussão</SelectItem>
                  <SelectItem value="collaboration">Colaboração</SelectItem>
                  <SelectItem value="question">Pergunta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-white">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite um título para sua publicação"
                className="bg-black/30 border-white/10 text-white"
                required
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content" className="text-sm font-medium text-white">Conteúdo</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escreva o conteúdo da sua publicação..."
                className="bg-black/30 border-white/10 text-white resize-none min-h-[200px]"
                required
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/community')}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={!title.trim() || !content.trim() || createPost.isPending}
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewPostPage;
