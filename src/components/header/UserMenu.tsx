
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

const UserMenu: React.FC = () => {
  return (
    <Link to="/profile" className="flex items-center space-x-1 text-white/80 hover:text-white">
      <User className="h-5 w-5" />
      <span className="text-sm">Profile</span>
    </Link>
  );
};

export default UserMenu;
