
import React from 'react';
import { Calendar, Music, Mic, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface BookingTypeProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

interface BookingTypeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BookingType: React.FC<BookingTypeProps> = ({ selectedType, onSelectType }) => {
  const bookingTypes: BookingTypeOption[] = [
    {
      id: 'dj',
      title: 'DJ para Evento',
      description: 'Contrate um DJ para o seu evento ou festa',
      icon: <Headphones className="h-8 w-8 text-purple-400" />
    },
    {
      id: 'studio',
      title: 'Sessão de Estúdio',
      description: 'Reserve o estúdio para gravação ou produção',
      icon: <Mic className="h-8 w-8 text-purple-400" />
    },
    {
      id: 'consultation',
      title: 'Consultoria',
      description: 'Agende uma sessão de consultoria musical',
      icon: <Music className="h-8 w-8 text-purple-400" />
    }
  ];

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">Selecione o Tipo de Reserva</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bookingTypes.map((type) => (
          <div
            key={type.id}
            className={cn(
              "p-4 cursor-pointer rounded-lg transition-all border",
              selectedType === type.id
                ? "border-purple-500 bg-purple-950/30"
                : "border-white/10 hover:border-purple-500/70 hover:bg-purple-950/10"
            )}
            onClick={() => onSelectType(type.id)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 p-3 rounded-full bg-black/30 border border-purple-500/30">
                {type.icon}
              </div>
              <h4 className="text-lg font-medium text-white mb-2">{type.title}</h4>
              <p className="text-sm text-white/70">{type.description}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default BookingType;
