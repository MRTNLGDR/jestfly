
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ProfileData } from '@/types/auth';

interface UserAvatarProps {
  user: Partial<ProfileData> | null;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md',
  showStatus = false 
}) => {
  if (!user) return null;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  const getProfileTypeColor = (type?: string) => {
    switch (type) {
      case 'admin': return 'bg-red-500';
      case 'artist': return 'bg-purple-500';
      case 'collaborator': return 'bg-blue-500';
      case 'fan': 
      default: return 'bg-green-500';
    }
  };

  const displayName = user.display_name || 'Usuário';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage 
          src={user.avatar || undefined} 
          alt={displayName} 
        />
        <AvatarFallback className="bg-purple-900/50">
          {initial}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && user.profile_type && (
        <div 
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black ${getProfileTypeColor(user.profile_type)}`}
          title={`Tipo de perfil: ${user.profile_type}`}
        />
      )}
    </div>
  );
};

export default UserAvatar;
