
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  selected?: Date;
  onSelect: (date?: Date) => void;
  className?: string;
  placeholder?: string;
}

export const DatePicker = ({
  selected,
  onSelect,
  className,
  placeholder = "Selecionar data"
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-white/70",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? format(selected, "PPP", { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black/90 border border-white/10" align="start">
        <CalendarComponent
          mode="single"
          selected={selected}
          onSelect={onSelect}
          locale={ptBR}
          className="rounded-md bg-black/70"
        />
      </PopoverContent>
    </Popover>
  );
};
