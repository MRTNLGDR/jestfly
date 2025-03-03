
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, List, GitGraph } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import Footer from '@/components/Footer';

const NotesPage: React.FC = () => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list');

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Sistema de Notas
            </h1>
            <p className="text-white/70 mt-2">
              Organize suas ideias e conecte-as com o sistema Zettelkasten
            </p>
          </div>
          
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Nova Nota
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <GlassCard className="sticky top-24">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-4">Visualização</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 mr-1" />
                    Lista
                  </Button>
                  <Button 
                    variant={viewMode === 'graph' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setViewMode('graph')}
                  >
                    <GitGraph className="h-4 w-4 mr-1" />
                    Grafo
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    #música
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    #ideias
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    #projetos
                  </Button>
                </div>
              </div>
            </GlassCard>
          </div>
          
          <div className="md:col-span-2 lg:col-span-3 space-y-6">
            {viewMode === 'list' ? (
              <div className="space-y-4">
                <GlassCard className="hover:border-purple-500/50 transition-colors cursor-pointer">
                  <h3 className="text-xl font-semibold text-white">Ideias para próximo álbum</h3>
                  <div className="text-white/60 text-sm mt-1 mb-3">Atualizado há 3 dias</div>
                  <p className="text-white/80">Brainstorming de conceitos para o próximo álbum, incluindo temáticas futuristas...</p>
                  <div className="flex space-x-2 mt-4">
                    <span className="bg-purple-950/50 text-purple-300 text-xs px-2 py-1 rounded-full">
                      #música
                    </span>
                    <span className="bg-blue-950/50 text-blue-300 text-xs px-2 py-1 rounded-full">
                      #ideias
                    </span>
                  </div>
                </GlassCard>
                
                <GlassCard className="hover:border-purple-500/50 transition-colors cursor-pointer">
                  <h3 className="text-xl font-semibold text-white">Técnicas de produção</h3>
                  <div className="text-white/60 text-sm mt-1 mb-3">Atualizado há 1 semana</div>
                  <p className="text-white/80">Novas técnicas de produção descobertas em workshops recentes...</p>
                  <div className="flex space-x-2 mt-4">
                    <span className="bg-purple-950/50 text-purple-300 text-xs px-2 py-1 rounded-full">
                      #música
                    </span>
                    <span className="bg-green-950/50 text-green-300 text-xs px-2 py-1 rounded-full">
                      #técnicas
                    </span>
                  </div>
                </GlassCard>
              </div>
            ) : (
              <GlassCard>
                <div className="text-center py-12">
                  <p className="text-white/60">Visualização em grafo em desenvolvimento</p>
                  <p className="text-white/40 text-sm mt-2">Em breve você poderá ver as conexões entre suas notas</p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NotesPage;
