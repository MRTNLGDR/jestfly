
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Loading from '@/components/ui/loading';
import AdminDashboardOverview from '@/components/admin/dashboard/AdminDashboardOverview';
import AdminDashboardUsers from '@/components/admin/dashboard/AdminDashboardUsers';
import AdminDashboardActivity from '@/components/admin/dashboard/AdminDashboardActivity';
import AdminDashboardSystem from '@/components/admin/dashboard/AdminDashboardSystem';

const AdminDashboardPage: React.FC = () => {
  const { profile, loading } = useAuth();
  
  // Check if user is admin
  const isAdmin = profile?.profile_type === 'admin';
  const isCollaborator = profile?.profile_type === 'collaborator';
  const hasAccess = isAdmin || isCollaborator;
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <Loading size="lg" text="Carregando painel administrativo..." />
      </div>
    );
  }
  
  // Redirect if not admin or collaborator
  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Painel Administrativo</h1>
        
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
              <AdminDashboardUsers />
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="activity">
            <GlassCard>
              <AdminDashboardActivity />
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="system">
            <GlassCard>
              <AdminDashboardSystem />
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
