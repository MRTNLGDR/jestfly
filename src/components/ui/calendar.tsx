
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarPrimitive } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

// Create a new calendar component
const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof CalendarPrimitive>) => (
  <CalendarPrimitive
    showOutsideDays={showOutsideDays}
    className={cn("p-3", className)}
    classNames={{
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-sm font-medium text-white",
      nav: "space-x-1 flex items-center",
      nav_button: cn(
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      ),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
      row: "flex w-full mt-2",
      cell: cn(
        "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
        "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
      ),
      day: cn(
        "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-purple-500/30 rounded-md flex items-center justify-center"
      ),
      day_selected:
        "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
      day_today: "bg-accent text-accent-foreground",
      day_outside: "text-muted-foreground opacity-50",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle:
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible",
      ...classNames,
    }}
    {...props}
  />
);
Calendar.displayName = "Calendar";

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
        <Calendar
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

export { Calendar };
