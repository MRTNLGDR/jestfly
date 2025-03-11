
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';
import { useBookingsActions, BookingFormData } from '@/hooks/useBookingsActions';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const bookingFormSchema = z.object({
  bookingType: z.enum(['dj', 'studio', 'consulting'], {
    required_error: 'Selecione o tipo de reserva',
  }),
  date: z.date({
    required_error: 'Selecione uma data para a reserva',
  }).refine(date => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'A data deve ser hoje ou futura',
  }),
  startTime: z.string({
    required_error: 'Selecione o horário de início',
  }),
  endTime: z.string({
    required_error: 'Selecione o horário de término',
  }),
  details: z.string().min(10, 'Forneça detalhes sobre sua reserva (mínimo 10 caracteres)'),
  location: z.string().optional(),
  contactName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  contactEmail: z.string().email('Email inválido'),
  contactPhone: z.string().optional(),
});

const BookingForm: React.FC = () => {
  const { user } = useAuth();
  const { createBooking, isSubmitting } = useBookingsActions();
  const [selectedType, setSelectedType] = useState<string>('');
  const [step, setStep] = useState(1);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookingType: undefined,
      date: undefined,
      startTime: '',
      endTime: '',
      details: '',
      location: '',
      contactName: user?.display_name || '',
      contactEmail: user?.email || '',
      contactPhone: '',
    },
  });

  const typeOptions = [
    { value: 'dj', label: 'DJ para Evento', price: 'R$ 250/hora', icon: '🎧', description: 'Reserve um DJ para seu evento' },
    { value: 'studio', label: 'Sessão de Estúdio', price: 'R$ 150/hora', icon: '🎵', description: 'Reserve tempo no nosso estúdio profissional' },
    { value: 'consulting', label: 'Consultoria', price: 'R$ 200/hora', icon: '📊', description: 'Agende uma consultoria personalizada' },
  ];

  const timeOptions = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9; // 9h às 21h
    return {
      value: `${hour}:00`,
      label: `${hour}:00`,
    };
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast.error('Você precisa estar logado para fazer uma reserva');
      return;
    }

    try {
      await createBooking.mutateAsync(data);
      form.reset();
      setStep(1);
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    form.setValue('bookingType', value as BookingFormData['bookingType']);
  };

  const nextStep = () => {
    if (step === 1 && !form.getValues('bookingType')) {
      form.setError('bookingType', { message: 'Selecione o tipo de reserva' });
      return;
    }
    
    if (step === 2 && !form.getValues('date')) {
      form.setError('date', { message: 'Selecione uma data' });
      return;
    }
    
    if (step === 3) {
      const startTime = form.getValues('startTime');
      const endTime = form.getValues('endTime');
      
      if (!startTime) {
        form.setError('startTime', { message: 'Selecione o horário de início' });
        return;
      }
      
      if (!endTime) {
        form.setError('endTime', { message: 'Selecione o horário de término' });
        return;
      }
      
      // Validar que o horário de término é posterior ao de início
      const [startHour] = startTime.split(':').map(Number);
      const [endHour] = endTime.split(':').map(Number);
      
      if (endHour <= startHour) {
        form.setError('endTime', { message: 'Horário de término deve ser após o início' });
        return;
      }
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const selectedOption = typeOptions.find(option => option.value === selectedType);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Fazer uma Reserva</CardTitle>
        <CardDescription className="text-white/70">
          Reserve um DJ para seu evento, tempo no estúdio ou uma consultoria personalizada
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                    step === i 
                      ? "bg-primary text-white" 
                      : step > i 
                        ? "bg-primary/30 text-white" 
                        : "bg-white/10 text-white/50"
                  )}
                >
                  {i}
                </div>
                <span className={cn(
                  "text-xs mt-1",
                  step === i ? "text-white" : "text-white/50"
                )}>
                  {i === 1 ? 'Tipo' : i === 2 ? 'Data' : i === 3 ? 'Horário' : 'Detalhes'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-[2px] bg-white/10 relative mt-4">
            <div 
              className="h-[2px] bg-primary absolute top-0 left-0 transition-all"
              style={{ width: `${(step - 1) * 33.33}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-4">
                  <h3 className="text-white text-lg font-medium">Selecione o tipo de reserva</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {typeOptions.map(option => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleTypeChange(option.value)}
                        className={cn(
                          "relative p-4 rounded-lg text-left transition-all h-full min-h-[140px]",
                          selectedType === option.value
                            ? "bg-primary/20 border-2 border-primary"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <div className="text-2xl mb-2">{option.icon}</div>
                        <h4 className="text-white font-medium">{option.label}</h4>
                        <p className="text-white/60 text-sm mt-1">{option.description}</p>
                        <div className="absolute bottom-2 right-2 text-sm font-medium text-primary">
                          {option.price}
                        </div>
                      </button>
                    ))}
                  </div>
                  {form.formState.errors.bookingType && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.bookingType.message}</p>
                  )}
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Selecione a data</h3>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="glass"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-white/50"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/10" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            className="bg-zinc-950"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Selecione o horário</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Horário de início</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-black/30 border-white/10 text-white">
                              <SelectValue placeholder="Selecione o horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-950 border-white/10">
                            {timeOptions.slice(0, -1).map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Horário de término</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-black/30 border-white/10 text-white">
                              <SelectValue placeholder="Selecione o horário" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-zinc-950 border-white/10">
                            {timeOptions.slice(1).map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-white text-lg font-medium mb-4">Informações de contato</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nome completo</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-black/30 border-white/10 text-white"
                              placeholder="Seu nome completo"
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
                          <FormLabel className="text-white">Email</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-black/30 border-white/10 text-white"
                              placeholder="seu@email.com"
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
                          <FormLabel className="text-white">Telefone (opcional)</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-black/30 border-white/10 text-white"
                              placeholder="(00) 00000-0000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Separator className="bg-white/10" />
                
                <div>
                  <h3 className="text-white text-lg font-medium mb-4">Detalhes da reserva</h3>
                  <div className="space-y-4">
                    {selectedType === 'dj' && (
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Local do evento</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-black/30 border-white/10 text-white"
                                placeholder="Endereço completo do evento"
                              />
                            </FormControl>
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
                          <FormLabel className="text-white">
                            Detalhes adicionais
                            {selectedType === 'dj' && ' (tipo de evento, preferências musicais, etc)'}
                            {selectedType === 'studio' && ' (o que você planeja gravar, equipamentos necessários, etc)'}
                            {selectedType === 'consulting' && ' (assunto a ser tratado, objetivos, etc)'}
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="bg-black/30 border-white/10 text-white h-32"
                              placeholder="Forneça detalhes para que possamos melhor atender sua necessidade"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Resumo da Reserva</h4>
                      <p className="text-white/70 text-sm mt-1">
                        {selectedOption?.label} em {form.getValues('date') && format(form.getValues('date'), "dd/MM/yyyy")} 
                        {form.getValues('startTime') && form.getValues('endTime') && 
                          ` das ${form.getValues('startTime')} às ${form.getValues('endTime')}`}
                      </p>
                      <p className="text-primary font-medium text-sm mt-1">
                        {selectedOption?.price} • Pagamento após aprovação
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Voltar
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 4 ? (
                <Button 
                  type="button"
                  onClick={nextStep}
                >
                  Próximo
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
