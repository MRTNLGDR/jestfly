
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BookingType = 'dj' | 'studio' | 'consultation';

export interface Booking {
  id?: string;
  user_id?: string;
  booking_type: BookingType;
  start_time: string;
  end_time: string;
  price: number;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  location?: string;
  details?: string;
  notes?: string;
  resource_id?: string;
  resource_type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilitySlot {
  id: string;
  resource_id: string;
  resource_type: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// Função para criar uma nova reserva
export const createBooking = async (booking: Booking): Promise<{ success: boolean; data?: Booking; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;

    toast.success('Reserva realizada com sucesso!');
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao criar reserva:', error);
    toast.error(`Erro ao criar reserva: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Função para obter as reservas do usuário atual
export const getUserBookings = async (): Promise<{ data: Booking[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) throw error;

    return { data: data || [] };
  } catch (error: any) {
    console.error('Erro ao buscar reservas:', error);
    return { data: [], error: error.message };
  }
};

// Função para obter uma reserva específica
export const getBookingById = async (id: string): Promise<{ data?: Booking; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return { data };
  } catch (error: any) {
    console.error(`Erro ao buscar reserva ${id}:`, error);
    return { error: error.message };
  }
};

// Função para atualizar uma reserva
export const updateBooking = async (id: string, updates: Partial<Booking>): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    toast.success('Reserva atualizada com sucesso!');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar reserva:', error);
    toast.error(`Erro ao atualizar reserva: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Função para cancelar uma reserva
export const cancelBooking = async (id: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) throw error;

    toast.success('Reserva cancelada com sucesso!');
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao cancelar reserva:', error);
    toast.error(`Erro ao cancelar reserva: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Função para verificar disponibilidade
export const checkAvailability = async (
  start_time: string,
  end_time: string,
  booking_type: BookingType
): Promise<{ available: boolean; slots?: AvailabilitySlot[]; error?: string }> => {
  try {
    // Primeiro verificamos se há disponibilidade geral para este tipo
    const { data: availabilityData, error: availabilityError } = await supabase
      .from('availability')
      .select('*')
      .eq('resource_type', booking_type)
      .lte('start_time', start_time)
      .gte('end_time', end_time)
      .eq('is_available', true);

    if (availabilityError) throw availabilityError;

    // Depois verificamos se já existem reservas para este período
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_type', booking_type)
      .neq('status', 'cancelled')
      .or(`start_time.lte.${end_time},end_time.gte.${start_time}`);

    if (bookingsError) throw bookingsError;

    // Se não encontrarmos disponibilidade ou já existirem reservas, retornamos false
    if (!availabilityData || availabilityData.length === 0) {
      return { available: false, error: 'Não há disponibilidade para este período.' };
    }

    if (bookingsData && bookingsData.length > 0) {
      return { available: false, error: 'Este horário já está reservado.' };
    }

    return { available: true, slots: availabilityData };
  } catch (error: any) {
    console.error('Erro ao verificar disponibilidade:', error);
    return { available: false, error: error.message };
  }
};

// Função para obter os preços por tipo de reserva
export const getBookingPrices = (): Record<BookingType, number> => {
  return {
    dj: 1500, // Preço por hora para DJ
    studio: 800, // Preço por hora para estúdio
    consultation: 300 // Preço por hora para consultoria
  };
};

// Função para calcular o preço da reserva
export const calculateBookingPrice = (
  booking_type: BookingType,
  start_time: string,
  end_time: string
): number => {
  const prices = getBookingPrices();
  const startDate = new Date(start_time);
  const endDate = new Date(end_time);
  
  // Calculamos a duração em horas
  const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  
  // Arredondamos para o número mais próximo de horas, com mínimo de 1 hora
  const roundedHours = Math.max(1, Math.round(durationHours));
  
  return prices[booking_type] * roundedHours;
};
