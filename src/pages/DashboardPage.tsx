
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { User, Music, Calendar, ShoppingBag, MessageSquare, Users, Headphones, Diamond } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Verifica se a página deve redirecionar para uma seção específica com base no tipo de perfil
  useEffect(() => {
    if (profile?.profile_type === 'admin') {
      setActiveTab('admin');
    } else if (profile?.profile_type === 'artist') {
      setActiveTab('artist');
    } else if (profile?.profile_type === 'collaborator') {
      setActiveTab('collaborator');
    }
  }, [profile]);

  // Função para navegar para outras páginas
  const navigateTo = (path: string) => {
    navigate(path);
  };

  // Renderiza widgets diferentes com base no tipo de perfil
  const renderProfileSpecificWidgets = () => {
    switch (profile?.profile_type) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 hover:bg-purple-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/admin')}>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Painel de Administração</h3>
                  <p className="text-white/70">Acesse todas as configurações do sistema</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 hover:bg-blue-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/moderation')}>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Moderação</h3>
                  <p className="text-white/70">Gerencie conteúdo e interações dos usuários</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      
      case 'artist':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 hover:bg-purple-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/submit-demo')}>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <Music className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Enviar Demo</h3>
                  <p className="text-white/70">Envie suas faixas para consideração</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 hover:bg-green-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/analytics')}>
              <div className="flex items-center space-x-4">
                <div className="bg-green-900/50 p-3 rounded-lg">
                  <Headphones className="h-6 w-6 text-green-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Analytics</h3>
                  <p className="text-white/70">Visualize estatísticas da sua música</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      
      case 'collaborator':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 hover:bg-blue-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/moderation')}>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-900/50 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Moderação</h3>
                  <p className="text-white/70">Modere conteúdo da comunidade</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 hover:bg-cyan-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/bookings')}>
              <div className="flex items-center space-x-4">
                <div className="bg-cyan-900/50 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Reservas</h3>
                  <p className="text-white/70">Gerencie agendamentos e eventos</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      
      // Fan é o caso padrão
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 hover:bg-purple-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/community')}>
              <div className="flex items-center space-x-4">
                <div className="bg-purple-900/50 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Comunidade</h3>
                  <p className="text-white/70">Participe da comunidade JESTFLY</p>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard className="p-6 hover:bg-yellow-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/airdrop')}>
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-900/50 p-3 rounded-lg">
                  <Diamond className="h-6 w-6 text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-white">Airdrop</h3>
                  <p className="text-white/70">Receba tokens exclusivos</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Bem-vindo(a), {profile?.display_name || 'Usuário'}
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-black/30 mb-8 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-700">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-blue-700">
              Atividades
            </TabsTrigger>
            <TabsTrigger value="coins" className="data-[state=active]:bg-yellow-700">
              JestCoins
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-green-700">
              Favoritos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Widgets comuns a todos os usuários */}
                <GlassCard className="p-6 hover:bg-blue-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/profile')}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-900/50 p-3 rounded-lg">
                      <User className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">Perfil</h3>
                      <p className="text-white/70">Edite suas informações</p>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6 hover:bg-pink-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/store')}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-900/50 p-3 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-pink-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">Loja</h3>
                      <p className="text-white/70">Produtos exclusivos</p>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6 hover:bg-cyan-950/30 transition-all cursor-pointer" onClick={() => navigateTo('/settings')}>
                  <div className="flex items-center space-x-4">
                    <div className="bg-cyan-900/50 p-3 rounded-lg">
                      <Settings className="h-6 w-6 text-cyan-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-white">Configurações</h3>
                      <p className="text-white/70">Ajuste suas preferências</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
              
              {/* Widgets específicos por tipo de perfil */}
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  {profile?.profile_type === 'admin' 
                    ? 'Administração' 
                    : profile?.profile_type === 'artist' 
                    ? 'Recursos do Artista' 
                    : profile?.profile_type === 'collaborator' 
                    ? 'Recursos do Colaborador' 
                    : 'Recursos JESTFLY'}
                </h2>
                {renderProfileSpecificWidgets()}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <GlassCard className="p-6 h-96">
              <h2 className="text-2xl font-semibold mb-4 text-white">Atividades Recentes</h2>
              <div className="space-y-4">
                <div className="p-3 bg-black/20 rounded-lg">
                  <p className="text-white">Em breve, suas atividades recentes aparecerão aqui.</p>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="coins">
            <GlassCard className="p-6 h-96">
              <h2 className="text-2xl font-semibold mb-4 text-white">Seus JestCoins</h2>
              <div className="text-center py-12">
                <div className="text-5xl font-bold text-yellow-400 mb-2">0</div>
                <p className="text-white/70 mb-6">Total de JestCoins</p>
                <button className="px-6 py-2 bg-yellow-800/50 hover:bg-yellow-700/50 text-yellow-300 rounded-full transition-colors">
                  Reivindicar Daily Bonus
                </button>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="favorites">
            <GlassCard className="p-6 h-96">
              <h2 className="text-2xl font-semibold mb-4 text-white">Favoritos</h2>
              <div className="space-y-4">
                <div className="p-3 bg-black/20 rounded-lg">
                  <p className="text-white">Você ainda não adicionou favoritos.</p>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
