
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { BookingFormData } from '@/types/booking';

interface TextAreaFieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
  placeholder?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
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
            <Textarea 
              placeholder={placeholder} 
              {...field} 
              value={field.value as string}
              className="min-h-[120px] bg-black/20 border-white/10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

