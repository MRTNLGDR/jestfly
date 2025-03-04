
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2, Calendar, Clock, MapPin, User, Mail, Phone, FileText, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBookings } from '@/hooks/useBookings';
import { Booking, BookingType } from '@/services/bookingsService';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/20 text-green-500 border-green-500/50';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
    case 'cancelled':
      return 'bg-red-500/20 text-red-500 border-red-500/50';
    case 'completed':
      return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
    default:
      return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
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

const getBookingTypeText = (type: BookingType) => {
  switch (type) {
    case 'dj':
      return 'Performance de DJ';
    case 'studio':
      return 'Sessão de Estúdio';
    case 'consultation':
      return 'Consultoria';
    default:
      return type;
  }
};

interface BookingsListProps {
  showManageButtons?: boolean;
}

const BookingsList: React.FC<BookingsListProps> = ({ showManageButtons = true }) => {
  const { bookings, isLoadingBookings, cancelBooking, isCancelling } = useBookings();

  const handleCancelBooking = async (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      await cancelBooking(id);
    }
  };

  if (isLoadingBookings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span>Carregando reservas...</span>
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border border-white/10">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma reserva encontrada</h3>
            <p className="text-white/70">
              Você ainda não possui reservas. Faça sua primeira reserva agora!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {bookings.map((booking: Booking) => (
        <Card key={booking.id} className="bg-black/40 backdrop-blur-md border border-white/10">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{getBookingTypeText(booking.booking_type as BookingType)}</CardTitle>
                <CardDescription>
                  {format(new Date(booking.created_at || ''), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 opacity-70" />
                <span>{format(new Date(booking.start_time), "dd/MM/yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 opacity-70" />
                <span>
                  {format(new Date(booking.start_time), "HH:mm", { locale: ptBR })} - 
                  {format(new Date(booking.end_time), " HH:mm", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center space-x-2 col-span-2">
                <MapPin className="h-4 w-4 opacity-70" />
                <span>{booking.location || 'Local não especificado'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <h4 className="text-sm font-medium mb-2">Informações do cliente</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 opacity-70" />
                  <span>{booking.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 opacity-70" />
                  <span>{booking.customer_email}</span>
                </div>
                {booking.customer_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 opacity-70" />
                    <span>{booking.customer_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {booking.details && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-start space-x-2">
                  <FileText className="h-4 w-4 opacity-70 mt-1" />
                  <div>
                    <h4 className="text-sm font-medium">Detalhes</h4>
                    <p className="text-sm opacity-80">{booking.details}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {showManageButtons && booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <CardFooter className="border-t border-white/10 pt-4">
              <div className="flex justify-between w-full">
                <div className="text-lg font-semibold">
                  R$ {Number(booking.price).toFixed(2)}
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleCancelBooking(booking.id as string)}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelando...
                    </>
                  ) : 'Cancelar'}
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default BookingsList;
