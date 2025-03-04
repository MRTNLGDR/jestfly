
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookings } from "@/hooks/useBookings";
import { BookingType } from "@/services/bookingsService";

// Esquema de validação para o formulário
const bookingFormSchema = z.object({
  customer_name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  customer_email: z.string().email({ message: "Email inválido" }),
  customer_phone: z.string().optional(),
  date: z.string().min(1, { message: "Data é obrigatória" }),
  time: z.string().min(1, { message: "Hora é obrigatória" }),
  duration: z.string().min(1, { message: "Duração é obrigatória" }),
  location: z.string().optional(),
  details: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  bookingType: BookingType;
  onBookingComplete?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ bookingType, onBookingComplete }) => {
  const { createBooking, calculatePrice, checkAvailability, isCreating } = useBookings();
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Duração padrão em horas com base no tipo de reserva
  const defaultDurations = {
    dj: ["2", "3", "4", "6", "8"],
    studio: ["1", "2", "3", "4"],
    consultation: ["1", "2"]
  };

  // Inicializar o formulário
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      date: format(new Date(), "yyyy-MM-dd"),
      time: "18:00",
      duration: bookingType === 'dj' ? "4" : bookingType === 'studio' ? "2" : "1",
      location: "",
      details: "",
    },
  });
  
  const { watch, setValue } = form;
  const date = watch('date');
  const time = watch('time');
  const duration = watch('duration');

  // Atualizar o preço estimado quando a duração ou tipo de reserva mudar
  useEffect(() => {
    if (date && time && duration) {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 60 * 1000);
      const price = calculatePrice(
        bookingType, 
        startTime.toISOString(), 
        endTime.toISOString()
      );
      setEstimatedPrice(price);
    }
  }, [bookingType, date, time, duration, calculatePrice]);

  // Verificar disponibilidade quando data, hora ou duração mudar
  useEffect(() => {
    const checkTimeSlot = async () => {
      if (date && time && duration) {
        setIsCheckingAvailability(true);
        setAvailabilityMessage(null);
        
        try {
          const startTime = new Date(`${date}T${time}`);
          const endTime = new Date(startTime.getTime() + parseInt(duration) * 60 * 60 * 1000);
          
          // Verifica se a data é futura
          if (startTime < new Date()) {
            setAvailabilityMessage({
              type: 'error',
              message: 'Selecione uma data e hora futura.'
            });
            return;
          }
          
          const { available, error } = await checkAvailability(
            startTime.toISOString(),
            endTime.toISOString(),
            bookingType
          );
          
          if (available) {
            setAvailabilityMessage({
              type: 'success',
              message: 'Horário disponível!'
            });
          } else {
            setAvailabilityMessage({
              type: 'error',
              message: error || 'Horário indisponível.'
            });
          }
        } catch (error) {
          console.error('Erro ao verificar disponibilidade:', error);
          setAvailabilityMessage({
            type: 'error',
            message: 'Erro ao verificar disponibilidade.'
          });
        } finally {
          setIsCheckingAvailability(false);
        }
      }
    };
    
    // Debounce para não verificar disponibilidade a cada mudança
    const timeoutId = setTimeout(checkTimeSlot, 500);
    return () => clearTimeout(timeoutId);
  }, [bookingType, date, time, duration, checkAvailability]);

  // Função para submeter o formulário
  const onSubmit = async (values: BookingFormValues) => {
    if (availabilityMessage?.type === 'error') {
      toast.error('Por favor, escolha um horário disponível.');
      return;
    }

    try {
      const startTime = new Date(`${values.date}T${values.time}`);
      const endTime = new Date(startTime.getTime() + parseInt(values.duration) * 60 * 60 * 1000);
      
      const bookingData = {
        booking_type: bookingType,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        price: estimatedPrice || 0,
        status: 'pending',
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone,
        location: values.location,
        details: values.details
      };
      
      const result = await createBooking(bookingData);
      
      if (result.success) {
        toast.success('Reserva realizada com sucesso!');
        form.reset();
        if (onBookingComplete) {
          onBookingComplete();
        }
      }
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      toast.error('Ocorreu um erro ao criar a reserva. Por favor, tente novamente.');
    }
  };

  // Títulos e descrições baseados no tipo de reserva
  const bookingTypeInfo = {
    dj: {
      title: "Reserva de DJ",
      locationLabel: "Local do Evento",
      detailsLabel: "Detalhes do Evento"
    },
    studio: {
      title: "Reserva de Estúdio",
      locationLabel: "Estúdio",
      detailsLabel: "Detalhes do Projeto"
    },
    consultation: {
      title: "Reserva de Consultoria",
      locationLabel: "Método de Reunião",
      detailsLabel: "Assunto da Consultoria"
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="text-2xl font-bold">{bookingTypeInfo[bookingType].title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customer_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="customer_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone (opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (horas)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {defaultDurations[bookingType].map((hours) => (
                      <SelectItem key={hours} value={hours}>
                        {hours} {parseInt(hours) === 1 ? 'hora' : 'horas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {bookingType === 'consultation' ? (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{bookingTypeInfo[bookingType].locationLabel}</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="meet">Google Meet</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="presencial">Presencial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{bookingTypeInfo[bookingType].locationLabel}</FormLabel>
                  <FormControl>
                    <Input placeholder={`Informe o ${bookingTypeInfo[bookingType].locationLabel.toLowerCase()}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{bookingTypeInfo[bookingType].detailsLabel}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={`Detalhes sobre ${bookingType === 'dj' ? 'seu evento' : bookingType === 'studio' ? 'seu projeto musical' : 'a consultoria que você precisa'}`}
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Status de disponibilidade */}
        <div className="bg-white/5 p-4 rounded-lg border border-white/20">
          <h3 className="text-xl font-medium mb-2">Resumo da Reserva</h3>
          
          <div className="flex flex-col space-y-2">
            {isCheckingAvailability ? (
              <div className="flex items-center space-x-2 text-yellow-400">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Verificando disponibilidade...</span>
              </div>
            ) : availabilityMessage ? (
              <div className={`flex items-center space-x-2 ${
                availabilityMessage.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}>
                <span>{availabilityMessage.message}</span>
              </div>
            ) : null}
            
            {estimatedPrice !== null && (
              <div className="text-lg">
                <span className="font-semibold">Valor estimado:</span> R$ {estimatedPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>
        
        <Button
          type="submit"
          className={`w-full ${
            bookingType === 'dj' 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
              : bookingType === 'studio'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
              : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
          }`}
          disabled={isCreating || isCheckingAvailability || availabilityMessage?.type === 'error'}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : 'Confirmar Reserva'}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
