
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBookingsActions } from '@/hooks/useBookingsActions';
import { CalendarX, Clock, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BookingsList: React.FC = () => {
  const { bookings, isLoading, error, cancelBooking } = useBookingsActions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  const getBookingTypeText = (type: string) => {
    switch (type) {
      case 'dj':
        return 'DJ para Evento';
      case 'studio':
        return 'Sessão de Estúdio';
      case 'consulting':
        return 'Consultoria';
      default:
        return type;
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'dj':
        return '🎧';
      case 'studio':
        return '🎵';
      case 'consulting':
        return '📊';
      default:
        return '📅';
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return format(date, "PPP 'às' p", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3 bg-white/5" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 w-full bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-500/30 text-red-400">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Erro ao carregar reservas. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 bg-black/20 rounded-lg border border-white/10">
        <CalendarX className="h-16 w-16 mx-auto mb-4 text-white/30" />
        <h3 className="text-xl font-medium text-white mb-2">Nenhuma reserva encontrada</h3>
        <p className="text-white/70 max-w-md mx-auto">
          Você ainda não tem nenhuma reserva. Use o formulário para agendar um DJ, sessão de estúdio ou consultoria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Minhas Reservas</h2>
      
      {bookings.map((booking: any) => (
        <Card key={booking.id} className="bg-black/40 backdrop-blur-md border-white/10 overflow-hidden">
          <div className="flex items-center bg-primary/10 px-4 py-2">
            <span className="text-xl mr-2">{getBookingTypeIcon(booking.booking_type)}</span>
            <h3 className="text-lg font-medium text-white">{getBookingTypeText(booking.booking_type)}</h3>
            <Badge 
              className={`ml-auto ${getStatusColor(booking.status)}`}
              variant="outline"
            >
              {getStatusText(booking.status)}
            </Badge>
          </div>
          
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-white/70 mr-2 mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Data e Hora</p>
                    <p className="text-white/70">{formatDateTime(booking.start_time)}</p>
                    <p className="text-white/70">até {format(new Date(booking.end_time), "p", { locale: ptBR })}</p>
                  </div>
                </div>
                
                {booking.location && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-white/70 mr-2 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">Local</p>
                      <p className="text-white/70">{booking.location}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {booking.details && (
                  <div>
                    <p className="text-white font-medium">Detalhes</p>
                    <p className="text-white/70 text-sm">{booking.details}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">Valor</p>
                    <p className="text-primary">{formatCurrency(booking.price)}</p>
                  </div>
                  
                  {booking.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-400 border-red-400/30 hover:bg-red-400/10 hover:text-red-300"
                      onClick={() => cancelBooking.mutate(booking.id)}
                      disabled={cancelBooking.isPending}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;
