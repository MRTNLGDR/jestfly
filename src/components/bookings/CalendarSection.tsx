
import React from 'react';
import GlassCalendar from '../GlassCalendar';

interface CalendarSectionProps {
  bookingType: 'dj' | 'studio' | 'consultation';
  selectedDate: Date;
  handleDateSelect: (date: Date) => void;
  getGradientClass: () => string;
}

const CalendarSection: React.FC<CalendarSectionProps> = ({
  bookingType,
  selectedDate,
  handleDateSelect,
  getGradientClass
}) => {
  return (
    <div className={`glass-morphism rounded-xl border-t border-l border-white/20 p-6 mb-8 bg-gradient-to-br ${getGradientClass()}`}>
      <GlassCalendar 
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        bookingType={bookingType}
      />
    </div>
  );
};

export default CalendarSection;
