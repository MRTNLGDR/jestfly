
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { BookingFormData } from '@/types/booking';

interface FieldProps {
  form: UseFormReturn<BookingFormData>;
  name: keyof BookingFormData;
  label: string;
  placeholder?: string;
}

export const TextField: React.FC<FieldProps> = ({ 
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
              value={field.value as string} // Type assertion
              className="bg-black/20 border-white/10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const TextAreaField: React.FC<FieldProps> = ({ 
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
              value={field.value as string} // Type assertion
              className="min-h-[120px] bg-black/20 border-white/10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const SelectField: React.FC<FieldProps & { 
  options: { value: string; label: string }[] 
}> = ({ 
  form, 
  name, 
  label, 
  options 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value as string}
          >
            <FormControl>
              <SelectTrigger className="bg-black/20 border-white/10">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-black/90 border-white/10">
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="hover:bg-white/10"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export const DatePickerField: React.FC<FieldProps> = ({ 
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

export const TimeField: React.FC<FieldProps> = ({ 
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
              className="bg-black/20 border-white/10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
