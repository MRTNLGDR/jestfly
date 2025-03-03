
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from '../../contexts/auth';
import { User, LogOut, Settings, Music, FileText } from 'lucide-react';

const UserMenu: React.FC = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!userData) return null;

  // Obter as iniciais do nome do usuário para o fallback do avatar
  const getInitials = () => {
    if (!userData.displayName) return '?';
    return userData.displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determinar o texto para o tipo de perfil
  const getProfileTypeText = () => {
    switch (userData.profileType) {
      case 'artist':
        return 'Artista';
      case 'admin':
        return 'Administrador';
      case 'collaborator':
        return 'Profissional';
      case 'fan':
      default:
        return 'Fã';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-9 w-9 border border-purple-500/30 hover:border-purple-500/60 transition-colors">
          <AvatarImage src={userData.avatar} alt={userData.displayName} />
          <AvatarFallback className="bg-purple-900 text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 text-white">
        <DropdownMenuLabel>
          <div className="font-medium">{userData.displayName}</div>
          <div className="text-xs text-zinc-400">@{userData.username}</div>
          <div className="text-xs text-purple-400 mt-1">{getProfileTypeText()}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800" asChild>
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        {userData.profileType === 'artist' && (
          <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800" asChild>
            <Link to="/artist-dashboard">
              <Music className="mr-2 h-4 w-4" />
              <span>Dashboard de Artista</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800" asChild>
          <Link to="/notes">
            <FileText className="mr-2 h-4 w-4" />
            <span>Minhas Notas</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-zinc-800" asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem 
          className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-zinc-800"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
