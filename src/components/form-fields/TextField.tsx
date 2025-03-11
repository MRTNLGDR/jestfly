
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

interface TextFieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
  placeholder?: string;
}

export const TextField: React.FC<TextFieldProps> = ({ 
  form, 
  name, 
  label, 
  placeholder 
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
              placeholder={placeholder} 
              {...field} 
              value={field.value as string}
              className="bg-black/20 border-white/10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

