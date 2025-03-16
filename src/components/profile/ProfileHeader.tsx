
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../models/User';
import { followUser, checkIfFollowing } from '../../services/profileService';
import { useAuth } from '../../contexts/auth';
import { toast } from 'sonner';
import { 
  AvatarSection, 
  ProfileInfo, 
  CoverImage 
} from './header';

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
      
      // Extract the boolean value we need based on the object structure
      const followSuccess = result?.alreadyFollowing !== undefined 
        ? result.alreadyFollowing 
        : typeof result === 'boolean' ? result : false;
      
      // Se a resposta da API for diferente do que esperamos, revertemos
      if (followSuccess !== !isFollowing) {
        setIsFollowing(followSuccess);
        setFollowersCount(prev => followSuccess ? prev + 1 : prev - 1);
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
      <CoverImage coverImage={profile.cover_image} displayName={profile.display_name} />
      
      {/* Profile info card */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="neo-blur rounded-xl border border-white/10 p-6">
          <div className="flex flex-col md:flex-row">
            {/* Avatar */}
            <AvatarSection profile={profile} />
            
            {/* Info */}
            <ProfileInfo 
              profile={profile}
              isCurrentUser={isCurrentUser}
              isFollowing={isFollowing}
              followersCount={followersCount}
              onFollowToggle={handleFollowToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
