
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

// Função mock para tipos de reserva (temporário)
export const fetchBookingTypes = async (): Promise<{ data: BookingType[] | null, error: PostgrestError | null }> => {
  // Por enquanto, retornar dados simulados enquanto a tabela no Supabase é configurada
  const mockTypes: BookingType[] = [
    {
      id: 'dj',
      name: 'DJ para Evento',
      description: 'Contrate DJs profissionais para seu evento, com equipamento de som incluso.',
      price: 1500
    },
    {
      id: 'studio',
      name: 'Sessão de Estúdio',
      description: 'Reserve nosso estúdio profissional para gravações, mixagens e masterizações.',
      price: 800
    },
    {
      id: 'consultoria',
      name: 'Consultoria Musical',
      description: 'Consultoria personalizada para artistas e produtores musicais.',
      price: 500
    }
  ];
  
  return { data: mockTypes, error: null };
  
  // Quando a tabela booking_types estiver configurada no Supabase:
  // return await supabase
  //   .from('booking_types')
  //   .select('*')
  //   .order('price', { ascending: false });
};

// Função mock para disponibilidade (temporário)
export const fetchAvailableDates = async (
  resourceType: string, 
  startDate: Date, 
  endDate: Date
): Promise<{ data: Date[] | null, error: PostgrestError | null }> => {
  // Por enquanto, retornar dados simulados enquanto a tabela no Supabase é configurada
  const availableDates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    // Excluir fins de semana (0 = domingo, 6 = sábado)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      availableDates.push(new Date(currentDate));
    }
    
    // Avançar para o próximo dia
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return { data: availableDates, error: null };
  
  // Quando a tabela availability estiver configurada no Supabase:
  // // Formatar datas para o formato ISO
  // const formattedStartDate = startDate.toISOString();
  // const formattedEndDate = endDate.toISOString();
  // 
  // const { data, error } = await supabase
  //   .from('availability')
  //   .select('*')
  //   .eq('resource_type', resourceType)
  //   .eq('is_available', true)
  //   .gte('start_time', formattedStartDate)
  //   .lte('end_time', formattedEndDate);
  //   
  // if (error || !data) {
  //   return { data: null, error };
  // }
  // 
  // // Transformar em um array de datas
  // const availableDates = data.map(slot => new Date(slot.start_time));
  // return { data: availableDates, error: null };
};

// Função mock para horários disponíveis (temporário)
export const fetchAvailableTimeSlots = async (
  resourceType: string,
  date: Date
): Promise<{ data: string[] | null, error: PostgrestError | null }> => {
  // Por enquanto, retornar dados simulados enquanto a tabela no Supabase é configurada
  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  return { data: timeSlots, error: null };
  
  // Quando a tabela availability estiver configurada no Supabase:
  // // Formatar data para o formato ISO
  // const startOfDay = new Date(date);
  // startOfDay.setHours(0, 0, 0, 0);
  // 
  // const endOfDay = new Date(date);
  // endOfDay.setHours(23, 59, 59, 999);
  // 
  // const { data, error } = await supabase
  //   .from('availability')
  //   .select('*')
  //   .eq('resource_type', resourceType)
  //   .eq('is_available', true)
  //   .gte('start_time', startOfDay.toISOString())
  //   .lte('end_time', endOfDay.toISOString());
  //   
  // if (error || !data) {
  //   return { data: null, error };
  // }
  // 
  // // Extrair apenas as horas dos timestamps
  // const timeSlots = data.map(slot => {
  //   const date = new Date(slot.start_time);
  //   return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  // });
  // 
  // return { data: timeSlots, error: null };
};

// Criar uma nova reserva (temporário com mock)
export const createBooking = async (
  userId: string,
  bookingData: BookingFormData
): Promise<{ data: Booking | null, error: PostgrestError | null }> => {
  // Converter a data e horário para o formato ISO
  const dateObj = new Date(bookingData.date);
  const [hours, minutes] = bookingData.timeSlot.split(':').map(Number);
  dateObj.setHours(hours, minutes, 0, 0);
  
  // Por enquanto, retornar dados simulados enquanto a tabela no Supabase é configurada
  const mockBooking: Booking = {
    id: Math.random().toString(36).substr(2, 9),
    user_id: userId,
    booking_type: bookingData.type,
    date: dateObj.toISOString(),
    time_slot: bookingData.timeSlot,
    notes: bookingData.notes || '',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Simular um atraso para imitar uma solicitação de rede
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { data: mockBooking, error: null };
  
  // Quando a tabela bookings estiver configurada no Supabase:
  // return await supabase
  //   .from('bookings')
  //   .insert({
  //     user_id: userId,
  //     booking_type: bookingData.type,
  //     start_time: dateObj.toISOString(),
  //     end_time: new Date(dateObj.getTime() + 3600000).toISOString(), // +1 hora
  //     price: getBookingPrice(bookingData.type),
  //     notes: bookingData.notes || '',
  //     status: 'pending'
  //   })
  //   .select()
  //   .single();
};

// Buscar reservas do usuário (temporário com mock)
export const fetchUserBookings = async (userId: string): Promise<{ data: Booking[] | null, error: PostgrestError | null }> => {
  // Por enquanto, retornar dados simulados enquanto a tabela no Supabase é configurada
  const mockBookings: Booking[] = [
    {
      id: '1',
      user_id: userId,
      booking_type: 'dj',
      date: new Date().toISOString(),
      time_slot: '15:00',
      notes: 'Festa de aniversário',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  return { data: mockBookings, error: null };
  
  // Quando a tabela bookings estiver configurada no Supabase:
  // return await supabase
  //   .from('bookings')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('created_at', { ascending: false });
};

// Buscar detalhes de uma reserva específica
export const fetchBookingDetails = async (bookingId: string): Promise<{ data: Booking | null, error: PostgrestError | null }> => {
  // Por enquanto, retornar dados simulados
  const mockBooking: Booking = {
    id: bookingId,
    user_id: 'user-123',
    booking_type: 'dj',
    date: new Date().toISOString(),
    time_slot: '15:00',
    notes: 'Festa de aniversário',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return { data: mockBooking, error: null };
  
  // Quando a tabela bookings estiver configurada no Supabase:
  // return await supabase
  //   .from('bookings')
  //   .select('*')
  //   .eq('id', bookingId)
  //   .maybeSingle();
};

// Cancelar uma reserva
export const cancelBooking = async (bookingId: string): Promise<{ data: Booking | null, error: PostgrestError | null }> => {
  // Por enquanto, retornar dados simulados
  const mockBooking: Booking = {
    id: bookingId,
    user_id: 'user-123',
    booking_type: 'dj',
    date: new Date().toISOString(),
    time_slot: '15:00',
    notes: 'Festa de aniversário',
    status: 'cancelled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return { data: mockBooking, error: null };
  
  // Quando a tabela bookings estiver configurada no Supabase:
  // return await supabase
  //   .from('bookings')
  //   .update({ status: 'cancelled' })
  //   .eq('id', bookingId)
  //   .select()
  //   .maybeSingle();
};

// Função auxiliar para obter o preço de uma reserva (temporário)
const getBookingPrice = (type: string): number => {
  switch (type) {
    case 'dj':
      return 1500;
    case 'studio':
      return 800;
    case 'consultoria':
      return 500;
    default:
      return 0;
  }
};
