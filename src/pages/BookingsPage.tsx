
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { useBookings } from '@/hooks/bookings/useBookings';
import Loading from '@/components/ui/loading';
import BookingType from '@/components/bookings/BookingType';
import BookingCalendar from '@/components/bookings/BookingCalendar';
import TimeSlots from '@/components/bookings/TimeSlots';
import BookingForm, { BookingFormData } from '@/components/bookings/BookingForm';
import BookingConfirmation from '@/components/bookings/BookingConfirmation';

type BookingStep = 'type' | 'date' | 'time' | 'form' | 'confirmation';

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
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">Sistema de Reservas</h1>
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Login Necessário</h2>
            <p className="text-white/70 mb-6">
              Para realizar reservas, é necessário estar logado no sistema.
            </p>
            <a 
              href="/auth" 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Faça Login
            </a>
          </div>
        </div>
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
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10"></div>
            
            {['type', 'date', 'time', 'form', 'confirmation'].map((step, index) => (
              <div 
                key={step}
                className={`flex flex-col items-center ${currentStep === step ? 'text-white' : (
                  ['type', 'date', 'time', 'form'].indexOf(currentStep) >= ['type', 'date', 'time', 'form'].indexOf(step as BookingStep) 
                    ? 'text-purple-400' 
                    : 'text-white/40'
                )}`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                    ${currentStep === step 
                      ? 'bg-purple-600 text-white' 
                      : (
                        ['type', 'date', 'time', 'form'].indexOf(currentStep) >= ['type', 'date', 'time', 'form'].indexOf(step as BookingStep) 
                          ? 'bg-purple-900/50 text-white' 
                          : 'bg-white/10 text-white/40'
                      )
                    }`}
                >
                  {index + 1}
                </div>
                <span className="text-sm hidden md:block">
                  {step === 'type' && 'Tipo'}
                  {step === 'date' && 'Data'}
                  {step === 'time' && 'Horário'}
                  {step === 'form' && 'Dados'}
                  {step === 'confirmation' && 'Confirmação'}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {currentStep === 'type' && (
          <BookingType 
            bookingType={enhancedBookingTypes.find(type => type.id === selectedType)}
            selectedType={selectedType} 
            onSelectType={setSelectedType} 
          />
        )}
        
        {currentStep === 'date' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookingType 
              bookingType={enhancedBookingTypes.find(type => type.id === selectedType)}
              selectedType={selectedType} 
              onSelectType={setSelectedType} 
            />
            
            <BookingCalendar 
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>
        )}
        
        {currentStep === 'time' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BookingCalendar 
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
              
              <TimeSlots 
                availableSlots={timeSlots}
                selectedSlot={selectedTimeSlot}
                onSelectSlot={setSelectedTimeSlot}
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
              onBookingSubmit={handleBookingSubmit}
            />
          </div>
        )}
        
        {currentStep === 'confirmation' && confirmedBooking && (
          <BookingConfirmation 
            booking={confirmedBooking}
            onClose={resetBooking}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
