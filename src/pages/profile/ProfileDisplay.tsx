import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { User, ArrowLeft, Camera, Edit, Settings, Shield } from 'lucide-react';
import UISchemaExporter from '../../components/ui/design-export/UISchemaExporter';

interface ProfileDisplayProps {
  profile: any;
  isCurrentUser: boolean;
  onBack: () => void;
  defaultTab?: 'overview' | 'resources' | 'settings';
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ 
  profile, 
  isCurrentUser, 
  onBack,
  defaultTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'settings'>(defaultTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 pt-20">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="neo-blur rounded-xl border border-white/10 p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.username} 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-purple-300" />
                  )}
                </div>
                
                {isCurrentUser && (
                  <button className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1.5 border-2 border-purple-950">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{profile.username || 'Usuário'}</h2>
              <div className="flex items-center space-x-1 mb-4">
                <span className="px-2 py-0.5 bg-purple-600/30 border border-purple-500/30 rounded-full text-xs font-medium">
                  {profile.profile_type || 'Fã'}
                </span>
                {profile.is_verified && (
                  <span className="px-2 py-0.5 bg-blue-600/30 border border-blue-500/30 rounded-full text-xs font-medium">
                    Verificado
                  </span>
                )}
              </div>
              
              {isCurrentUser && (
                <Button variant="outline" className="w-full mb-4">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
              
              <div className="w-full">
                <div className="flex flex-col space-y-1 mb-4 text-sm">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">JestCoins</span>
                    <span className="font-medium">{profile.jest_coins || '0'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Posts</span>
                    <span className="font-medium">{profile.posts_count || '0'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-white/60">Membro desde</span>
                    <span className="font-medium">
                      {profile.created_at 
                        ? new Date(profile.created_at).toLocaleDateString() 
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="neo-blur rounded-xl border border-white/10 p-6">
              <div className="mb-6 border-b border-white/10 pb-4">
                <div className="flex space-x-2">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'}
                    className={activeTab === 'overview' ? 'bg-purple-700' : ''}
                    onClick={() => setActiveTab('overview')}
                  >
                    Visão Geral
                  </Button>
                  
                  <Button 
                    variant={activeTab === 'resources' ? 'default' : 'ghost'}
                    className={activeTab === 'resources' ? 'bg-purple-700' : ''}
                    onClick={() => setActiveTab('resources')}
                  >
                    Recursos
                  </Button>
                  
                  {isCurrentUser && (
                    <Button 
                      variant={activeTab === 'settings' ? 'default' : 'ghost'}
                      className={activeTab === 'settings' ? 'bg-purple-700' : ''}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Button>
                  )}
                </div>
              </div>
              
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Sobre</h3>
                  <p className="text-white/70">
                    {profile.bio || 'Nenhuma informação disponível.'}
                  </p>
                  
                  <h3 className="text-xl font-bold">Atividade Recente</h3>
                  {!profile.recent_activity || profile.recent_activity.length === 0 ? (
                    <div className="bg-black/20 rounded-lg p-6 text-center">
                      <p className="text-white/60">Nenhuma atividade recente.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Aqui entraria o mapeamento das atividades recentes */}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Recursos do Sistema</h3>
                  <p className="text-white/70 mb-6">
                    Explore e exporte recursos do sistema JESTFLY, incluindo documentação de UI/UX e componentes.
                  </p>
                  
                  <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                    <UISchemaExporter />
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && isCurrentUser && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Configurações da Conta</h3>
                  <p className="text-white/70">
                    Gerencie suas preferências e configurações de conta.
                  </p>
                  
                  {/* Aqui entrariam as configurações */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
