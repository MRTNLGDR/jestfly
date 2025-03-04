
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ActivityLog, formatLogDate, getActionColor, getLogEntityDescription } from '@/types/logs';

const AdminDashboardActivity: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Buscar logs de atividade
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        
        // Buscar os 10 logs de atividade mais recentes
        const { data, error } = await supabase
          .from('user_activity_logs')
          .select(`
            id,
            created_at,
            user_id,
            action,
            entity_type,
            entity_id,
            success,
            details,
            profiles(username, display_name, profile_type)
          `)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        
        setActivityLogs(data as ActivityLog[]);
      } catch (error) {
        console.error('Erro ao carregar atividades recentes:', error);
        toast({
          title: "Erro ao carregar atividades",
          description: "Não foi possível carregar os logs de atividade.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentActivity();
  }, [toast]);

  return (
    <Card className="bg-black/40 border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-center text-white/60 p-6">
            Nenhuma atividade registrada recentemente.
          </div>
        ) : (
          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div 
                key={log.id} 
                className="p-3 bg-black/30 rounded-md border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`font-medium ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                    <div className="text-sm text-white/70 mt-1">
                      {log.profile?.display_name || log.user_id?.substring(0, 8) || 'Sistema'}
                      {log.profile?.profile_type && (
                        <span className="ml-1 text-xs bg-purple-800/50 px-1.5 py-0.5 rounded">
                          {log.profile.profile_type}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-white/50">
                    {formatLogDate(log.created_at)}
                  </div>
                </div>
                
                {(log.entity_type || log.entity_id) && (
                  <div className="mt-2 text-sm text-white/60">
                    {getLogEntityDescription(log)}
                  </div>
                )}
                
                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="mt-2">
                    <details className="text-xs">
                      <summary className="cursor-pointer text-purple-400 hover:text-purple-300">
                        Ver detalhes
                      </summary>
                      <pre className="mt-1 p-2 bg-black/50 rounded border border-white/10 overflow-x-auto text-white/80">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboardActivity;
