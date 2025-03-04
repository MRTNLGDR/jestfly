
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useBookings } from '@/hooks/bookings/useBookings';
import BookingCalendar from './BookingCalendar';
import BookingType from './BookingType';
import TimeSlots from './TimeSlots';
import BookingConfirmation from './BookingConfirmation';

export interface BookingFormData {
  type: string;
  date: Date;
  timeSlot: string;
  notes?: string;
}

interface BookingFormProps {
  selectedDate?: Date;
  selectedTimeSlot?: string | null;
  bookingType?: string;
  onBookingSubmit: (formData: BookingFormData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate: initialDate,
  selectedTimeSlot: initialTimeSlot,
  bookingType: initialType,
  onBookingSubmit
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialTimeSlot || '');
  const [selectedType, setSelectedType] = useState<string>(initialType || '');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<number>(initialType ? (initialDate ? (initialTimeSlot ? 4 : 3) : 2) : 1);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [booking, setBooking] = useState<any>(null);

  const {
    availableDates,
    availableTimeSlots,
    bookingTypes,
    createBooking,
    isCreating
  } = useBookings();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedType) {
      return;
    }

    // Prepare form data
    const formData: BookingFormData = {
      type: selectedType,
      date: selectedDate,
      timeSlot: selectedTime,
      notes: notes
    };
    
    // Submit the form
    onBookingSubmit(formData);
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setStep(2);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep(3);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Step 1: Select booking type */}
        <div className={step === 1 ? "md:col-span-2 lg:col-span-3" : ""}>
          <BookingType
            bookingType={bookingTypes.find(t => t.id === selectedType)}
            selectedType={selectedType}
            onSelectType={handleTypeSelect}
          />
        </div>

        {/* Step 2: Select date */}
        {step >= 2 && (
          <div>
            <BookingCalendar
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />
          </div>
        )}

        {/* Step 3: Select time slot */}
        {step >= 3 && (
          <div>
            <TimeSlots
              availableSlots={availableTimeSlots}
              selectedSlot={selectedTime}
              onSelectSlot={handleTimeSelect}
            />
          </div>
        )}

        {/* Step 4: Additional information */}
        {step >= 4 && (
          <div>
            <GlassCard className="p-4">
              <h3 className="text-xl font-bold text-white mb-4">Informações Adicionais</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notes">Notas ou pedidos especiais</Label>
                  <Textarea
                    id="notes"
                    placeholder="Compartilhe detalhes importantes sobre sua reserva..."
                    className="bg-black/20 border-white/10 text-white resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={!selectedDate || !selectedTime || !selectedType || isCreating}
                >
                  {isCreating ? 'Processando...' : 'Confirmar Reserva'}
                </Button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </form>
  );
};

export default BookingForm;
