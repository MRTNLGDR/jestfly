
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BookingFormData } from '@/types/booking';

interface TimeFieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
}

export const TimeField: React.FC<TimeFieldProps> = ({ 
  form, 
  name, 
  label 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type="time" 
              {...field} 
              value={typeof field.value === 'string' ? field.value : ''}
              className="bg-black/20 border-white/10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

