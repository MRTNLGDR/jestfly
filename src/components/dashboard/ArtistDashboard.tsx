
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Music, Users, Calendar, BarChart2 } from 'lucide-react';

const ArtistDashboard: React.FC = () => {
  const { profile } = useAuth();

  // Fetch demos count
  const { data: demosCount, isLoading: demosLoading } = useQuery({
    queryKey: ['artist-demos-count'],
    queryFn: async () => {
      // Isso é um mock, você precisaria implementar a consulta real
      return 5;
    }
  });

  // Fetch bookings count
  const { data: bookingsCount, isLoading: bookingsLoading } = useQuery({
    queryKey: ['artist-bookings-count'],
    queryFn: async () => {
      // Isso é um mock, você precisaria implementar a consulta real
      return 3;
    }
  });

  // Fetch followers count
  const { data: followersCount, isLoading: followersLoading } = useQuery({
    queryKey: ['artist-followers-count'],
    queryFn: async () => {
      // Isso é um mock, você precisaria implementar a consulta real
      return 124;
    }
  });

  // Métricas para o dashboard do artista
  const metrics = [
    {
      title: "Demos Enviadas",
      value: demosLoading ? "..." : demosCount,
      icon: <Music className="h-8 w-8 text-purple-400" />,
      description: "Total de demos submetidas"
    },
    {
      title: "Próximos Shows",
      value: bookingsLoading ? "..." : bookingsCount,
      icon: <Calendar className="h-8 w-8 text-blue-400" />,
      description: "Agendados para este mês"
    },
    {
      title: "Seguidores",
      value: followersLoading ? "..." : followersCount,
      icon: <Users className="h-8 w-8 text-green-400" />,
      description: "Fãs que te seguem"
    },
    {
      title: "Visualizações",
      value: "842",
      icon: <BarChart2 className="h-8 w-8 text-yellow-400" />,
      description: "Últimos 30 dias"
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
            <h2 className="text-2xl font-bold mb-4 text-white">Próximos Eventos</h2>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">JESTFLY Live Sessions</h3>
                <p className="text-white/70 text-sm">12 de Junho, 2023 • 20:00</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Festival Neon Crystal</h3>
                <p className="text-white/70 text-sm">24 de Junho, 2023 • 22:00</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Club Resonance</h3>
                <p className="text-white/70 text-sm">2 de Julho, 2023 • 23:00</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Desempenho Recente</h2>
            <div className="h-64 flex items-center justify-center">
              <p className="text-white/70">Gráfico de desempenho será exibido aqui</p>
              {/* Aqui você pode adicionar um componente de gráfico como recharts */}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ArtistDashboard;
