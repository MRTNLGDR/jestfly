
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Music, ShoppingCart, Star } from 'lucide-react';

const FanDashboard: React.FC = () => {
  const { profile } = useAuth();

  // Fetch user activity stats (mock data for now)
  const { data: activityStats, isLoading: statsLoading } = useQuery({
    queryKey: ['fan-activity-stats'],
    queryFn: async () => {
      // Isso é mock data, implementar consulta real depois
      return {
        eventsAttended: 3,
        favorites: 12,
        purchases: 4,
        playlistsCreated: 2
      };
    }
  });

  // Métricas para o dashboard do fã
  const metrics = [
    {
      title: "Eventos Participados",
      value: statsLoading ? "..." : activityStats?.eventsAttended,
      icon: <Calendar className="h-8 w-8 text-purple-400" />,
      description: "Shows e festas"
    },
    {
      title: "Artistas Favoritos",
      value: statsLoading ? "..." : activityStats?.favorites,
      icon: <Star className="h-8 w-8 text-yellow-400" />,
      description: "Que você segue"
    },
    {
      title: "Compras",
      value: statsLoading ? "..." : activityStats?.purchases,
      icon: <ShoppingCart className="h-8 w-8 text-green-400" />,
      description: "Produtos adquiridos"
    },
    {
      title: "Playlists",
      value: statsLoading ? "..." : activityStats?.playlistsCreated,
      icon: <Music className="h-8 w-8 text-blue-400" />,
      description: "Criadas por você"
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
                <h3 className="text-white font-medium">JESTFLY Experience</h3>
                <p className="text-white/70 text-sm">18 de Junho, 2023 • Centro Cultural</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Night Visions: DJ Battle</h3>
                <p className="text-white/70 text-sm">22 de Junho, 2023 • Club Neon</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Crystal Sessions Vol. 3</h3>
                <p className="text-white/70 text-sm">5 de Julho, 2023 • Teatro Municipal</p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-white">Feed da Comunidade</h2>
            <div className="space-y-4">
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Crystal DJ anunciou novo álbum</h3>
                <p className="text-white/70 text-sm">15 comentários • 2 horas atrás</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Sorteio de ingressos para Festival Neon</h3>
                <p className="text-white/70 text-sm">42 participantes • 1 dia atrás</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-white font-medium">Nova coleção de NFTs disponível</h3>
                <p className="text-white/70 text-sm">7 comentários • 2 dias atrás</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default FanDashboard;
