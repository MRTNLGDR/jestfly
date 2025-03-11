import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { BookingFormData } from '@/types/booking';
import BookingAvailability from './BookingAvailability';

interface BookingDetailsStepProps {
  form: UseFormReturn<BookingFormData>;
  bookingType: string;
  onNext: () => void;
}

const BookingDetailsStep: React.FC<BookingDetailsStepProps> = ({ form, bookingType, onNext }) => {
  const selectedDate = form.watch('date');
  const [timeError, setTimeError] = React.useState<string | null>(null);

  const handleTimeSelection = (startTime: string, endTime: string) => {
    setTimeError(null);
    form.setValue('startTime', startTime);
    form.setValue('endTime', endTime);
  };

  const handleNext = () => {
    if (!form.getValues('startTime') || !form.getValues('endTime')) {
      setTimeError('Por favor, selecione um horário para a reserva');
      return;
    }
    onNext();
  };

  return (
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
                  className={cn("p-3 pointer-events-auto")}
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

      {selectedDate && (
        <BookingAvailability
          date={selectedDate}
          bookingType={bookingType}
          onSelectTime={handleTimeSelection}
        />
      )}
      
      {timeError && (
        <div className="text-red-500 text-sm">{timeError}</div>
      )}
      
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
          onClick={handleNext}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

export default BookingDetailsStep;
