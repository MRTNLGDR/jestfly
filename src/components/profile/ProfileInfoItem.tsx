
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileInfoItemProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

const ProfileInfoItem: React.FC<ProfileInfoItemProps> = ({ 
  icon: Icon, 
  title, 
  value 
}) => {
  return (
    <div>
      <h3 className="text-white font-medium mb-2 flex items-center">
        <Icon className="h-4 w-4 mr-2 text-purple-400" />
        {title}
      </h3>
      <p className="text-zinc-400 pl-6">{value}</p>
    </div>
  );
};

export default ProfileInfoItem;
