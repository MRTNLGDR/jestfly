
import React from 'react';
import { format } from 'date-fns';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBookingsActions } from '@/hooks/useBookingsActions';

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  isOutsideHours?: boolean;
}

interface BookingAvailabilityProps {
  date: Date;
  bookingType: string;
  onSelectTime: (startTime: string, endTime: string) => void;
}

const BUSINESS_HOURS = {
  start: '09:00',
  end: '18:00'
};

const BookingAvailability: React.FC<BookingAvailabilityProps> = ({
  date,
  bookingType,
  onSelectTime,
}) => {
  const { checkAvailability } = useBookingsActions();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Function to check if a time is within business hours
  const isWithinBusinessHours = (time: string) => {
    return time >= BUSINESS_HOURS.start && time <= BUSINESS_HOURS.end;
  };

  // Generate time slots with availability status
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour < 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push({
        time,
        isAvailable: true,
        isOutsideHours: !isWithinBusinessHours(time)
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleTimeSelect = async (startTime: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, let's assume each slot is 1 hour
      const [hours, minutes] = startTime.split(':');
      const endHour = String(Number(hours) + 1).padStart(2, '0');
      const endTime = `${endHour}:${minutes}`;

      // Check if the selected time slot is within business hours
      if (!isWithinBusinessHours(startTime) || !isWithinBusinessHours(endTime)) {
        setError('Este horário está fora do horário comercial (9h às 18h)');
        return;
      }

      // Check availability in the backend
      const availability = await checkAvailability(date, bookingType);
      const isSlotAvailable = availability.some(slot => 
        slot.start_time.includes(startTime) && slot.is_available
      );

      if (!isSlotAvailable) {
        setError('Este horário não está mais disponível');
        return;
      }

      onSelectTime(startTime, endTime);
      setError(null);
    } catch (err) {
      setError('Erro ao verificar disponibilidade. Tente novamente.');
      console.error('Error checking availability:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">
        Horários Disponíveis para {format(date, 'dd/MM/yyyy')}
      </h3>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.isAvailable && !slot.isOutsideHours && handleTimeSelect(slot.time)}
            disabled={!slot.isAvailable || slot.isOutsideHours || loading}
            className={`p-3 rounded-lg flex items-center justify-between transition-colors ${
              slot.isOutsideHours
                ? 'bg-gray-900/20 border border-gray-900/20 cursor-not-allowed opacity-50'
                : slot.isAvailable
                ? 'bg-black/20 hover:bg-white/10 border border-white/10'
                : 'bg-red-900/20 border border-red-900/20 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{slot.time}</span>
            </div>
            {slot.isOutsideHours ? (
              <Badge variant="secondary" className="bg-gray-600/20">
                <X className="h-3 w-3 mr-1" />
                Fora do Horário
              </Badge>
            ) : slot.isAvailable ? (
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
