
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import GlassHeader from '@/components/GlassHeader';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut, getProfile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'nfts' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  // Estado para edição de perfil
  const [editForm, setEditForm] = useState({
    display_name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
  });

  // Buscar dados do perfil
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        navigate('/auth', { state: { from: '/profile' } });
        return;
      }

      setIsLoading(true);
      try {
        const profile = await getProfile();
        if (profile) {
          setProfileData(profile);
          
          // Inicializar formulário com dados atuais
          setEditForm({
            display_name: profile.display_name || '',
            username: profile.username || '',
            bio: profile.bio || "Membro da comunidade JESTFLY!",
            location: profile.social_links?.location || "Sem localização",
            website: profile.social_links?.website || "",
          });
        } else {
          toast({
            title: 'Erro ao carregar perfil',
            description: 'Não foi possível carregar os dados do seu perfil.',
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, getProfile, toast]);

  // Manipulador de logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: 'Ocorreu um erro ao tentar sair da sua conta.',
        variant: 'destructive',
      });
    }
  };

  // Manipulador de atualização de perfil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await updateProfile({
        display_name: editForm.display_name,
        username: editForm.username,
        bio: editForm.bio,
        social_links: {
          ...(profileData?.social_links || {}),
          location: editForm.location,
          website: editForm.website,
        },
      });
      
      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast({
          title: 'Erro ao atualizar perfil',
          description: error.message || 'Não foi possível atualizar seu perfil.',
          variant: 'destructive',
        });
      } else {
        // Atualizar dados locais
        setProfileData({
          ...profileData,
          display_name: editForm.display_name,
          username: editForm.username,
          bio: editForm.bio,
          social_links: {
            ...(profileData?.social_links || {}),
            location: editForm.location,
            website: editForm.website,
          },
        });
        
        toast({
          title: 'Perfil atualizado',
          description: 'Seu perfil foi atualizado com sucesso!',
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Renderizar tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
          <p className="text-white/70">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  // Renderizar mensagem se o usuário não estiver autenticado
  if (!user || !profileData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Não autorizado</h2>
          <p className="text-white/70 mb-6">Você precisa estar logado para acessar esta página</p>
          <Button 
            onClick={() => navigate('/auth', { state: { from: '/profile' } })}
            className="bg-gradient-to-r from-purple-600 to-blue-600"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Início', href: '/' },
    { label: 'Store', href: '/store' },
    { label: 'Community', href: '/community' },
    { label: 'Bookings', href: '/bookings' },
    { label: 'Profile', href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <GlassHeader menuItems={menuItems} />
      
      <div className="container mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/4 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 sticky top-24">
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 mb-4 overflow-hidden">
                <img 
                  src={profileData.avatar || '/assets/imagem1.jpg'} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h2 className="text-2xl font-bold text-white">{profileData.display_name}</h2>
              <p className="text-white/70 text-sm mt-1">
                Membro desde {new Date(profileData.created_at).toLocaleDateString('pt-BR')}
              </p>
              <p className="text-purple-400 text-sm mt-1">
                @{profileData.username} · {profileData.profile_type}
              </p>
            </div>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-white/80">JestCoins</span>
                <span className="text-white font-bold">0</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                     style={{ width: `0%` }}></div>
              </div>
              <div className="flex justify-between text-xs text-white/60 mt-1">
                <span>Nível 1</span>
                <span>Nível 2 (100 JC)</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Visão Geral
              </button>
              <button 
                onClick={() => setActiveTab('nfts')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'nfts' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Coleção NFT
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                Configurações
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
                Histórico de Compras
              </button>
              <button className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:bg-white/5 transition-colors">
                Eventos Salvos
              </button>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors mt-4"
              >
                Sair
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Visão Geral do Perfil</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white/80 font-medium">Bio</h3>
                      <p className="text-white mt-1">{profileData.bio || "Sem bio definida"}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-white/80 font-medium">Localização</h3>
                        <p className="text-white mt-1">
                          {profileData.social_links?.location || "Não informada"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Website</h3>
                        <p className="text-white mt-1">
                          {profileData.social_links?.website || "Não informado"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Tipo de Perfil</h3>
                        <p className="text-white mt-1">{profileData.profile_type}</p>
                      </div>
                      <div>
                        <h3 className="text-white/80 font-medium">Email</h3>
                        <p className="text-white mt-1">{profileData.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Sua Coleção NFT</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg overflow-hidden border border-dashed border-white/30 flex flex-col items-center justify-center p-6 aspect-square">
                      <span className="text-3xl mb-2">➕</span>
                      <p className="text-white/70 text-center">Descubra mais NFTs na loja</p>
                      <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Ver Loja
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Próximos Eventos</h2>
                  <div className="bg-white/5 p-6 rounded-lg text-center">
                    <p className="text-white/70">Você não tem eventos próximos.</p>
                    <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                      Procurar Eventos
                    </button>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Compras Recentes</h2>
                  <div className="bg-white/5 p-6 rounded-lg text-center">
                    <p className="text-white/70">Você ainda não fez nenhuma compra.</p>
                    <button className="mt-4 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                      Visitar Loja
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'nfts' && (
              <div className="space-y-6">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Sua Coleção NFT</h2>
                    <div className="flex gap-2">
                      <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                        Ver Loja
                      </button>
                      <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Conectar Carteira
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholders para NFTs bloqueadas */}
                    {[1, 2, 3, 4, 5, 6].map(item => (
                      <div key={`placeholder-${item}`} className="bg-white/5 rounded-lg overflow-hidden opacity-30 hover:opacity-40 transition-opacity">
                        <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <span className="text-6xl">?</span>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-medium text-white">NFT Bloqueada #{item}</h3>
                          <div className="flex justify-between items-center mt-3">
                            <div>
                              <p className="text-xs text-white/60">Status</p>
                              <p className="text-white/90">Bloqueada</p>
                            </div>
                            <button className="bg-white/20 text-white px-3 py-1 rounded-full text-xs">
                              Desbloquear
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Conquistas NFT</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl">
                          🏆
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Colecionador</h3>
                          <p className="text-white/70 text-sm">Colecione 5 NFTs</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>0/5</span>
                        <span>Em progresso</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-2xl">
                          🛒
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Primeira Compra</h3>
                          <p className="text-white/70 text-sm">Compre seu primeiro NFT</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>0/1</span>
                        <span>Não completado</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-500 rounded-full flex items-center justify-center text-2xl">
                          🔥
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Raridade</h3>
                          <p className="text-white/70 text-sm">Colecione um NFT raro</p>
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>0/1</span>
                        <span>Não completado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Configurações do Perfil</h2>
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                        <img src={profileData.avatar || '/assets/imagem1.jpg'} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white mb-3">Foto de Perfil</h3>
                        <div className="flex gap-3">
                          <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                            Enviar Imagem
                          </button>
                          <button type="button" className="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-4 py-2 rounded-lg transition-colors">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Nome de Exibição</label>
                      <input
                        type="text"
                        name="display_name"
                        value={editForm.display_name}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Nome de Usuário</label>
                      <input
                        type="text"
                        name="username"
                        value={editForm.username}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={editForm.bio}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        rows={4}
                      ></textarea>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white/80 mb-2">Localização</label>
                        <input
                          type="text"
                          name="location"
                          value={editForm.location}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 mb-2">Website</label>
                        <input
                          type="text"
                          name="website"
                          value={editForm.website}
                          onChange={handleInputChange}
                          className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Configurações da Conta</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-white/80 mb-2">Endereço de Email</label>
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white/50"
                          />
                          <p className="text-white/60 text-xs mt-1">Entre em contato com o suporte para alterar seu email</p>
                        </div>
                        <div>
                          <label className="block text-white/80 mb-2">Senha</label>
                          <button type="button" className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg transition-colors">
                            Alterar Senha
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-lg font-medium text-white mb-4">Preferências de Notificação</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" id="emailNotif" className="mr-3" defaultChecked />
                          <label htmlFor="emailNotif" className="text-white/80">Notificações por email para eventos</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="promoNotif" className="mr-3" defaultChecked />
                          <label htmlFor="promoNotif" className="text-white/80">Emails promocionais e ofertas</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="nftNotif" className="mr-3" defaultChecked />
                          <label htmlFor="nftNotif" className="text-white/80">Notificações de novos lançamentos de NFT</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between border-t border-white/10 pt-6">
                      <button
                        type="button"
                        className="bg-red-900/20 hover:bg-red-900/30 text-red-400 px-6 py-3 rounded-lg transition-colors"
                      >
                        Excluir Conta
                      </button>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Salvar Alterações
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
