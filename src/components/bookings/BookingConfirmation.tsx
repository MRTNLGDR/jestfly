
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

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

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onClose }) => {
  const formatBookingType = (type: string): string => {
    switch (type) {
      case 'dj':
        return 'DJ para Evento';
      case 'studio':
        return 'Sessão de Estúdio';
      case 'consultation':
        return 'Consultoria';
      default:
        return type;
    }
  };

  return (
    <GlassCard className="p-6 text-center">
      <div className="flex flex-col items-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
        
        <h3 className="text-2xl font-bold text-white mb-2">Reserva Confirmada!</h3>
        <p className="text-white/70 mb-6">
          Sua reserva foi realizada com sucesso. Confira os detalhes abaixo.
        </p>
        
        <div className="bg-white/5 rounded-lg p-4 mb-6 w-full">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-white/60 text-sm">Número da Reserva:</p>
              <p className="text-white font-medium">{booking.id}</p>
            </div>
            
            <div>
              <p className="text-white/60 text-sm">Status:</p>
              <p className="text-green-400 font-medium capitalize">{booking.status}</p>
            </div>
            
            <div>
              <p className="text-white/60 text-sm">Tipo de Reserva:</p>
              <p className="text-white font-medium">{formatBookingType(booking.type)}</p>
            </div>
            
            <div>
              <p className="text-white/60 text-sm">Data:</p>
              <p className="text-white font-medium">{booking.date}</p>
            </div>
            
            <div>
              <p className="text-white/60 text-sm">Horário:</p>
              <p className="text-white font-medium">{booking.timeSlot}</p>
            </div>
            
            <div>
              <p className="text-white/60 text-sm">Preço:</p>
              <p className="text-white font-medium">
                {booking.type === 'dj' ? 'R$ 1.500,00' : 
                 booking.type === 'studio' ? 'R$ 200,00' : 
                 booking.type === 'consultation' ? 'R$ 150,00' : 'A definir'}
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-white/70 text-sm mb-6">
          Um email de confirmação foi enviado para seu endereço de email cadastrado.
          Você também pode acessar suas reservas pelo seu perfil.
        </p>
        
        <div className="flex gap-4">
          <Button 
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Nova Reserva
          </Button>
          
          <Button
            variant="outline"
            className="bg-transparent border-white/20 text-white hover:bg-white/10"
            onClick={() => window.location.href = '/dashboard'}
          >
            Ir para Dashboard
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default BookingConfirmation;
