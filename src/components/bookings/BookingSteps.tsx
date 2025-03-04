
import React from 'react';
import { BookingStep } from './BookingProgress';
import BookingType from './BookingType';
import BookingCalendar from './BookingCalendar';
import TimeSlots from './TimeSlots';
import BookingForm from './BookingForm';
import BookingConfirmation from './BookingConfirmation';
import { BookingFormData } from './BookingForm';

interface BookingTypeItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  description: string;
}

interface BookingStepsProps {
  currentStep: BookingStep;
  bookingTypes: BookingTypeItem[];
  selectedType: string;
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
  availableDates: Date[];
  timeSlots: string[];
  confirmedBooking: any;
  onSelectType: (type: string) => void;
  onSelectDate: (date: Date | undefined) => void;
  onSelectTimeSlot: (timeSlot: string) => void;
  onBookingSubmit: (formData: BookingFormData) => Promise<any>;
  resetBooking: () => void;
}

const BookingSteps: React.FC<BookingStepsProps> = ({
  currentStep,
  bookingTypes,
  selectedType,
  selectedDate,
  selectedTimeSlot,
  availableDates,
  timeSlots,
  confirmedBooking,
  onSelectType,
  onSelectDate,
  onSelectTimeSlot,
  onBookingSubmit,
  resetBooking
}) => {
  // Get current booking type object based on selectedType
  const currentBookingType = bookingTypes.find(type => type.id === selectedType);
  
  return (
    <>
      {currentStep === 'type' && (
        <BookingType 
          bookingType={currentBookingType}
          selectedType={selectedType} 
          onSelectType={onSelectType} 
        />
      )}
      
      {currentStep === 'date' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BookingType 
            bookingType={currentBookingType}
            selectedType={selectedType} 
            onSelectType={onSelectType} 
          />
          
          <BookingCalendar 
            availableDates={availableDates}
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
          />
        </div>
      )}
      
      {currentStep === 'time' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookingCalendar 
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
            />
            
            <TimeSlots 
              availableSlots={timeSlots}
              selectedSlot={selectedTimeSlot}
              onSelectSlot={onSelectTimeSlot}
              disabled={!selectedDate}
            />
          </div>
        </div>
      )}
      
      {currentStep === 'form' && (
        <div className="grid grid-cols-1 gap-6">
          <BookingForm 
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            bookingType={selectedType}
            onBookingSubmit={onBookingSubmit}
          />
        </div>
      )}
      
      {currentStep === 'confirmation' && confirmedBooking && (
        <BookingConfirmation 
          booking={confirmedBooking}
          onClose={resetBooking}
        />
      )}
    </>
  );
};

export default BookingSteps;
