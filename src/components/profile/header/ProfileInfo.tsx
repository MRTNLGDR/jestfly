
import React from 'react';
import { UserProfile } from '../../../models/User';
import ProfileBadges from './ProfileBadges';
import ProfileStats from './ProfileStats';
import SocialLinks from './SocialLinks';
import ProfileActions from './ProfileActions';

interface ProfileInfoProps {
  profile: UserProfile;
  isCurrentUser: boolean;
  isFollowing: boolean;
  followersCount: number;
  onFollowToggle: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  profile, 
  isCurrentUser, 
  isFollowing, 
  followersCount,
  onFollowToggle 
}) => {
  return (
    <div className="flex-1 mt-4 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">{profile.display_name}</h1>
            
            {/* Tipo de perfil e verificação em desktop */}
            <ProfileBadges 
              profileType={profile.profile_type} 
              isVerified={profile.is_verified}
              className="ml-3 hidden md:flex"
            />
          </div>
          
          <div className="text-gray-400 mt-1">@{profile.username}</div>
        </div>
        
        <ProfileActions 
          isCurrentUser={isCurrentUser} 
          isFollowing={isFollowing} 
          onFollowToggle={onFollowToggle}
        />
      </div>
      
      {/* Bio */}
      {profile.bio && (
        <p className="mt-4 text-gray-300">{profile.bio}</p>
      )}
      
      {/* Stats */}
      <ProfileStats 
        followersCount={followersCount} 
        followingCount={profile.following_count}
      />
      
      {/* Social Links */}
      <SocialLinks profile={profile} />
    </div>
  );
};

export default ProfileInfo;
