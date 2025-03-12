
import React from 'react';
import { UserProfile } from '../../../models/User';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';

interface AvatarSectionProps {
  profile: UserProfile;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ profile }) => {
  const initials = profile.display_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return (
    <div className="relative">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-500 
                     neo-shadow-avatar bg-gradient-to-br from-[#1C1C3D] to-black">
        <Avatar className="w-full h-full">
          {profile.avatar_url ? (
            <AvatarImage 
              src={profile.avatar_url} 
              alt={profile.display_name} 
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-purple-700 to-blue-500">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {profile.is_verified && (
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AvatarSection;
