
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import CommunityNav from './CommunityNav';
import GlassHeader from '@/components/GlassHeader';

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Comunidade", href: "/community" },
  { label: "Loja", href: "/store" },
  { label: "Bookings", href: "/bookings" },
  { label: "Demo", href: "/submit-demo" },
  { label: "Transmissão", href: "/live" },
  { label: "Press Kit", href: "/press-kit" },
  { label: "Airdrop", href: "/airdrop" }
];

const NewPostPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui viria a lógica para criar um novo post
    // Por enquanto, apenas redirecionamos de volta para a comunidade
    navigate('/community');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
      <GlassHeader menuItems={menuItems} />
      
      <div className="pt-16">
        <CommunityNav />
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-8">
              Nova Publicação
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-white font-medium">Título</label>
                <Input 
                  id="title" 
                  placeholder="Título da sua publicação" 
                  className="bg-black/20 border-purple-500/30"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="text-white font-medium">Conteúdo</label>
                <Textarea 
                  id="content" 
                  placeholder="Escreva o conteúdo da sua publicação aqui..." 
                  rows={8}
                  className="bg-black/20 border-purple-500/30"
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/community')}
                  className="border-purple-500/50 text-white"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Publicar
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
