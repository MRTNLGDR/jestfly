
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import AdminDemoReview from '../components/demos/AdminDemoReview';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

// Cliente de consulta para React Query
const queryClient = new QueryClient();

const DemoReviewPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Verificar se o usuário é um administrador
  if (profile?.profile_type !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-[#1A1F2C] to-purple-900 text-white flex items-center justify-center">
        <div className="max-w-md p-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-center">
          <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
          <p className="mb-6">Esta página é reservada para administradores.</p>
          <Button onClick={() => navigate('/')} className="bg-purple-600 hover:bg-purple-700">
            Voltar para Página Inicial
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-b from-black via-[#1A1F2C] to-purple-900 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Button 
                variant="ghost" 
                className="mb-2 text-white/70 hover:text-white" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <h1 className="text-3xl md:text-4xl font-bold">Revisor de Demos</h1>
              <p className="text-gray-400 mt-2">Analise e avalie as submissões de demo</p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="gap-2 border-purple-500/50">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Todos</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                  0
                </span>
              </Button>
              <Button variant="outline" className="gap-2 border-yellow-500/50">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="hidden md:inline">Pendentes</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                  0
                </span>
              </Button>
              <Button variant="outline" className="gap-2 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="hidden md:inline">Aprovados</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                  0
                </span>
              </Button>
              <Button variant="outline" className="gap-2 border-red-500/50">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="hidden md:inline">Rejeitados</span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs">
                  0
                </span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="review" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="review">Revisar Demos</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="review">
              <AdminDemoReview />
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="bg-black/30 rounded-lg border border-white/10 p-6 text-center py-12">
                <h3 className="text-xl font-medium mb-4">Estatísticas em Breve</h3>
                <p className="text-gray-400">As estatísticas detalhadas de submissões estarão disponíveis em breve.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-black/30 rounded-lg border border-white/10 p-6 text-center py-12">
                <h3 className="text-xl font-medium mb-4">Configurações em Breve</h3>
                <p className="text-gray-400">As configurações do sistema de revisão estarão disponíveis em breve.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default DemoReviewPage;
