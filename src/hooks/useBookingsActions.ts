import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth/useAuth';
import { BookingFormData } from '@/types/booking';

export const useBookingsActions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar reservas do usuário
  const {
    data: bookings = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!user
  });

  // Criar nova reserva
  const createBooking = useMutation({
    mutationFn: async (formData: BookingFormData) => {
      if (!user) throw new Error('Usuário não autenticado');

      setIsSubmitting(true);

      try {
        // Converter data e hora para timestamp
        const startDate = new Date(formData.date);
        const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
        startDate.setHours(startHours, startMinutes);

        const endDate = new Date(formData.date);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes);

        // Calcular preço com base no tipo e duração (lógica simplificada)
        const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        let basePrice = 0;
        
        switch (formData.bookingType) {
          case 'dj':
            basePrice = 250; // R$ 250/hora para DJ
            break;
          case 'studio':
            basePrice = 150; // R$ 150/hora para estúdio
            break;
          case 'consulting':
            basePrice = 200; // R$ 200/hora para consultoria
            break;
        }
        
        const price = basePrice * durationHours;

        const { data, error } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            booking_type: formData.bookingType,
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
            details: formData.details,
            location: formData.location || null,
            customer_name: formData.contactName,
            customer_email: formData.contactEmail,
            customer_phone: formData.contactPhone || null,
            price,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        
        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: () => {
      toast.success('Reserva criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
      toast.error('Erro ao criar reserva. Por favor, tente novamente.');
    }
  });

  // Cancelar reserva
  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user.id) // Segurança adicional
        .select()
        .single();

      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      toast.success('Reserva cancelada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      console.error('Error cancelling booking:', error);
      toast.error('Erro ao cancelar reserva. Por favor, tente novamente.');
    }
  });

  // Verificar disponibilidade
  const checkAvailability = async (date: Date, bookingType: string) => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('resource_type', bookingType)
        .gte('start_time', `${formattedDate}T00:00:00`)
        .lte('start_time', `${formattedDate}T23:59:59`)
        .eq('is_available', true);

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Erro ao verificar disponibilidade.');
      return [];
    }
  };

  return {
    bookings,
    isLoading,
    error,
    isSubmitting,
    createBooking,
    cancelBooking,
    checkAvailability,
    refetch
  };
};
