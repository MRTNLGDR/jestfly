
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { addDays, format, parse } from 'date-fns';

interface CreateBookingParams {
  bookingType: string;
  date: Date;
  timeSlot: string;
  notes?: string;
}

export const useBookings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  // Fetch available dates for booking
  const getAvailableDates = async (bookingType: string) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll generate some mock data
      
      // Get next 30 days
      const dates: Date[] = [];
      const today = new Date();
      
      // Generate about 15 random available dates in the next 30 days
      for (let i = 1; i <= 30; i++) {
        // Make about 50% of days available
        if (Math.random() > 0.5) {
          dates.push(addDays(today, i));
        }
      }
      
      setAvailableDates(dates);
    } catch (error) {
      console.error('Error fetching available dates:', error);
      toast({
        title: "Erro ao buscar datas",
        description: "Não foi possível carregar as datas disponíveis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch available time slots for a specific date
  const getAvailableTimeSlots = async (bookingType: string, date: Date) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would fetch from the database
      // For now, we'll generate some mock data
      
      // Generate time slots from 9:00 to 18:00
      const slots: string[] = [];
      const baseSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', 
        '14:00', '15:00', '16:00', '17:00', '18:00'
      ];
      
      // Randomly make some slots unavailable
      baseSlots.forEach(slot => {
        if (Math.random() > 0.3) {  // 70% chance of being available
          slots.push(slot);
        }
      });
      
      setAvailableTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      toast({
        title: "Erro ao buscar horários",
        description: "Não foi possível carregar os horários disponíveis.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new booking
  const createBooking = async ({ bookingType, date, timeSlot, notes }: CreateBookingParams) => {
    if (!profile) {
      toast({
        title: "Erro na reserva",
        description: "Você precisa estar logado para fazer uma reserva.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    setLoading(true);
    
    try {
      // Parse the timeSlot string into hours and minutes
      const [hours, minutes] = timeSlot.split(':').map(Number);
      
      // Create a new date with the selected date and time
      const startTime = new Date(date);
      startTime.setHours(hours, minutes, 0, 0);
      
      // Set end time to 1 hour later
      const endTime = new Date(startTime);
      endTime.setHours(endTime.getHours() + 1);
      
      // Calculate price based on booking type
      const price = bookingType === 'dj' ? 1500 : 
                    bookingType === 'studio' ? 200 : 
                    bookingType === 'consultation' ? 150 : 100;
      
      // Insert booking into database
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: profile.id,
          booking_type: bookingType,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          status: 'confirmed',
          price,
          notes: notes || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }
      
      // Format response
      return {
        id: data.id,
        date: format(startTime, 'yyyy-MM-dd'),
        timeSlot: format(startTime, 'HH:mm'),
        type: bookingType,
        status: data.status
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erro na reserva",
        description: "Não foi possível processar sua reserva. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's bookings
  const getUserBookings = async () => {
    if (!profile) {
      toast({
        title: "Erro ao buscar reservas",
        description: "Você precisa estar logado para ver suas reservas.",
        variant: "destructive",
      });
      throw new Error("User not authenticated");
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', profile.id)
        .order('start_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching user bookings:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      toast({
        title: "Erro ao buscar reservas",
        description: "Não foi possível carregar suas reservas.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    getUserBookings,
    getAvailableDates,
    getAvailableTimeSlots,
    loading,
    availableDates,
    availableTimeSlots
  };
};
