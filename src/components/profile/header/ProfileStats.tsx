
import React from 'react';
import { Users, User } from 'lucide-react';

interface ProfileStatsProps {
  followersCount: number;
  followingCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ 
  followersCount, 
  followingCount 
}) => {
  return (
    <div className="flex mt-4 space-x-4">
      <div className="flex items-center text-gray-300">
        <Users size={16} className="mr-1 text-gray-400" />
        <span className="font-medium text-white">{followersCount}</span>
        <span className="ml-1 text-sm">seguidores</span>
      </div>
      <div className="flex items-center text-gray-300">
        <User size={16} className="mr-1 text-gray-400" />
        <span className="font-medium text-white">{followingCount}</span>
        <span className="ml-1 text-sm">seguindo</span>
      </div>
    </div>
  );
};

export default ProfileStats;
