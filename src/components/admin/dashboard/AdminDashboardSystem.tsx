
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/components/ui/loading';
import { Server, Settings } from 'lucide-react';

interface SystemTask {
  id: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboardSystem: React.FC = () => {
  const { toast } = useToast();

  // Fetch system tasks
  const { data: tasks, isLoading: tasksLoading, refetch } = useQuery({
    queryKey: ['system-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as SystemTask[];
    }
  });

  // Run a database health check
  const runHealthCheck = async () => {
    try {
      const { data, error } = await supabase
        .from('system_tasks')
        .insert([
          { 
            type: 'health_check',
            status: 'pending',
            data: { initiated_by: 'admin_dashboard' }
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Verificação iniciada",
        description: "A verificação de saúde do sistema foi iniciada com sucesso.",
      });
      
      refetch();
    } catch (error) {
      console.error('Erro ao iniciar verificação de saúde:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a verificação de saúde do sistema.",
        variant: "destructive",
      });
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'running': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Status do Sistema</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={runHealthCheck}
            className="bg-purple-950/40 hover:bg-purple-900/60 border-purple-500/30 text-white"
          >
            <Server className="mr-2 h-4 w-4" />
            Verificar Saúde
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Status do Banco de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-white">Conectado</span>
            </div>
            <p className="text-sm text-white/70">Supabase Postgres</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Status da API</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-white">Operacional</span>
            </div>
            <p className="text-sm text-white/70">Supabase REST API</p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-xl font-bold mb-4 text-white">Tarefas Recentes do Sistema</h3>
      
      {tasksLoading ? (
        <div className="flex justify-center p-8">
          <Loading text="Carregando tarefas..." />
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/70 font-medium">Tipo</th>
                <th className="text-left p-4 text-white/70 font-medium">Status</th>
                <th className="text-left p-4 text-white/70 font-medium">Iniciado em</th>
                <th className="text-left p-4 text-white/70 font-medium">Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4 text-white">{task.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-4 text-white/70">{formatDate(task.created_at)}</td>
                  <td className="p-4 text-white/70">{formatDate(task.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card className="bg-black/20 border-white/10 p-8 text-center">
          <p className="text-white/70">Nenhuma tarefa do sistema encontrada</p>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboardSystem;
