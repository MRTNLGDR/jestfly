
import React from 'react';
import { Badge } from '../../ui/badge';

interface ProfileBadgesProps {
  profileType: string;
  isVerified: boolean;
  className?: string;
}

const ProfileBadges: React.FC<ProfileBadgesProps> = ({ 
  profileType, 
  isVerified,
  className = ""
}) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <Badge 
        variant="outline"
        className="bg-purple-900/40 text-purple-300 border-purple-500/30"
      >
        {profileType}
      </Badge>
      
      {isVerified && (
        <Badge className="bg-blue-500">Verificado</Badge>
      )}
    </div>
  );
};

export default ProfileBadges;
