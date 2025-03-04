
import React, { useState } from 'react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';

interface BookingFormProps {
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
  bookingType: string;
  onBookingSubmit: (formData: BookingFormData) => Promise<void>;
}

export interface BookingFormData {
  date: Date;
  timeSlot: string;
  type: string;
  notes: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTimeSlot,
  bookingType,
  onBookingSubmit
}) => {
  const { profile } = useAuth();
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date for display
  const formattedDate = selectedDate 
    ? format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot || !bookingType) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onBookingSubmit({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        type: bookingType,
        notes
      });
      
      // Reset form
      setNotes('');
    } catch (error) {
      console.error('Error submitting booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedDate || !selectedTimeSlot) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-white/70">
          <p>Selecione uma data e horário para continuar.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">Confirmar Reserva</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/80 mb-1">Data</label>
            <div className="p-2 bg-black/20 border border-purple-500/20 rounded text-white">
              {formattedDate}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-white/80 mb-1">Horário</label>
            <div className="p-2 bg-black/20 border border-purple-500/20 rounded text-white">
              {selectedTimeSlot}
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm text-white/80 mb-1">Tipo de Reserva</label>
          <div className="p-2 bg-black/20 border border-purple-500/20 rounded text-white capitalize">
            {bookingType === 'dj' ? 'DJ para Evento' : 
             bookingType === 'studio' ? 'Sessão de Estúdio' : 
             bookingType === 'consultation' ? 'Consultoria' : bookingType}
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm text-white/80 mb-1">
            Observações
          </label>
          <Textarea
            id="notes"
            placeholder="Informe detalhes adicionais sobre sua reserva..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-24 backdrop-blur-sm bg-white/5 border-purple-500/30 text-white"
          />
        </div>
        
        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Confirmar Reserva'}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};

export default BookingForm;
