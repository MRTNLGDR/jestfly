
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useBookingsActions } from '@/hooks/useBookingsActions';
import { useAuth } from '@/hooks/auth/useAuth';
import { BookingFormData } from '@/types/booking';

const formSchema = z.object({
  bookingType: z.enum(['dj', 'studio', 'consulting']),
  date: z.date(),
  startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  details: z.string().min(10, { message: "Por favor, forneça detalhes sobre sua reserva" }),
  location: z.string().optional(),
  contactName: z.string().min(2, { message: "Nome é obrigatório" }),
  contactEmail: z.string().email({ message: "Email inválido" }),
  contactPhone: z.string().optional(),
});

const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const { createBooking, isSubmitting } = useBookingsActions();
  const [step, setStep] = useState(1);
  
  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: 'dj',
      details: '',
      location: '',
      contactName: user?.full_name || '',
      contactEmail: user?.email || '',
      contactPhone: '',
    },
  });

  const bookingType = form.watch('bookingType');
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createBooking.mutateAsync(values);
      form.reset();
      setStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-light text-white">Etapa 1: Detalhes da Reserva</h2>
              
              <FormField
                control={form.control}
                name="bookingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Reserva</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-black/20 border-white/10">
                          <SelectValue placeholder="Selecione o tipo de reserva" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black/80 border-white/10">
                        <SelectItem value="dj">Contratação de DJ</SelectItem>
                        <SelectItem value="studio">Sessão de Estúdio</SelectItem>
                        <SelectItem value="consulting">Consultoria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-white/60">
                      Escolha o tipo de serviço que deseja reservar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="bg-black/20 border-white/10 text-white w-full pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black/80 border-white/10" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="bg-black/80"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-white/60">
                      Selecione a data desejada para sua reserva
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Início</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="14:00" 
                          {...field} 
                          className="bg-black/20 border-white/10"
                        />
                      </FormControl>
                      <FormDescription className="text-white/60">
                        Formato 24h (ex: 14:00)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Término</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="16:00" 
                          {...field} 
                          className="bg-black/20 border-white/10"
                        />
                      </FormControl>
                      <FormDescription className="text-white/60">
                        Formato 24h (ex: 16:00)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {bookingType === 'dj' && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Local do Evento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Endereço completo do evento" 
                          {...field} 
                          className="bg-black/20 border-white/10"
                        />
                      </FormControl>
                      <FormDescription className="text-white/60">
                        Informe o endereço onde o DJ irá se apresentar
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalhes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os detalhes da sua reserva" 
                        {...field} 
                        className="min-h-[120px] bg-black/20 border-white/10"
                      />
                    </FormControl>
                    <FormDescription className="text-white/60">
                      {bookingType === 'dj' && "Informe detalhes como tipo de evento, público esperado, estilo musical desejado, etc."}
                      {bookingType === 'studio' && "Informe detalhes como tipo de gravação, instrumentos necessários, etc."}
                      {bookingType === 'consulting' && "Informe detalhes sobre o que deseja discutir na consultoria."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-2xl font-light text-white">Etapa 2: Informações de Contato</h2>
              
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome completo" 
                        {...field} 
                        className="bg-black/20 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        {...field} 
                        className="bg-black/20 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(00) 00000-0000" 
                        {...field} 
                        className="bg-black/20 border-white/10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="border-white/10 hover:bg-white/5"
                >
                  Voltar
                </Button>
                
                <Button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Reserva
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
