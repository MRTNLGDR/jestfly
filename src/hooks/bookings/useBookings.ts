
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { 
  fetchBookingTypes, 
  fetchAvailableDates, 
  fetchAvailableTimeSlots, 
  createBooking as createBookingService,
  fetchUserBookings,
  cancelBooking as cancelBookingService,
  BookingType
} from '@/services/bookingsService';
import { BookingFormData } from '@/components/bookings/BookingForm';

export const useBookings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { logSystemActivity } = useActivityLogger();
  
  const [bookingTypes, setBookingTypes] = useState<BookingType[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  
  // Buscar tipos de reserva disponíveis
  useEffect(() => {
    const loadBookingTypes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchBookingTypes();
        
        if (error) {
          console.error('Erro ao buscar tipos de reserva:', error);
          toast({
            title: 'Erro',
            description: 'Não foi possível carregar os tipos de reserva.',
            variant: 'destructive',
          });
          return;
        }
        
        if (data) {
          setBookingTypes(data);
        }
      } catch (error) {
        console.error('Erro ao buscar tipos de reserva:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookingTypes();
  }, [toast]);
  
  // Buscar datas disponíveis para um tipo de reserva
  const loadAvailableDates = async (resourceType: string) => {
    try {
      setIsLoading(true);
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // Buscar disponibilidade para os próximos 30 dias
      
      const { data, error } = await fetchAvailableDates(resourceType, startDate, endDate);
      
      if (error) {
        console.error('Erro ao buscar datas disponíveis:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as datas disponíveis.',
          variant: 'destructive',
        });
        return;
      }
      
      if (data) {
        setAvailableDates(data);
      } else {
        // Se não houver dados disponíveis, gerar algumas datas para demonstração
        const mockDates = getMockAvailableDates();
        setAvailableDates(mockDates);
      }
    } catch (error) {
      console.error('Erro ao buscar datas disponíveis:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar horários disponíveis para uma data específica
  const loadAvailableTimeSlots = async (resourceType: string, date: Date) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await fetchAvailableTimeSlots(resourceType, date);
      
      if (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os horários disponíveis.',
          variant: 'destructive',
        });
        return;
      }
      
      if (data && data.length > 0) {
        setTimeSlots(data);
      } else {
        // Se não houver dados disponíveis, gerar alguns horários para demonstração
        setTimeSlots([
          '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Buscar reservas do usuário
  const loadUserBookings = async () => {
    if (!profile?.id) return;
    
    try {
      setIsLoading(true);
      
      const { data, error } = await fetchUserBookings(profile.id);
      
      if (error) {
        console.error('Erro ao buscar reservas do usuário:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar suas reservas.',
          variant: 'destructive',
        });
        return;
      }
      
      if (data) {
        setUserBookings(data);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Criar uma nova reserva
  const createBooking = async (formData: BookingFormData) => {
    if (!profile?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para fazer uma reserva.',
        variant: 'destructive',
      });
      return null;
    }
    
    try {
      setIsCreating(true);
      
      const { data, error } = await createBookingService(profile.id, formData);
      
      if (error) {
        console.error('Erro ao criar reserva:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível processar sua reserva. Tente novamente.',
          variant: 'destructive',
        });
        return null;
      }
      
      if (data) {
        toast({
          title: 'Reserva confirmada!',
          description: 'Sua reserva foi realizada com sucesso.',
        });
        
        // Log da atividade
        logSystemActivity('Realizou uma reserva', { booking_type: formData.type });
        
        // Atualizar lista de reservas do usuário
        loadUserBookings();
        
        return data;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível processar sua reserva. Tente novamente.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsCreating(false);
    }
  };
  
  // Cancelar uma reserva
  const cancelBooking = async (bookingId: string) => {
    try {
      setIsCancelling(true);
      
      const { data, error } = await cancelBookingService(bookingId);
      
      if (error) {
        console.error('Erro ao cancelar reserva:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível cancelar sua reserva. Tente novamente.',
          variant: 'destructive',
        });
        return false;
      }
      
      if (data) {
        toast({
          title: 'Reserva cancelada',
          description: 'Sua reserva foi cancelada com sucesso.',
        });
        
        // Log da atividade
        logSystemActivity('Cancelou uma reserva', { booking_id: bookingId });
        
        // Atualizar lista de reservas do usuário
        loadUserBookings();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível cancelar sua reserva. Tente novamente.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsCancelling(false);
    }
  };
  
  // Mock function to generate available dates (7 days from today)
  const getMockAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      // Make some days unavailable (e.g., weekends)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  return {
    bookingTypes,
    availableDates,
    timeSlots,
    userBookings,
    isLoading,
    isCreating,
    isCancelling,
    loadAvailableDates,
    loadAvailableTimeSlots,
    loadUserBookings,
    createBooking,
    cancelBooking
  };
};
