
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Check, Music, Star, Users } from 'lucide-react';

export interface BookingTypeItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  price: number;
}

interface BookingTypeProps {
  bookingType?: BookingTypeItem;
  selectedType: string;
  onSelectType: (type: string) => void;
}

const BookingType: React.FC<BookingTypeProps> = ({
  bookingType,
  selectedType,
  onSelectType
}) => {
  // Default booking types if not provided externally
  const defaultBookingTypes: BookingTypeItem[] = [
    {
      id: 'dj',
      name: 'DJ para Eventos',
      icon: <Music className="h-6 w-6 text-purple-400" />,
      description: 'Contrate DJs profissionais para seu evento, com equipamento de som incluso.',
      price: 1500
    },
    {
      id: 'studio',
      name: 'Sessão de Estúdio',
      icon: <Star className="h-6 w-6 text-yellow-400" />,
      description: 'Reserve nosso estúdio profissional para gravações, mixagens e masterizações.',
      price: 800
    },
    {
      id: 'consultoria',
      name: 'Consultoria Musical',
      icon: <Users className="h-6 w-6 text-blue-400" />,
      description: 'Consultoria personalizada para artistas e produtores musicais.',
      price: 500
    }
  ];

  // Use the provided booking type or default ones
  const bookingTypes = bookingType ? [bookingType] : defaultBookingTypes;

  return (
    <GlassCard className="p-4">
      <h3 className="text-xl font-bold text-white mb-4">Tipo de Reserva</h3>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {bookingTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 rounded-lg border transition-all cursor-pointer ${
              selectedType === type.id
                ? 'bg-purple-900/30 border-purple-500'
                : 'bg-black/30 border-white/10 hover:border-white/30'
            }`}
            onClick={() => onSelectType(type.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-full bg-black/30">
                {type.icon}
              </div>
              
              {selectedType === type.id && (
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            
            <h4 className="font-medium text-white mt-2">{type.name}</h4>
            <p className="text-sm text-white/60 mt-1">{type.description}</p>
            <p className="text-lg text-white mt-2">R$ {type.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default BookingType;
