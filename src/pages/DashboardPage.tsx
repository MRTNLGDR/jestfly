
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import Loading from '@/components/ui/loading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useActivityLogger } from '@/hooks/useActivityLogger';

// Componentes específicos para cada tipo de dashboard
import AdminDashboardOverview from '@/components/admin/dashboard/AdminDashboardOverview';
import AdminDashboardActivity from '@/components/admin/dashboard/AdminDashboardActivity';
import ArtistDashboard from '@/components/dashboard/ArtistDashboard';
import CollaboratorDashboard from '@/components/dashboard/CollaboratorDashboard';
import FanDashboard from '@/components/dashboard/FanDashboard';

const DashboardPage: React.FC = () => {
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const { logAccessAttempt } = useActivityLogger();
  
  useEffect(() => {
    // Registrar tentativa de acesso ao dashboard
    if (profile) {
      logAccessAttempt('dashboard', true);
    }
  }, [profile]);
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loading size="lg" text="Carregando dashboard..." />
      </div>
    );
  }
  
  // Redirecionar se não estiver autenticado
  if (!profile) {
    // Salvar a URL atual para redirecionar de volta após o login
    localStorage.setItem('redirectAfterLogin', '/dashboard');
    return <Navigate to="/auth" replace />;
  }

  // Renderizar diferentes dashboards com base no tipo de perfil
  const renderDashboardContent = () => {
    switch (profile.profile_type) {
      case 'admin':
        return (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-black/20 border border-white/10 p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Visão Geral</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">Usuários</TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-purple-600">Atividade</TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-purple-600">Sistema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <GlassCard>
                <AdminDashboardOverview />
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="users">
              <GlassCard>
                <div className="p-6">
                  <button 
                    onClick={() => navigate('/admin/dashboard')} 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Ir para Dashboard Admin Completo
                  </button>
                </div>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="activity">
              <GlassCard>
                <AdminDashboardActivity />
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="system">
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white">Monitoramento do Sistema</h2>
                  <p className="text-white/70">Estatísticas e métricas do sistema estão disponíveis no painel completo de administração.</p>
                  <button 
                    onClick={() => navigate('/admin/dashboard')} 
                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  >
                    Ir para Painel Completo
                  </button>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        );
        
      case 'artist':
        return <ArtistDashboard />;
        
      case 'collaborator':
        return <CollaboratorDashboard />;
        
      default:
        return <FanDashboard />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Dashboard {profile.display_name ? `de ${profile.display_name}` : ''}
        </h1>
        
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
