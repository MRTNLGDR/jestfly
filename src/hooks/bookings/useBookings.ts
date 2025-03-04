
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '@/hooks/auth/useAuthState';
import { toast } from 'sonner';
import { useActivityLogger } from '@/hooks/useActivityLogger';

interface Booking {
  id: string;
  user_id: string;
  booking_type: string;
  start_time: string;
  end_time: string;
  status: string;
  price: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingFormData {
  booking_type: string;
  date: Date;
  time_slot: string;
  duration: number;
  notes?: string;
}

export const useBookings = () => {
  const { user } = useAuthState();
  const queryClient = useQueryClient();
  const activityLogger = useActivityLogger();
  
  // Generate available dates (next 14 days)
  const getAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      
      // Skip weekends for this example
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };
  
  // Generate available time slots
  const getTimeSlots = (): string[] => {
    return [
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
    ];
  };
  
  // Get booking types
  const getBookingTypes = (): { id: string; name: string; price: number }[] => {
    return [
      { id: 'dj', name: 'DJ para Evento', price: 1500 },
      { id: 'studio', name: 'Sessão de Estúdio', price: 200 },
      { id: 'consultation', name: 'Consultoria', price: 150 },
    ];
  };
  
  // Fetch user bookings
  const { data: userBookings, isLoading: bookingsLoading, error: bookingsError, refetch: refetchBookings } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
  
  // Create a new booking
  const { mutate: createBooking, isPending: isCreating } = useMutation({
    mutationFn: async (formData: BookingFormData) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Convert date and time slot to start_time and end_time
      const [startHour, startMinute] = formData.time_slot.split(' - ')[0].split(':').map(Number);
      
      const startTime = new Date(formData.date);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + formData.duration);
      
      // Get price from booking type
      const bookingType = getBookingTypes().find(type => type.id === formData.booking_type);
      const price = bookingType?.price || 0;
      
      const bookingData = {
        user_id: user.id,
        booking_type: formData.booking_type,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price,
        notes: formData.notes || null,
        status: 'pending'
      };
      
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log the activity
      activityLogger.logSystemActivity(
        'create.booking',
        { entity_type: 'bookings', entity_id: data.id, booking_type: formData.booking_type }
      );
      
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      toast.success('Reserva criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
      toast.error('Erro ao criar reserva. Tente novamente.');
    }
  });
  
  // Cancel a booking
  const { mutate: cancelBooking, isPending: isCancelling } = useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log the activity
      activityLogger.logSystemActivity(
        'cancel.booking',
        { entity_type: 'bookings', entity_id: bookingId }
      );
      
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      toast.success('Reserva cancelada com sucesso!');
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      toast.error('Erro ao cancelar reserva. Tente novamente.');
    }
  });
  
  return {
    userBookings,
    bookingsLoading,
    bookingsError,
    refetchBookings,
    createBooking,
    isCreating,
    cancelBooking,
    isCancelling,
    availableDates: getAvailableDates(),
    timeSlots: getTimeSlots(),
    bookingTypes: getBookingTypes(),
  };
};
