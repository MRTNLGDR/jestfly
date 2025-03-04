
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import Loading from '@/components/ui/loading';
import BookingType, { BookingTypeItem } from '@/components/bookings/BookingType';
import BookingCalendar from '@/components/bookings/BookingCalendar';
import TimeSlots from '@/components/bookings/TimeSlots';
import BookingForm, { BookingFormData } from '@/components/bookings/BookingForm';
import BookingConfirmation from '@/components/bookings/BookingConfirmation';

type BookingStep = 'type' | 'date' | 'time' | 'form' | 'confirmation';

// Mock function to generate available dates (7 days from today)
const getMockAvailableDates = (): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= 14; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Make some days unavailable (e.g., weekends)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date);
    }
  }
  
  return dates;
};

// Mock function to generate available time slots
const getMockAvailableTimeSlots = (): string[] => {
  return [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
};

// Mock booking types
const mockBookingTypes: BookingTypeItem[] = [
  {
    id: 'dj',
    name: 'DJ para Eventos',
    icon: <div className="text-purple-400">🎵</div>,
    description: 'Contrate DJs profissionais para seu evento, com equipamento de som incluso.',
    price: 1500
  },
  {
    id: 'studio',
    name: 'Sessão de Estúdio',
    icon: <div className="text-yellow-400">⭐</div>,
    description: 'Reserve nosso estúdio profissional para gravações, mixagens e masterizações.',
    price: 800
  },
  {
    id: 'consultoria',
    name: 'Consultoria Musical',
    icon: <div className="text-blue-400">👥</div>,
    description: 'Consultoria personalizada para artistas e produtores musicais.',
    price: 500
  }
];

const BookingsPage = () => {
  const { profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { logSystemActivity } = useActivityLogger();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>('type');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Log visit to this page
  useEffect(() => {
    logSystemActivity('Acessou página de reservas');
  }, [logSystemActivity]);
  
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
  
  // Generate mock available dates
  useEffect(() => {
    if (selectedType) {
      // Simulate fetching available dates
      setTimeout(() => {
        setAvailableDates(getMockAvailableDates());
      }, 500);
    }
  }, [selectedType]);
  
  // Get available time slots for selected date
  useEffect(() => {
    if (selectedDate && selectedType) {
      // Simulate fetching available time slots
      setTimeout(() => {
        setAvailableTimeSlots(getMockAvailableTimeSlots());
      }, 500);
    }
  }, [selectedDate, selectedType]);
  
  // Handle booking submission
  const handleBookingSubmit = async (formData: BookingFormData) => {
    try {
      setIsCreating(true);
      
      // Simulate API call
      await new Promise(r => setTimeout(r, 1500));
      
      const result = {
        id: `booking-${Date.now()}`,
        type: formData.type,
        date: formData.date,
        timeSlot: formData.timeSlot,
        notes: formData.notes,
        status: 'confirmed'
      };
      
      setConfirmedBooking(result);
      setCurrentStep('confirmation');
      
      toast({
        title: "Reserva confirmada!",
        description: "Sua reserva foi realizada com sucesso.",
      });
      
      // Log the booking action
      logSystemActivity(
        'Realizou uma reserva', 
        { booking_type: formData.type }
      );
      
      setIsCreating(false);
      return result;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erro na reserva",
        description: "Não foi possível processar sua reserva. Tente novamente.",
        variant: "destructive",
      });
      setIsCreating(false);
      throw error;
    }
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
  if (authLoading) {
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
            bookingType={mockBookingTypes.find(type => type.id === selectedType)}
            selectedType={selectedType} 
            onSelectType={setSelectedType} 
          />
        )}
        
        {currentStep === 'date' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BookingType 
              bookingType={mockBookingTypes.find(type => type.id === selectedType)}
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
                availableSlots={availableTimeSlots}
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
