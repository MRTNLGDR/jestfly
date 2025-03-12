
import React, { useState, useEffect } from 'react';
import { User, Users, Link as LinkIcon, Instagram, Twitter, Music } from 'lucide-react';
import { UserProfile } from '../../models/Post';
import { Button } from '../ui/button';
import { followUser, checkIfFollowing } from '../../services/profileService';
import { useAuth } from '../../contexts/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ProfileHeaderProps {
  profile: UserProfile;
  isCurrentUser: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isCurrentUser }) => {
  const { currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(profile.followers_count || 0);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (currentUser && !isCurrentUser) {
        const following = await checkIfFollowing(profile.id, currentUser.id);
        setIsFollowing(following);
      }
    };

    checkFollowStatus();
  }, [currentUser, profile.id, isCurrentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Você precisa estar logado para seguir usuários');
      return;
    }

    // Atualização otimista da UI
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);

    try {
      const result = await followUser(profile.id, currentUser.id);
      
      // Se a resposta da API for diferente do que esperamos, revertemos
      if (result !== !isFollowing) {
        setIsFollowing(result);
        setFollowersCount(prev => result ? prev + 1 : prev - 1);
      }
    } catch (error) {
      // Em caso de erro, revertemos para o estado anterior
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => !isFollowing ? prev - 1 : prev + 1);
      console.error('Erro ao seguir/deixar de seguir:', error);
      toast.error('Ocorreu um erro ao atualizar');
    }
  };

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="h-48 md:h-64 w-full relative bg-gradient-to-r from-purple-900 to-blue-900 rounded-b-xl overflow-hidden">
        {profile.cover_image && (
          <img 
            src={profile.cover_image} 
            alt={`Capa de ${profile.display_name}`}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>
      
      {/* Profile info card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="neo-blur rounded-xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row">
            {/* Avatar */}
            <div className="mr-6 flex flex-col items-center">
              <Avatar className="h-24 w-24 border-4 border-black bg-gradient-to-r from-purple-600 to-blue-500">
                {profile.avatar ? (
                  <AvatarImage 
                    src={profile.avatar} 
                    alt={profile.display_name}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-xl">
                    {profile.display_name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {/* Tipo de perfil e verificação em dispositivos móveis */}
              <div className="mt-2 flex md:hidden space-x-1">
                <Badge 
                  variant="outline"
                  className="bg-purple-900/40 text-purple-300 border-purple-500/30"
                >
                  {profile.profile_type}
                </Badge>
                
                {profile.is_verified && (
                  <Badge className="bg-blue-500">Verificado</Badge>
                )}
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-white">{profile.display_name}</h1>
                    
                    {/* Tipo de perfil e verificação em desktop */}
                    <div className="ml-3 hidden md:flex space-x-1">
                      <Badge 
                        variant="outline"
                        className="bg-purple-900/40 text-purple-300 border-purple-500/30"
                      >
                        {profile.profile_type}
                      </Badge>
                      
                      {profile.is_verified && (
                        <Badge className="bg-blue-500">Verificado</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-gray-400 mt-1">@{profile.username}</div>
                </div>
                
                {!isCurrentUser ? (
                  <Button
                    onClick={handleFollowToggle}
                    className={isFollowing 
                      ? "mt-3 md:mt-0 border-purple-500"
                      : "mt-3 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500"
                    }
                    variant={isFollowing ? "outline" : "default"}
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                ) : (
                  <Button
                    as={Link}
                    to="/settings"
                    variant="outline"
                    className="mt-3 md:mt-0 border-gray-700 text-gray-300"
                  >
                    Editar Perfil
                  </Button>
                )}
              </div>
              
              {/* Bio */}
              {profile.bio && (
                <p className="mt-4 text-gray-300">{profile.bio}</p>
              )}
              
              {/* Stats */}
              <div className="flex mt-4 space-x-4">
                <div className="flex items-center text-gray-300">
                  <Users size={16} className="mr-1 text-gray-400" />
                  <span className="font-medium text-white">{followersCount}</span>
                  <span className="ml-1 text-sm">seguidores</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <User size={16} className="mr-1 text-gray-400" />
                  <span className="font-medium text-white">{profile.following_count}</span>
                  <span className="ml-1 text-sm">seguindo</span>
                </div>
              </div>
              
              {/* Social Links */}
              {profile.social_links && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white"
                    >
                      <LinkIcon size={16} className="mr-1" />
                      Website
                    </a>
                  )}
                  
                  {profile.social_links.instagram && (
                    <a 
                      href={`https://instagram.com/${profile.social_links.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white"
                    >
                      <Instagram size={16} className="mr-1" />
                      Instagram
                    </a>
                  )}
                  
                  {profile.social_links.twitter && (
                    <a 
                      href={`https://twitter.com/${profile.social_links.twitter}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white"
                    >
                      <Twitter size={16} className="mr-1" />
                      Twitter
                    </a>
                  )}
                  
                  {profile.social_links.soundcloud && (
                    <a 
                      href={`https://soundcloud.com/${profile.social_links.soundcloud}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white"
                    >
                      <Music size={16} className="mr-1" />
                      SoundCloud
                    </a>
                  )}
                  
                  {profile.social_links.spotify && (
                    <a 
                      href={`https://open.spotify.com/artist/${profile.social_links.spotify}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-300 hover:text-white"
                    >
                      <Music size={16} className="mr-1" />
                      Spotify
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
