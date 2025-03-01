
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { toast } from "sonner";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  name: string;
  type: 'dj' | 'studio' | 'consultation';
  imageUrl: string;
}

interface GlassCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  bookingType: 'dj' | 'studio' | 'consultation';
}

const GlassCalendar: React.FC<GlassCalendarProps> = ({ 
  onDateSelect, 
  selectedDate,
  bookingType 
}) => {
  const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: addDays(new Date(), 1),
      time: '14:00',
      name: 'Festival Booking',
      type: 'dj',
      imageUrl: '/assets/dj-event.jpg'
    },
    {
      id: '2',
      date: addDays(new Date(), 3),
      time: '10:00',
      name: 'Studio Session',
      type: 'studio',
      imageUrl: '/assets/studio-session.jpg'
    },
    {
      id: '3',
      date: addDays(new Date(), 4),
      time: '16:30',
      name: 'Music Consultation',
      type: 'consultation',
      imageUrl: '/assets/consultation.jpg'
    }
  ]);
  
  // Get booking gradient based on type
  const getTypeGradient = (type: 'dj' | 'studio' | 'consultation') => {
    switch(type) {
      case 'dj':
        return 'bg-gradient-to-br from-purple-600/50 to-blue-600/50';
      case 'studio':
        return 'bg-gradient-to-br from-cyan-600/50 to-blue-600/50';
      case 'consultation':
        return 'bg-gradient-to-br from-pink-600/50 to-purple-600/50';
    }
  };

  // Generate calendar week days
  const getDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(currentWeek, i));
    }
    return days;
  };

  // Handle navigation between weeks
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));

  // Check if date has appointments
  const hasAppointment = (date: Date) => {
    return appointments.some(app => isSameDay(app.date, date));
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(app => isSameDay(app.date, date));
  };

  // Function to simulate connecting with Google Calendar
  const connectGoogleCalendar = () => {
    toast.success("Google Calendar connected successfully!");
    // In a real implementation, this would initiate OAuth flow
  };

  // Function to simulate booking appointment
  const bookAppointment = (date: Date) => {
    onDateSelect(date);
    toast.success(`Selected date: ${format(date, 'MMMM d, yyyy')}`);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-purple-400" />
          <h3 className="text-xl font-semibold text-gradient">Booking Calendar</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={connectGoogleCalendar}
            className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-md hover:bg-white/20 transition-all duration-300"
          >
            <img src="/assets/google-calendar.svg" alt="Google Calendar" className="w-5 h-5" />
            <span>Sync with Google</span>
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={prevWeek}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h4 className="text-white/90 font-medium">
          {format(currentWeek, 'MMMM d')} - {format(addDays(currentWeek, 6), 'MMMM d, yyyy')}
        </h4>
        <button 
          onClick={nextWeek}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={i} className="text-center text-white/60 text-sm">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {getDays().map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const hasApp = hasAppointment(day);
          const dayAppointments = getAppointmentsForDate(day);
          
          return (
            <div 
              key={i} 
              onClick={() => bookAppointment(day)}
              className={`relative min-h-20 rounded-lg border cursor-pointer transition-all duration-300 hover:translate-y-[-3px] ${
                isSelected 
                  ? 'border-purple-500/70 shadow-lg shadow-purple-500/20' 
                  : 'border-white/10'
              }`}
            >
              <div className={`
                h-full w-full rounded-lg overflow-hidden transition-all duration-300
                ${hasApp ? 'backdrop-blur-md bg-white/10' : 'backdrop-blur-sm bg-white/5'}
                ${isSelected ? 'ring-2 ring-purple-500/50' : ''}
                hover:bg-white/5 hover:backdrop-blur-none group
              `}>
                {/* Day Number */}
                <div className="p-2 text-right">
                  <span className={`
                    text-sm font-medium
                    ${isSelected ? 'text-white' : 'text-white/80'}
                  `}>{format(day, 'd')}</span>
                </div>

                {/* If has appointments */}
                {hasApp && dayAppointments.map(app => (
                  <div key={app.id} className="relative">
                    <div className={`
                      absolute inset-0 ${getTypeGradient(app.type)} opacity-70
                      transition-opacity duration-300 group-hover:opacity-100
                    `}></div>
                    <div className="relative p-1 flex items-center space-x-1 overflow-hidden">
                      <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src={app.imageUrl} 
                          alt="Appointment" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback for broken images
                            (e.target as HTMLImageElement).src = '/assets/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="truncate text-xs font-medium text-white">
                        {app.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots would go here in a real implementation */}
    </div>
  );
};

export default GlassCalendar;
