
import React, { useState } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useBookingsActions } from '@/hooks/useBookingsActions';
import BookingDetailsStep from './BookingDetailsStep';
import BookingContactStep from './BookingContactStep';
import { BookingFormData } from '@/types/booking';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  bookingType: z.enum(['dj', 'studio', 'consulting']),
  date: z.date(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  details: z.string().min(10, { message: "Por favor, forneça detalhes sobre sua reserva" }),
  location: z.string().optional(),
  contactName: z.string().min(2, { message: "Nome é obrigatório" }),
  contactEmail: z.string().email({ message: "Email inválido" }),
  contactPhone: z.string().optional(),
});

const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const { createBooking, isSubmitting } = useBookingsActions();
  const [step, setStep] = useState(1);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: 'dj',
      details: '',
      location: '',
      contactName: user?.email ? user.email.split('@')[0] : '',
      contactEmail: user?.email || '',
      contactPhone: '',
    },
  });

  const bookingType = form.watch('bookingType');
  
  async function onSubmit(values: BookingFormData) {
    try {
      await createBooking.mutateAsync(values);
      form.reset();
      setStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <BookingDetailsStep 
              form={form} 
              bookingType={bookingType} 
              onNext={() => setStep(2)} 
            />
          )}
          
          {step === 2 && (
            <BookingContactStep 
              form={form} 
              isSubmitting={isSubmitting} 
              onBack={() => setStep(1)} 
            />
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
