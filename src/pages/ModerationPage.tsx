
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Flag, Clock, CheckCircle, XCircle, AlertTriangle, User, File, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Interfaces para tipos de dados
interface ModerationItem {
  id: string;
  type: 'post' | 'comment' | 'user' | 'demo';
  content: string;
  author: string;
  reported_by?: string;
  reason?: string;
  created_at: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const ModerationPage: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Verificar se é admin ou collaborator
  const canModerate = profile?.profile_type === 'admin' || profile?.profile_type === 'collaborator';
  
  // Dados de exemplo para moderação
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([
    {
      id: '1',
      type: 'post',
      content: 'Este é um post que foi denunciado por conter conteúdo inadequado.',
      author: 'johndoe',
      reported_by: 'fanlover123',
      reason: 'Conteúdo impróprio',
      created_at: new Date(2023, 10, 15),
      status: 'pending'
    },
    {
      id: '2',
      type: 'comment',
      content: 'Comentário com linguagem ofensiva que precisa ser analisado.',
      author: 'musicfan2023',
      reported_by: 'userxyz',
      reason: 'Linguagem ofensiva',
      created_at: new Date(2023, 10, 18),
      status: 'pending'
    },
    {
      id: '3',
      type: 'user',
      content: 'Usuário suspeito de spam e comportamento inadequado.',
      author: 'spammer99',
      reported_by: 'communitymember',
      reason: 'Spam',
      created_at: new Date(2023, 10, 20),
      status: 'pending'
    },
    {
      id: '4',
      type: 'demo',
      content: 'Demo musical "Midnight Dreams" enviado para avaliação',
      author: 'rising_artist',
      created_at: new Date(2023, 10, 22),
      status: 'pending'
    },
    {
      id: '5',
      type: 'post',
      content: 'Este post contém links para sites externos suspeitos.',
      author: 'linker444',
      reported_by: 'securityfirst',
      reason: 'Links suspeitos',
      created_at: new Date(2023, 10, 23),
      status: 'pending'
    }
  ]);

  // Aprovar item
  const approveItem = (id: string) => {
    setModerationItems(
      moderationItems.map(item => 
        item.id === id ? { ...item, status: 'approved' } : item
      )
    );
    
    toast({
      title: "Item aprovado",
      description: "O item foi aprovado com sucesso.",
      variant: "default",
    });
  };
  
  // Rejeitar item
  const rejectItem = (id: string) => {
    setModerationItems(
      moderationItems.map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    );
    
    toast({
      title: "Item rejeitado",
      description: "O item foi rejeitado e será removido.",
      variant: "default",
    });
  };
  
  // Filtra itens com base na tab selecionada
  const filteredItems = moderationItems.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return item.status === 'pending';
    if (selectedTab === 'posts') return item.type === 'post';
    if (selectedTab === 'comments') return item.type === 'comment';
    if (selectedTab === 'users') return item.type === 'user';
    if (selectedTab === 'demos') return item.type === 'demo';
    return false;
  });
  
  // Obter contagem de itens pendentes
  const getPendingCount = (type?: string) => {
    if (!type) {
      return moderationItems.filter(item => item.status === 'pending').length;
    }
    return moderationItems.filter(item => item.status === 'pending' && item.type === type).length;
  };
  
  // Renderiza ícone de acordo com o tipo
  const renderIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <MessageSquare className="h-6 w-6 text-blue-400" />;
      case 'comment':
        return <MessageSquare className="h-6 w-6 text-purple-400" />;
      case 'user':
        return <User className="h-6 w-6 text-yellow-400" />;
      case 'demo':
        return <Music className="h-6 w-6 text-green-400" />;
      default:
        return <File className="h-6 w-6 text-gray-400" />;
    }
  };
  
  // Formatador de data relativa
  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Renderiza status
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-500">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-500">Rejeitado</Badge>;
      default:
        return null;
    }
  };

  if (!canModerate) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <GlassCard className="p-8 max-w-2xl mx-auto">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-white/70 mb-6">
            Você não tem permissão para acessar a página de moderação. Esta página está disponível apenas para administradores e colaboradores.
          </p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Moderação</h1>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-yellow-500 bg-yellow-500/10 text-yellow-300">
              <Clock className="h-4 w-4 mr-2" />
              {getPendingCount()} pendentes
            </Badge>
          </div>
        </div>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-black/30 mb-8 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-700 relative">
              Todos
              {getPendingCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPendingCount()}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="pending" className="data-[state=active]:bg-yellow-700 relative">
              Pendentes
              {getPendingCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPendingCount()}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="posts" className="data-[state=active]:bg-blue-700 relative">
              Posts
              {getPendingCount('post') > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPendingCount('post')}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="comments" className="data-[state=active]:bg-purple-700 relative">
              Comentários
              {getPendingCount('comment') > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPendingCount('comment')}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="users" className="data-[state=active]:bg-orange-700 relative">
              Usuários
              {getPendingCount('user') > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPendingCount('user')}
                </span>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="demos" className="data-[state=active]:bg-green-700 relative">
              Demos
              {getPendingCount('demo') > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getPendingCount('demo')}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            <GlassCard className="p-4 divide-y divide-white/10">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <p className="text-white/70">Não há itens para moderação nesta categoria</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start">
                      <div className="bg-black/30 p-3 rounded-lg mr-4">
                        {renderIcon(item.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-white">
                                {item.type === 'post' && 'Post'}
                                {item.type === 'comment' && 'Comentário'}
                                {item.type === 'user' && 'Usuário'}
                                {item.type === 'demo' && 'Demo Musical'}
                              </h3>
                              {renderStatus(item.status)}
                            </div>
                            <p className="text-white/60 text-sm">
                              Autor: <span className="text-blue-400">{item.author}</span> • {formatRelativeDate(item.created_at)}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2 mt-2 sm:mt-0">
                            {item.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-green-500 text-green-500 hover:bg-green-900/30"
                                  onClick={() => approveItem(item.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aprovar
                                </Button>
                                
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="border-red-500 text-red-500 hover:bg-red-900/30"
                                  onClick={() => rejectItem(item.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rejeitar
                                </Button>
                              </>
                            )}
                            
                            {item.status === 'approved' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-900/30"
                                onClick={() => rejectItem(item.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Mudar para Rejeitado
                              </Button>
                            )}
                            
                            {item.status === 'rejected' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-500 text-green-500 hover:bg-green-900/30"
                                onClick={() => approveItem(item.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mudar para Aprovado
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-black/20 p-3 rounded-lg my-3">
                          <p className="text-white/90">{item.content}</p>
                        </div>
                        
                        {item.reported_by && (
                          <div className="bg-red-900/20 p-3 rounded-lg mt-3">
                            <div className="flex items-start">
                              <Flag className="h-4 w-4 text-red-400 mt-1 mr-2 flex-shrink-0" />
                              <div>
                                <p className="text-white/90 text-sm">
                                  <span className="font-medium">Denunciado por:</span> {item.reported_by}
                                </p>
                                {item.reason && (
                                  <p className="text-white/90 text-sm mt-1">
                                    <span className="font-medium">Motivo:</span> {item.reason}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModerationPage;
