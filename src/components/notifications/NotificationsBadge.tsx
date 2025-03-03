
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadUserNotifications, Notification } from '@/utils/notifications';

interface NotificationsBadgeProps {
  className?: string;
}

const NotificationsBadge: React.FC<NotificationsBadgeProps> = ({ className }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await loadUserNotifications(user.id);
      
      if (error) {
        console.error('Erro ao carregar notificações:', error);
        return;
      }
      
      if (data) {
        const count = data.filter((notification: Notification) => !notification.read).length;
        setUnreadCount(count);
      }
    } catch (e) {
      console.error('Exceção ao carregar notificações:', e);
    } finally {
      setLoading(false);
    }
  };

  const goToNotifications = () => {
    navigate('/notifications');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={goToNotifications}
      className={`relative ${className}`}
      disabled={loading}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
};

export default NotificationsBadge;
