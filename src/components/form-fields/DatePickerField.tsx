
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { BookingFormData } from '@/types/booking';

interface DatePickerFieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({ 
  form, 
  name, 
  label 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full pl-3 text-left font-normal bg-black/20 border-white/10"
                >
                  {field.value ? (
                    format(field.value as Date, 'PPP')
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black/90 border-white/10">
              <Calendar
                mode="single"
                selected={field.value as Date}
                onSelect={field.onChange}
                initialFocus
                disabled={(date) => date < new Date()}
                className="border-white/10"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

