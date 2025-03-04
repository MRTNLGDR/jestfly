
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { BookingFormData } from '@/components/bookings/BookingForm';

export interface BookingType {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: string;
  date: string;
  time_slot: string;
  notes?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  id: string;
  resource_id: string;
  resource_type: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// Buscar tipos de reserva disponíveis
export const fetchBookingTypes = async (): Promise<{ data: BookingType[] | null, error: PostgrestError | null }> => {
  return await supabase
    .from('booking_types')
    .select('*')
    .order('price', { ascending: false });
};

// Buscar disponibilidade
export const fetchAvailableDates = async (
  resourceType: string, 
  startDate: Date, 
  endDate: Date
): Promise<{ data: Date[] | null, error: PostgrestError | null }> => {
  // Formatar datas para o formato ISO
  const formattedStartDate = startDate.toISOString();
  const formattedEndDate = endDate.toISOString();
  
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('resource_type', resourceType)
    .eq('is_available', true)
    .gte('start_time', formattedStartDate)
    .lte('end_time', formattedEndDate);
    
  if (error || !data) {
    return { data: null, error };
  }
  
  // Transformar em um array de datas
  const availableDates = data.map(slot => new Date(slot.start_time));
  return { data: availableDates, error: null };
};

// Buscar horários disponíveis para uma data específica
export const fetchAvailableTimeSlots = async (
  resourceType: string,
  date: Date
): Promise<{ data: string[] | null, error: PostgrestError | null }> => {
  // Formatar data para o formato ISO
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('resource_type', resourceType)
    .eq('is_available', true)
    .gte('start_time', startOfDay.toISOString())
    .lte('end_time', endOfDay.toISOString());
    
  if (error || !data) {
    return { data: null, error };
  }
  
  // Extrair apenas as horas dos timestamps
  const timeSlots = data.map(slot => {
    const date = new Date(slot.start_time);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  });
  
  return { data: timeSlots, error: null };
};

// Criar uma nova reserva
export const createBooking = async (
  userId: string,
  bookingData: BookingFormData
): Promise<{ data: Booking | null, error: PostgrestError | null }> => {
  // Converter a data e horário para o formato ISO
  const dateObj = new Date(bookingData.date);
  const [hours, minutes] = bookingData.timeSlot.split(':').map(Number);
  dateObj.setHours(hours, minutes, 0, 0);
  
  return await supabase
    .from('bookings')
    .insert({
      user_id: userId,
      booking_type: bookingData.type,
      date: dateObj.toISOString(),
      time_slot: bookingData.timeSlot,
      notes: bookingData.notes || '',
      status: 'pending'
    })
    .select()
    .single();
};

// Buscar reservas do usuário
export const fetchUserBookings = async (userId: string): Promise<{ data: Booking[] | null, error: PostgrestError | null }> => {
  return await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};

// Buscar detalhes de uma reserva específica
export const fetchBookingDetails = async (bookingId: string): Promise<{ data: Booking | null, error: PostgrestError | null }> => {
  return await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .maybeSingle();
};

// Cancelar uma reserva
export const cancelBooking = async (bookingId: string): Promise<{ data: Booking | null, error: PostgrestError | null }> => {
  return await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()
    .maybeSingle();
};
