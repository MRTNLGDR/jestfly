
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';

const UserProfileMenu: React.FC = () => {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) return null;

  // Gerar iniciais para o fallback do avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Mapear tipo de perfil para texto em português
  const profileTypeMap = {
    fan: 'Fã',
    artist: 'Artista',
    collaborator: 'Colaborador',
    admin: 'Administrador'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 rounded-lg p-1 hover:bg-white/5 transition-colors cursor-pointer outline-none">
        <Avatar className="h-8 w-8 border border-white/20">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} alt={profile.display_name} />
          ) : (
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              {getInitials(profile.display_name)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-white">{profile.display_name}</p>
          <p className="text-xs text-white/70">@{profile.username}</p>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="bg-black/90 border border-white/10 text-white min-w-[200px]">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-bold">{profile.display_name}</span>
          <span className="text-xs text-white/70">@{profile.username}</span>
          <span className="text-xs mt-1 px-2 py-0.5 bg-white/10 rounded-full w-fit">
            {profileTypeMap[profile.profile_type]}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" asChild>
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" asChild>
          <Link to="/profile?tab=settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="hover:bg-red-900/20 text-red-400 cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
