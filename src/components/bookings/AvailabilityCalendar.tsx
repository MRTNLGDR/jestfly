
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';

interface AvailabilityCalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  disabledDates?: Date[];
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  selectedDate,
  onSelect,
  disabledDates = []
}) => {
  // Define dias passados como desabilitados
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelect(date)}
        locale={ptBR}
        disabled={(date) => {
          // Desabilita datas passadas
          if (date < today) return true;
          
          // Desabilita datas específicas marcadas como indisponíveis
          return disabledDates.some(disabledDate => 
            disabledDate.getDate() === date.getDate() &&
            disabledDate.getMonth() === date.getMonth() &&
            disabledDate.getFullYear() === date.getFullYear()
          );
        }}
        className="border-none text-white"
      />
    </div>
  );
};

export default AvailabilityCalendar;
