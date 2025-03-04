
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Booking, 
  BookingType, 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  updateBooking, 
  cancelBooking,
  checkAvailability,
  calculateBookingPrice
} from '@/services/bookingsService';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Query para buscar as reservas do usuário
  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await getUserBookings();
      if (error) throw new Error(error);
      return data;
    }
  });

  // Mutation para criar uma nova reserva
  const createBookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  // Mutation para atualizar uma reserva
  const updateBookingMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Booking> }) => 
      updateBooking(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  // Mutation para cancelar uma reserva
  const cancelBookingMutation = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  // Função para calcular o preço da reserva
  const calculatePrice = (bookingType: BookingType, startTime: string, endTime: string): number => {
    return calculateBookingPrice(bookingType, startTime, endTime);
  };

  // Função para verificar disponibilidade
  const checkAvailabilityFn = async (startTime: string, endTime: string, bookingType: BookingType) => {
    return await checkAvailability(startTime, endTime, bookingType);
  };

  return {
    bookings,
    isLoadingBookings,
    bookingsError,
    refetchBookings,
    createBooking: createBookingMutation.mutateAsync,
    updateBooking: updateBookingMutation.mutateAsync,
    cancelBooking: cancelBookingMutation.mutateAsync,
    isCreating: createBookingMutation.isPending,
    isUpdating: updateBookingMutation.isPending,
    isCancelling: cancelBookingMutation.isPending,
    calculatePrice,
    checkAvailability: checkAvailabilityFn
  };
};

export const useBookingDetails = (bookingId?: string) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getBookingById(bookingId);
        
        if (error) {
          setError(error);
        } else if (data) {
          setBooking(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  return { booking, isLoading, error };
};
