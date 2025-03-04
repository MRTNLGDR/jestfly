
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

interface BookingData {
  id: string;
  date: string;
  timeSlot: string;
  type: string;
  status: string;
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
  const createBooking = async ({ bookingType, date, timeSlot, notes }: CreateBookingParams): Promise<BookingData> => {
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
      
      // Insert booking into database - in a real implementation
      // For now, we'll mock a successful response
      const mockBookingData = {
        id: Math.random().toString(36).substring(2, 15),
        date: format(startTime, 'yyyy-MM-dd'),
        timeSlot: format(startTime, 'HH:mm'),
        type: bookingType,
        status: 'confirmed'
      };
      
      return mockBookingData;
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
      // In a real implementation, this would fetch from the database
      // For now, we'll return mock data
      const mockBookings = [
        {
          id: "booking1",
          user_id: profile.id,
          booking_type: "dj",
          start_time: new Date().toISOString(),
          end_time: new Date(Date.now() + 3600000).toISOString(),
          status: "confirmed",
          price: 1500,
          notes: "Birthday party",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "booking2",
          user_id: profile.id,
          booking_type: "studio",
          start_time: new Date(Date.now() + 86400000).toISOString(),
          end_time: new Date(Date.now() + 90000000).toISOString(),
          status: "pending",
          price: 200,
          notes: "Recording session",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockBookings;
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
