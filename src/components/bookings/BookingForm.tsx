
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

// Define schema for form validation
const bookingFormSchema = z.object({
  notes: z.string().optional(),
  type: z.string(),
  date: z.date(),
  timeSlot: z.string(),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
  bookingType: string;
  onBookingSubmit: (data: BookingFormData) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  selectedDate,
  selectedTimeSlot,
  bookingType,
  onBookingSubmit
}) => {
  // Create form
  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      notes: '',
      type: bookingType,
      date: selectedDate,
      timeSlot: selectedTimeSlot || '',
    },
    values: {
      notes: '',
      type: bookingType,
      date: selectedDate || new Date(),
      timeSlot: selectedTimeSlot || '',
    }
  });

  // Handle form submission
  const onSubmit = (data: BookingFormData) => {
    onBookingSubmit(data);
  };

  // Format booking type for display
  const getBookingTypeLabel = (type: string): string => {
    switch (type) {
      case 'dj':
        return 'DJ para Evento';
      case 'studio':
        return 'Sessão de Estúdio';
      case 'consultation':
        return 'Consultoria';
      default:
        return type;
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">Confirmar Reserva</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Tipo de Reserva</h4>
                <p className="text-white font-medium">{getBookingTypeLabel(bookingType)}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Preço</h4>
                <p className="text-white font-medium">
                  {bookingType === 'dj' ? 'R$ 1.500,00' : 
                   bookingType === 'studio' ? 'R$ 200,00' : 
                   bookingType === 'consultation' ? 'R$ 150,00' : 'A definir'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Data</h4>
                <p className="text-white font-medium">
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ptBR }) : '-'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm text-white/60">Horário</h4>
                <p className="text-white font-medium">
                  {selectedTimeSlot || '-'}
                </p>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alguma informação adicional sobre a reserva..."
                      className="resize-none bg-black/30 border-white/10 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={!selectedDate || !selectedTimeSlot}
          >
            Confirmar Reserva
          </Button>
          
          <p className="text-xs text-white/50 text-center mt-4">
            Ao confirmar a reserva, você concorda com os termos e condições.
          </p>
        </form>
      </Form>
    </GlassCard>
  );
};

export default BookingForm;
