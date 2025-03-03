
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import GlassHeader from '@/components/GlassHeader';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileOverview from '@/components/profile/ProfileOverview';
import ProfileNFTs from '@/components/profile/ProfileNFTs';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProfileLoading from '@/components/profile/ProfileLoading';
import ProfileUnauthorized from '@/components/profile/ProfileUnauthorized';

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
    return <ProfileLoading />;
  }

  // Renderizar mensagem se o usuário não estiver autenticado
  if (!user || !profileData) {
    return <ProfileUnauthorized redirectTo="/auth" />;
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
          <ProfileSidebar 
            profileData={profileData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
          />
          
          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <ProfileOverview profileData={profileData} />
            )}
            
            {activeTab === 'nfts' && (
              <ProfileNFTs profileData={profileData} />
            )}
            
            {activeTab === 'settings' && (
              <ProfileSettings 
                profileData={profileData}
                editForm={editForm}
                handleInputChange={handleInputChange}
                handleProfileUpdate={handleProfileUpdate}
              />
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
