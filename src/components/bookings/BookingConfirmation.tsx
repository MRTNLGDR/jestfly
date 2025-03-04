
import React from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

interface BookingConfirmationProps {
  booking: {
    id: string;
    date: string;
    timeSlot: string;
    type: string;
    status: string;
  };
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onClose
}) => {
  // Format date for display
  const formattedDate = () => {
    try {
      return format(new Date(booking.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
    } catch (e) {
      return booking.date;
    }
  };

  // Display booking type in a user-friendly way
  const getBookingTypeDisplay = (type: string): string => {
    switch (type) {
      case 'dj': return 'DJ para Evento';
      case 'studio': return 'Sessão de Estúdio';
      case 'consultation': return 'Consultoria';
      default: return type;
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="text-center mb-6">
        <div className="mx-auto bg-green-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white">Reserva Confirmada!</h3>
        <p className="text-white/70 mt-2">
          Sua reserva foi realizada com sucesso.
        </p>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-black/20 rounded-lg border border-white/10">
          <h4 className="text-sm uppercase text-white/50 mb-1">Número da Reserva</h4>
          <p className="text-white font-mono">{booking.id}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="text-sm uppercase text-white/50 mb-1">Data</h4>
            <p className="text-white">{formattedDate()}</p>
          </div>
          
          <div className="p-4 bg-black/20 rounded-lg border border-white/10">
            <h4 className="text-sm uppercase text-white/50 mb-1">Horário</h4>
            <p className="text-white">{booking.timeSlot}</p>
          </div>
        </div>
        
        <div className="p-4 bg-black/20 rounded-lg border border-white/10">
          <h4 className="text-sm uppercase text-white/50 mb-1">Tipo de Reserva</h4>
          <p className="text-white">{getBookingTypeDisplay(booking.type)}</p>
        </div>
        
        <div className="p-4 bg-black/20 rounded-lg border border-white/10">
          <h4 className="text-sm uppercase text-white/50 mb-1">Status</h4>
          <div className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            <p className="text-white">{booking.status === 'confirmed' ? 'Confirmada' : booking.status}</p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-white/70 text-sm mb-6">
        <p>Os detalhes da sua reserva foram enviados para o seu e-mail.</p>
        <p className="mt-1">Em caso de dúvidas, entre em contato conosco.</p>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={onClose}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Retornar ao Início
        </Button>
      </div>
    </GlassCard>
  );
};

export default BookingConfirmation;
