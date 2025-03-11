
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import { BookingFormData } from '@/types/booking';

interface BookingContactStepProps {
  form: UseFormReturn<BookingFormData>;
  isSubmitting: boolean;
  onBack: () => void;
}

const BookingContactStep: React.FC<BookingContactStepProps> = ({ form, isSubmitting, onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-light text-white">Etapa 2: Informações de Contato</h2>
      
      <ContactFormFields form={form} />
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
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
  );
};

export default BookingContactStep;

const ContactFormFields: React.FC<{ form: UseFormReturn<BookingFormData> }> = ({ form }) => {
  return (
    <>
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
    </>
  );
};
