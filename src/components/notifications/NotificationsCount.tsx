
import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface NotificationsCountProps {
  className?: string;
}

const NotificationsCount: React.FC<NotificationsCountProps> = ({ className }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Buscar contagem de notificações (mock por enquanto)
  const { data: notificationsCount } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      // Aqui você implementaria a consulta real ao Supabase
      // Este é apenas um exemplo de como seria
      return 5; // Número fixo para demonstração
    },
    enabled: !!profile, // Só executa se o usuário estiver logado
  });
  
  const handleClick = () => {
    navigate('/notifications');
  };
  
  if (!profile) return null;
  
  return (
    <button 
      onClick={handleClick}
      className={`relative flex items-center justify-center ${className}`}
    >
      <Bell className="h-6 w-6 text-white" />
      {notificationsCount && notificationsCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {notificationsCount > 9 ? '9+' : notificationsCount}
        </span>
      )}
    </button>
  );
};

export default NotificationsCount;
