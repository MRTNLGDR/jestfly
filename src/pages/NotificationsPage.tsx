
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Mail, Star, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Interfaces para tipar as notificações
interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: 'system' | 'message' | 'event' | 'promo' | 'alert';
}

const NotificationsPage: React.FC = () => {
  // Dados de exemplo de notificações
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Bem-vindo ao JESTFLY',
      message: 'Obrigado por se juntar à nossa plataforma! Esperamos que você tenha uma experiência incrível.',
      date: new Date(2023, 5, 15),
      read: true,
      type: 'system'
    },
    {
      id: '2',
      title: 'Nova mensagem',
      message: 'Você recebeu uma nova mensagem de DJ Crystal.',
      date: new Date(2023, 5, 17),
      read: false,
      type: 'message'
    },
    {
      id: '3',
      title: 'Evento próximo',
      message: 'JESTFLY Music Festival começa em 3 dias. Prepare-se!',
      date: new Date(2023, 5, 20),
      read: false,
      type: 'event'
    },
    {
      id: '4',
      title: 'JestCoins Promocionais',
      message: 'Você ganhou 50 JestCoins! Use para desbloquear conteúdo exclusivo.',
      date: new Date(2023, 5, 21),
      read: false,
      type: 'promo'
    },
    {
      id: '5',
      title: 'Alerta de segurança',
      message: 'Detectamos um login incomum na sua conta. Por favor, verifique.',
      date: new Date(2023, 5, 22),
      read: false,
      type: 'alert'
    }
  ]);

  const getUnreadCount = (type?: string) => {
    if (type) {
      return notifications.filter(n => !n.read && n.type === type).length;
    }
    return notifications.filter(n => !n.read).length;
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Função para renderizar o ícone baseado no tipo de notificação
  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Bell className="h-5 w-5 text-purple-400" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-blue-400" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-400" />;
      case 'promo':
        return <Star className="h-5 w-5 text-yellow-400" />;
      case 'alert':
        return <Bell className="h-5 w-5 text-red-400" />;
      default:
        return <Mail className="h-5 w-5 text-gray-400" />;
    }
  };

  // Formatador de data
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const day = 24 * 60 * 60 * 1000;
    
    if (diff < day) {
      return 'Hoje';
    } else if (diff < 2 * day) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Notificações</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-white/70">
              {getUnreadCount()} não lidas
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="border-white/20 hover:bg-white/10"
              disabled={getUnreadCount() === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-black/30 mb-8 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-purple-700 relative">
              Todas
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount()}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-700 relative">
              Sistema
              {getUnreadCount('system') > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount('system')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="message" className="data-[state=active]:bg-blue-700 relative">
              Mensagens
              {getUnreadCount('message') > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount('message')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="event" className="data-[state=active]:bg-green-700 relative">
              Eventos
              {getUnreadCount('event') > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount('event')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="promo" className="data-[state=active]:bg-yellow-700 relative">
              Promoções
              {getUnreadCount('promo') > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount('promo')}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="alert" className="data-[state=active]:bg-red-700 relative">
              Alertas
              {getUnreadCount('alert') > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getUnreadCount('alert')}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <GlassCard className="p-4 divide-y divide-white/10">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto text-white/30 mb-4" />
                  <p className="text-white/70">Você não tem notificações</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-4 ${notification.read ? 'opacity-70' : 'bg-black/20'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-black/30 p-2 rounded-full">
                        {renderNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-white">{notification.title}</h3>
                          <span className="text-sm text-white/60">{formatDate(notification.date)}</span>
                        </div>
                        <p className="text-white/80 mt-1">{notification.message}</p>
                      </div>
                      
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </GlassCard>
          </TabsContent>
          
          {/* Implementação similar para as outras abas */}
          {['system', 'message', 'event', 'promo', 'alert'].map(type => (
            <TabsContent key={type} value={type}>
              <GlassCard className="p-4 divide-y divide-white/10">
                {notifications.filter(n => n.type === type).length === 0 ? (
                  <div className="py-12 text-center">
                    {renderNotificationIcon(type)}
                    <p className="text-white/70 mt-4">Nenhuma notificação deste tipo</p>
                  </div>
                ) : (
                  notifications
                    .filter(n => n.type === type)
                    .map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 ${notification.read ? 'opacity-70' : 'bg-black/20'}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-black/30 p-2 rounded-full">
                            {renderNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-white">{notification.title}</h3>
                              <span className="text-sm text-white/60">{formatDate(notification.date)}</span>
                            </div>
                            <p className="text-white/80 mt-1">{notification.message}</p>
                          </div>
                          
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                )}
              </GlassCard>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default NotificationsPage;
