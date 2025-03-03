
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { CardTitle, CardDescription } from "../../components/ui/card";

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  avatar?: string | null;
  profileType?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  displayName,
  username,
  avatar,
  profileType
}) => {
  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={avatar || ''} alt={displayName} />
        <AvatarFallback className="bg-purple-800 text-2xl">
          {displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <CardTitle className="text-2xl font-bold text-white">
        {displayName}
      </CardTitle>
      <CardDescription className="text-zinc-400 mt-1">
        @{username}
      </CardDescription>
      {profileType && (
        <div className="px-4 py-1 mt-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-xs font-medium text-white">
          {profileType === 'admin' ? 'Administrator' : 
           profileType === 'artist' ? 'Artist' :
           profileType === 'collaborator' ? 'Collaborator' : 'Fan'}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
