
import React, { useState } from 'react';
import Footer from '../components/Footer';
import { toast } from "sonner";
import BookingTypeSelector from '../components/bookings/BookingTypeSelector';
import CalendarSection from '../components/bookings/CalendarSection';
import BookingForm from '../components/bookings/BookingForm';
import SidebarContent from '../components/bookings/SidebarContent';
import { getGradientClass, getButtonGradient } from '../utils/bookingUtils';

const BookingsPage: React.FC = () => {
  const [bookingType, setBookingType] = useState<'dj' | 'studio' | 'consultation'>('dj');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    location: '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      date: date.toISOString().split('T')[0]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', { type: bookingType, ...formData });
    // Here you would typically send this data to your backend
    toast.success("Booking request submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-black bg-[url('/assets/grid.svg')] bg-fixed text-white pt-24">
      <div className="container mx-auto px-6 pb-20">
        <div className="mb-12 text-center">
          <h1 className="text-gradient text-5xl md:text-7xl font-bold mb-6">Book JESTFLY</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Ready to bring the future of sound to your event? Book JESTFLY for your next party, 
            festival, or private event and experience a sonic journey like no other.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Booking Type Selector with Images */}
            <BookingTypeSelector 
              bookingType={bookingType} 
              setBookingType={setBookingType} 
            />
            
            {/* Interactive Calendar */}
            <CalendarSection 
              bookingType={bookingType} 
              selectedDate={selectedDate} 
              handleDateSelect={handleDateSelect} 
              getGradientClass={() => getGradientClass(bookingType)} 
            />
            
            {/* Booking Form */}
            <BookingForm 
              bookingType={bookingType}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              getGradientClass={() => getGradientClass(bookingType)}
              getButtonGradient={() => getButtonGradient(bookingType)}
            />
          </div>
          
          <div>
            <SidebarContent bookingType={bookingType} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;
