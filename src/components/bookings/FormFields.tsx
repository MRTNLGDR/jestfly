
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BookingFormData } from '@/types/booking';

interface TextFieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
  placeholder: string;
  description?: string;
  className?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
  className = "bg-black/20 border-white/10",
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
              className={className}
              value={field.value || ''}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface TextAreaFieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
  placeholder: string;
  description?: string;
  className?: string;
  minHeight?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  description,
  className = "bg-black/20 border-white/10",
  minHeight = "120px",
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
              className={`min-h-[${minHeight}] ${className}`}
              value={field.value || ''}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-white/60">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
