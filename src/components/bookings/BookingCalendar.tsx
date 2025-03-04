
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { GlassCard } from '@/components/ui/glass-card';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { DayContentProps } from 'react-day-picker';

interface BookingCalendarProps {
  availableDates: Date[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  availableDates,
  selectedDate,
  onSelectDate
}) => {
  // Format date for display
  const formatDay = (date: Date): string => {
    return format(date, 'd', { locale: pt });
  };

  // Check if a date is available
  const isDateAvailable = (date: Date): boolean => {
    return availableDates.some(availableDate => 
      availableDate.getDate() === date.getDate() &&
      availableDate.getMonth() === date.getMonth() &&
      availableDate.getFullYear() === date.getFullYear()
    );
  };

  // Custom Day component with proper types
  const MyDay = (props: DayContentProps) => {
    const { date } = props;
    if (!date) return null;
    
    const isAvailable = isDateAvailable(date);
    
    return (
      <div
        className={cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          !isAvailable && 'text-gray-400 cursor-not-allowed opacity-30',
          isAvailable && 'hover:bg-purple-500/20'
        )}
      >
        <button
          type="button"
          disabled={!isAvailable}
          className="w-full h-full"
          onClick={() => isAvailable && onSelectDate(date)}
        >
          {formatDay(date)}
        </button>
      </div>
    );
  };

  return (
    <GlassCard className="p-4">
      <h3 className="text-xl font-bold text-white mb-4">Selecione uma Data</h3>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        locale={pt}
        className="rounded-md border border-purple-500/20 bg-black/20 backdrop-blur-sm"
        modifiersClassNames={{
          selected: 'bg-purple-600 text-white hover:bg-purple-600 hover:text-white',
          today: 'bg-white/10 text-white',
        }}
        components={{
          Day: MyDay
        }}
      />
    </GlassCard>
  );
};

export default BookingCalendar;
