import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Dados de exemplo para os gráficos
const demoStreamData = [
  { name: 'Jan', streams: 120 },
  { name: 'Fev', streams: 180 },
  { name: 'Mar', streams: 250 },
  { name: 'Abr', streams: 270 },
  { name: 'Mai', streams: 320 },
  { name: 'Jun', streams: 550 },
  { name: 'Jul', streams: 780 },
  { name: 'Ago', streams: 690 },
  { name: 'Set', streams: 810 },
  { name: 'Out', streams: 950 },
  { name: 'Nov', streams: 1120 },
  { name: 'Dez', streams: 1250 },
];

const demoAudienceData = [
  { name: 'Brasil', value: 45 },
  { name: 'EUA', value: 25 },
  { name: 'Europa', value: 15 },
  { name: 'Ásia', value: 10 },
  { name: 'Outros', value: 5 },
];

const demoEngagementData = [
  { name: 'Jan', likes: 40, comments: 20, shares: 10 },
  { name: 'Fev', likes: 50, comments: 25, shares: 12 },
  { name: 'Mar', likes: 65, comments: 30, shares: 15 },
  { name: 'Abr', likes: 70, comments: 35, shares: 18 },
  { name: 'Mai', likes: 85, comments: 40, shares: 22 },
  { name: 'Jun', likes: 100, comments: 45, shares: 25 },
];

const demoPlatformData = [
  { name: 'Spotify', value: 45 },
  { name: 'Apple Music', value: 25 },
  { name: 'YouTube', value: 20 },
  { name: 'SoundCloud', value: 10 },
];

const demoGrowthData = [
  { name: 'Jan', followers: 100 },
  { name: 'Fev', followers: 150 },
  { name: 'Mar', followers: 200 },
  { name: 'Abr', followers: 280 },
  { name: 'Mai', followers: 350 },
  { name: 'Jun', followers: 450 },
];

// Cores para os gráficos
const COLORS = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const AnalyticsPage: React.FC = () => {
  const { profile } = useAuth();
  const [timeRange, setTimeRange] = useState('year');
  
  // Verificar se o usuário tem permissão para ver analytics
  const isArtistOrAdmin = profile?.profile_type === 'artist' || profile?.profile_type === 'admin';

  // Função para formatar números grandes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Função para formatar tooltips
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/10 p-3 rounded-lg">
          <p className="text-white text-sm font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatNumber(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!isArtistOrAdmin) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <GlassCard className="p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Acesso Restrito</h1>
          <p className="text-white/70 mb-6">
            A página de Analytics está disponível apenas para perfis de artista e administrador.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">Analytics</h1>
          
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-white/70" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-black/30 border-white/20 text-white">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border-white/20 text-white">
                <SelectItem value="month">Último mês</SelectItem>
                <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                <SelectItem value="halfyear">Últimos 6 meses</SelectItem>
                <SelectItem value="year">Último ano</SelectItem>
                <SelectItem value="alltime">Todo o tempo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Cards de estatísticas gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl"></div>
            <h3 className="text-white/70 text-sm mb-2">Total de Streams</h3>
            <div className="text-3xl font-bold text-white">5.4K</div>
            <div className="text-green-400 text-sm mt-2">+12.5% ↑</div>
          </GlassCard>
          
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-600/10 rounded-full blur-2xl"></div>
            <h3 className="text-white/70 text-sm mb-2">Seguidores</h3>
            <div className="text-3xl font-bold text-white">982</div>
            <div className="text-green-400 text-sm mt-2">+8.3% ↑</div>
          </GlassCard>
          
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl"></div>
            <h3 className="text-white/70 text-sm mb-2">Engajamento</h3>
            <div className="text-3xl font-bold text-white">24.7%</div>
            <div className="text-green-400 text-sm mt-2">+3.1% ↑</div>
          </GlassCard>
          
          <GlassCard className="p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-yellow-600/10 rounded-full blur-2xl"></div>
            <h3 className="text-white/70 text-sm mb-2">Receita Estimada</h3>
            <div className="text-3xl font-bold text-white">R$ 374</div>
            <div className="text-green-400 text-sm mt-2">+15.8% ↑</div>
          </GlassCard>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-black/30 mb-8 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-700">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="streams" className="data-[state=active]:bg-blue-700">
              Streams
            </TabsTrigger>
            <TabsTrigger value="audience" className="data-[state=active]:bg-pink-700">
              Audiência
            </TabsTrigger>
            <TabsTrigger value="engagement" className="data-[state=active]:bg-green-700">
              Engajamento
            </TabsTrigger>
            <TabsTrigger value="revenue" className="data-[state=active]:bg-yellow-700">
              Receita
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Streams ao longo do tempo</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoStreamData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" tickFormatter={formatNumber} />
                      <Tooltip content={customTooltip} />
                      <Line type="monotone" dataKey="streams" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Audiência por Região</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demoAudienceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {demoAudienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Crescimento de Seguidores</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={demoGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip content={customTooltip} />
                      <Line type="monotone" dataKey="followers" stroke="#EC4899" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
              
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold mb-6 text-white">Streams por Plataforma</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demoPlatformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {demoPlatformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>
          </TabsContent>
          
          <TabsContent value="streams">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Detalhes de Streams</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={demoStreamData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" tickFormatter={formatNumber} />
                    <Tooltip content={customTooltip} />
                    <Bar dataKey="streams" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="audience">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Análise de Audiência</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={demoAudienceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {demoAudienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={customTooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Dados Demográficos</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-white/70 mb-2">Faixa Etária</h4>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-purple-600 h-16" style={{ height: '10%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">13-17</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-purple-600 h-16" style={{ height: '40%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">18-24</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-purple-600 h-16" style={{ height: '30%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">25-34</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-purple-600 h-16" style={{ height: '15%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">35-44</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-purple-600 h-16" style={{ height: '5%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">45+</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white/70 mb-2">Gênero</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-blue-600 h-16" style={{ height: '55%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">Masculino</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-pink-600 h-16" style={{ height: '40%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">Feminino</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-black/30 rounded-t-lg overflow-hidden">
                            <div className="bg-green-600 h-16" style={{ height: '5%' }}></div>
                          </div>
                          <span className="text-white/60 text-xs mt-1">Outro</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="engagement">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Métricas de Engajamento</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={customTooltip} />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="comments" stroke="#EC4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="shares" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </TabsContent>
          
          <TabsContent value="revenue">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6 text-white">Receita Estimada</h2>
              <div className="text-center text-white/70 py-10">
                <p>A análise detalhada de receita está em desenvolvimento.</p>
                <p>Em breve você poderá acompanhar sua receita por stream, plataforma e região.</p>
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsPage;
