
import React from 'react';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';

interface ProfileActionsProps {
  isCurrentUser: boolean;
  isFollowing: boolean;
  onFollowToggle: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ 
  isCurrentUser, 
  isFollowing, 
  onFollowToggle 
}) => {
  if (isCurrentUser) {
    return (
      <Link to="/settings">
        <Button
          variant="outline"
          className="mt-3 md:mt-0 border-gray-700 text-gray-300"
        >
          Editar Perfil
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={onFollowToggle}
      className={isFollowing 
        ? "mt-3 md:mt-0 border-purple-500"
        : "mt-3 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-500"
      }
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? 'Seguindo' : 'Seguir'}
    </Button>
  );
};

export default ProfileActions;
