
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlotsProps {
  availableSlots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  disabled?: boolean;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  disabled = false
}) => {
  // Default time slots if none are provided
  const defaultTimeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const slots = availableSlots?.length > 0 ? availableSlots : defaultTimeSlots;

  return (
    <GlassCard className="p-4">
      <h3 className="text-xl font-bold text-white mb-4">Selecione um Horário</h3>
      
      {disabled ? (
        <div className="text-center py-4 text-white/60">
          Selecione uma data primeiro
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {slots.map((time) => (
            <Button
              key={time}
              variant={selectedSlot === time ? "default" : "outline"}
              className={`
                w-full justify-start ${
                  selectedSlot === time
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-black/20 border-white/10 hover:border-white/30 text-white"
                }
              `}
              onClick={() => onSelectSlot(time)}
            >
              <Clock className="h-4 w-4 mr-2" />
              {time}
            </Button>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

export default TimeSlots;
