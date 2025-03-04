
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useBookings } from '@/hooks/bookings/useBookings';
import Loading from '@/components/ui/loading';
import BookingProgress, { BookingStep } from '@/components/bookings/BookingProgress';
import BookingSteps from '@/components/bookings/BookingSteps';
import BookingLoginRequired from '@/components/bookings/BookingLoginRequired';
import { BookingFormData } from '@/components/bookings/BookingForm';

const BookingsPage = () => {
  const { profile, loading: authLoading } = useAuth();
  const { logSystemActivity } = useActivityLogger();
  
  const {
    bookingTypes,
    availableDates,
    timeSlots,
    loadAvailableDates,
    loadAvailableTimeSlots,
    createBooking,
    isLoading,
    isCreating
  } = useBookings();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  
  // Log visit to this page
  useEffect(() => {
    logSystemActivity('Acessou página de reservas');
  }, [logSystemActivity]);
  
  // Load available dates when type is selected
  useEffect(() => {
    if (selectedType) {
      loadAvailableDates(selectedType);
    }
  }, [selectedType, loadAvailableDates]);
  
  // Load available time slots when date is selected
  useEffect(() => {
    if (selectedDate && selectedType) {
      loadAvailableTimeSlots(selectedType, selectedDate);
    }
  }, [selectedDate, selectedType, loadAvailableTimeSlots]);
  
  // Advance to the next step when selection is made
  useEffect(() => {
    if (selectedType && currentStep === 'type') {
      setCurrentStep('date');
    }
  }, [selectedType]);
  
  useEffect(() => {
    if (selectedDate && currentStep === 'date') {
      setCurrentStep('time');
    }
  }, [selectedDate]);
  
  useEffect(() => {
    if (selectedTimeSlot && currentStep === 'time') {
      setCurrentStep('form');
    }
  }, [selectedTimeSlot]);
  
  // Handle booking submission
  const handleBookingSubmit = async (formData: BookingFormData) => {
    const result = await createBooking(formData);
    
    if (result) {
      setConfirmedBooking(result);
      setCurrentStep('confirmation');
      return result;
    }
    
    return null;
  };
  
  // Reset booking flow
  const resetBooking = () => {
    setSelectedType('');
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setConfirmedBooking(null);
    setCurrentStep('type');
  };
  
  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loading text="Carregando..." />
        </div>
      </div>
    );
  }
  
  // Require login
  if (!profile) {
    return (
      <div className="container mx-auto py-12 px-4">
        <BookingLoginRequired />
      </div>
    );
  }
  
  // Create booking type items with required properties for the BookingType component
  const enhancedBookingTypes = bookingTypes.map(type => ({
    id: type.id,
    name: type.name,
    price: type.price,
    icon: <span className="text-purple-400">📅</span>,
    description: type.description
  }));
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Sistema de Reservas</h1>
        
        {/* Progress Steps */}
        <BookingProgress currentStep={currentStep} />
        
        {/* Booking Steps Content */}
        <BookingSteps
          currentStep={currentStep}
          bookingTypes={enhancedBookingTypes}
          selectedType={selectedType}
          selectedDate={selectedDate}
          selectedTimeSlot={selectedTimeSlot}
          availableDates={availableDates}
          timeSlots={timeSlots}
          confirmedBooking={confirmedBooking}
          onSelectType={setSelectedType}
          onSelectDate={setSelectedDate}
          onSelectTimeSlot={setSelectedTimeSlot}
          onBookingSubmit={handleBookingSubmit}
          resetBooking={resetBooking}
        />
      </div>
    </div>
  );
};

export default BookingsPage;
