
import React from 'react';
import ProfileInfoItem from './ProfileInfoItem';
import { User, Mail, Calendar, Clock } from 'lucide-react';

interface ProfileInfoProps {
  bio: string;
  email: string;
  createdAt: Date;
  lastLogin?: Date;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  bio,
  email,
  createdAt,
  lastLogin
}) => {
  return (
    <div className="space-y-4">
      <ProfileInfoItem
        icon={User}
        title="Bio"
        value={bio || 'No bio defined yet.'}
      />
      
      <ProfileInfoItem
        icon={Mail}
        title="Email"
        value={email}
      />
      
      <ProfileInfoItem
        icon={Calendar}
        title="Member since"
        value={new Date(createdAt).toLocaleDateString()}
      />
      
      <ProfileInfoItem
        icon={Clock}
        title="Last login"
        value={lastLogin 
          ? `${new Date(lastLogin).toLocaleDateString()} at ${new Date(lastLogin).toLocaleTimeString()}`
          : 'No login information available'}
      />
    </div>
  );
};

export default ProfileInfo;
