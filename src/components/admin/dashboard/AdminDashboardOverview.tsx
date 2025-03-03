
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, ActivityIcon, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminDashboardOverview: React.FC = () => {
  // Fetch users count
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch recent activity count
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['recent-activity-count'],
    queryFn: async () => {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      
      const { count, error } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastWeek.toISOString());
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch error count
  const { data: errorData, isLoading: errorLoading } = useQuery({
    queryKey: ['error-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('success', false);
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch successful operations count
  const { data: successData, isLoading: successLoading } = useQuery({
    queryKey: ['success-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact', head: true })
        .eq('success', true);
      
      if (error) throw error;
      return count || 0;
    }
  });

  const metrics = [
    {
      title: "Usuários",
      value: usersLoading ? "..." : usersData,
      icon: <Users className="h-8 w-8 text-purple-400" />,
      description: "Total de usuários registrados"
    },
    {
      title: "Atividade Recente",
      value: activityLoading ? "..." : activityData,
      icon: <ActivityIcon className="h-8 w-8 text-blue-400" />,
      description: "Ações nos últimos 7 dias"
    },
    {
      title: "Erros",
      value: errorLoading ? "..." : errorData,
      icon: <AlertTriangle className="h-8 w-8 text-red-400" />,
      description: "Total de operações com erro"
    },
    {
      title: "Sucesso",
      value: successLoading ? "..." : successData,
      icon: <CheckCircle className="h-8 w-8 text-green-400" />,
      description: "Total de operações com sucesso"
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Visão Geral do Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-white/70">{metric.title}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <p className="text-xs text-white/50 mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
