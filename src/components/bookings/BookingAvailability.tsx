
import React from 'react';
import { format } from 'date-fns';
import { Check, X, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface BookingAvailabilityProps {
  date: Date;
  bookingType: string;
  onSelectTime: (startTime: string, endTime: string) => void;
}

const BookingAvailability: React.FC<BookingAvailabilityProps> = ({
  date,
  bookingType,
  onSelectTime,
}) => {
  const timeSlots: TimeSlot[] = [
    { time: '09:00', isAvailable: true },
    { time: '10:00', isAvailable: true },
    { time: '11:00', isAvailable: false },
    { time: '12:00', isAvailable: true },
    { time: '13:00', isAvailable: true },
    { time: '14:00', isAvailable: true },
    { time: '15:00', isAvailable: false },
    { time: '16:00', isAvailable: true },
    { time: '17:00', isAvailable: true },
  ];

  const handleTimeSelect = (startTime: string) => {
    // For now, let's assume each slot is 1 hour
    const [hours, minutes] = startTime.split(':');
    const endHour = String(Number(hours) + 1).padStart(2, '0');
    const endTime = `${endHour}:${minutes}`;
    onSelectTime(startTime, endTime);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">
        Horários Disponíveis para {format(date, 'dd/MM/yyyy')}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.isAvailable && handleTimeSelect(slot.time)}
            disabled={!slot.isAvailable}
            className={`p-3 rounded-lg flex items-center justify-between ${
              slot.isAvailable
                ? 'bg-black/20 hover:bg-white/10 border border-white/10'
                : 'bg-red-900/20 border border-red-900/20 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{slot.time}</span>
            </div>
            {slot.isAvailable ? (
              <Badge variant="secondary" className="bg-green-600/20">
                <Check className="h-3 w-3 mr-1" />
                Disponível
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-900/20">
                <X className="h-3 w-3 mr-1" />
                Ocupado
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingAvailability;
