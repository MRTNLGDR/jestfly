
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Loading from '@/components/ui/loading';
import { ActivityLog, formatLogDate, getActionColor, getLogEntityDescription } from '@/types/logs';
import { Card, CardContent } from '@/components/ui/card';
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
      
      // Transform data to match ActivityLog interface
      const transformedData = data?.map(log => ({
        ...log,
        timestamp: log.created_at, // Map created_at to timestamp for compatibility
        profile: log.profile as {
          username?: string;
          display_name?: string;
          profile_type?: string;
        } | null,
        details: log.details as Record<string, any> | null,
        user_display_name: log.profile ? (log.profile as any).display_name : undefined,
        user_email: undefined // We don't have this in the query
      })) || [];
      
      return transformedData as ActivityLog[];
    }
  });

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
                      {log.profile?.display_name || log.user_display_name || log.user_id}
                      {log.profile && log.profile.username && (
                        <span className="text-white/50"> (@{log.profile.username})</span>
                      )}
                    </div>
                    {log.entity_type && (
                      <div className="text-xs text-white/50 mt-1">
                        {getLogEntityDescription(log)}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-white/50">
                    {formatLogDate(log.timestamp || log.created_at || '')}
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
