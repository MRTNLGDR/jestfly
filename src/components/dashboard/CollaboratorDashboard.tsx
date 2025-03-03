
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, CheckCircle, Clock, Headphones } from 'lucide-react';

const CollaboratorDashboard: React.FC = () => {
  const { profile } = useAuth();

  // Fetch pending moderation count
  const { data: pendingModerationCount, isLoading: moderationLoading } = useQuery({
    queryKey: ['pending-moderation-count'],
    queryFn: async () => {
      // Mock data - implementar consulta real
      return 8;
    }
  });

  // Fetch pending demo reviews count
  const { data: pendingDemosCount, isLoading: demosLoading } = useQuery({
    queryKey: ['pending-demos-count'],
    queryFn: async () => {
      // Mock data - implementar consulta real
      return 12;
    }
  });

  // Métricas para o dashboard do colaborador
  const metrics = [
    {
      title: "Demos para Revisar",
      value: demosLoading ? "..." : pendingDemosCount,
      icon: <Headphones className="h-8 w-8 text-blue-400" />,
      description: "Aguardando sua análise"
    },
    {
      title: "Conteúdo para Moderar",
      value: moderationLoading ? "..." : pendingModerationCount,
      icon: <AlertTriangle className="h-8 w-8 text-yellow-400" />,
      description: "Posts sinalizados"
    },
    {
      title: "Tarefas Pendentes",
      value: "5",
      icon: <Clock className="h-8 w-8 text-purple-400" />,
      description: "Atribuídas a você"
    },
    {
      title: "Concluídas Hoje",
      value: "3",
      icon: <CheckCircle className="h-8 w-8 text-green-400" />,
      description: "Bom trabalho!"
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Demos Recentes</h2>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Crystal Echoes - Nova Era</h3>
                <p className="text-white/70 text-sm">Enviada por DJ Crystal • 2 horas atrás</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Neon Pulse - Horizonte Digital</h3>
                <p className="text-white/70 text-sm">Enviada por Neon Collective • 5 horas atrás</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Quantum Drift - Além do Tempo</h3>
                <p className="text-white/70 text-sm">Enviada por Quantum • 1 dia atrás</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Conteúdo para Moderação</h2>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Post reportado na comunidade</h3>
                <p className="text-white/70 text-sm">Reportado por 3 usuários • Prioridade: Alta</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Comentário flaggado automático</h3>
                <p className="text-white/70 text-sm">Sistema de detecção • Prioridade: Média</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Verificação de perfil solicitada</h3>
                <p className="text-white/70 text-sm">Artista: Nova Era • Prioridade: Baixa</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default CollaboratorDashboard;
