
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { UserProfile } from '../../../models/Post';

interface AvatarSectionProps {
  profile: UserProfile;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ profile }) => {
  return (
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
  );
};

export default AvatarSection;
