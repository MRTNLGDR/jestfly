
import React from 'react';
import { Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface TimeSlotsProps {
  availableSlots: string[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string) => void;
  disabled: boolean;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  availableSlots,
  selectedSlot,
  onSelectSlot,
  disabled
}) => {
  if (disabled) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Horários Disponíveis</h3>
        <div className="text-center text-white/70 py-4">
          <Clock className="w-12 h-12 mx-auto mb-2 text-white/40" />
          <p>Selecione uma data para ver os horários disponíveis.</p>
        </div>
      </GlassCard>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Horários Disponíveis</h3>
        <div className="text-center text-white/70 py-4">
          <Clock className="w-12 h-12 mx-auto mb-2 text-white/40" />
          <p>Nenhum horário disponível para esta data.</p>
          <p className="text-sm mt-2">Por favor, selecione outra data.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">Horários Disponíveis</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {availableSlots.map((slot) => (
          <div
            key={slot}
            className={cn(
              "flex items-center justify-center p-3 rounded-lg border cursor-pointer text-center",
              selectedSlot === slot
                ? "border-purple-500 bg-purple-950/30 text-white"
                : "border-white/10 text-white/70 hover:border-purple-500/70 hover:text-white hover:bg-purple-950/10"
            )}
            onClick={() => onSelectSlot(slot)}
          >
            {slot}
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default TimeSlots;
