
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/ui/loading';
import { ActivityLog } from '@/types/logs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const AdminDashboardActivity: React.FC = () => {
  const { data: recentLogs, isLoading } = useQuery({
    queryKey: ['admin-recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          *,
          profile:profiles(username, display_name, profile_type)
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const safeData = (data || []).map(log => {
        return {
          ...log,
          profile: log.profile && typeof log.profile === 'object' ? {
            username: 'username' in log.profile ? log.profile.username : undefined,
            display_name: 'display_name' in log.profile ? log.profile.display_name : undefined,
            profile_type: 'profile_type' in log.profile ? log.profile.profile_type : undefined
          } : undefined,
          details: log.details as Record<string, any> | null
        };
      }) as ActivityLog[];
      
      return safeData;
    }
  });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Get action badge color
  const getActionColor = (action: string) => {
    if (action.includes('login')) return 'text-blue-400';
    if (action.includes('create') || action.includes('add')) return 'text-green-400';
    if (action.includes('delete') || action.includes('remove')) return 'text-red-400';
    if (action.includes('update') || action.includes('edit')) return 'text-yellow-400';
    return 'text-white';
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-white">Atividade Recente</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loading text="Carregando atividades..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recentLogs?.map(log => (
            <Card key={log.id} className="bg-black/20 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      {log.success ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {log.profile?.display_name || log.user_id}
                      {log.profile?.username && <span className="text-white/50"> (@{log.profile.username})</span>}
                    </div>
                    {log.entity_type && (
                      <div className="text-xs text-white/50 mt-1">
                        {log.entity_type} {log.entity_id ? `#${log.entity_id.substring(0, 8)}` : ''}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {formatDate(log.created_at)}
                  </div>
                </div>
                {log.ip_address && (
                  <div className="text-xs text-white/30 mt-2">IP: {log.ip_address}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardActivity;
