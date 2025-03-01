
import React, { useState } from 'react';
import Footer from '../components/Footer';
import { toast } from "sonner";
import { Calendar, Clock, Users, MapPin, MessageSquare } from 'lucide-react';
import GlassCalendar from '../components/GlassCalendar';
import BookingImage from '../components/BookingImages';
import { BookingTypeIcon, EventIcon } from '../components/BookingIcons';

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

  // Get the right gradient based on booking type
  const getGradientClass = () => {
    switch(bookingType) {
      case 'dj':
        return 'from-purple-600/20 to-blue-600/20';
      case 'studio':
        return 'from-cyan-600/20 to-blue-600/20';
      case 'consultation':
        return 'from-pink-600/20 to-purple-600/20';
    }
  };

  // Get button gradient based on booking type
  const getButtonGradient = () => {
    switch(bookingType) {
      case 'dj':
        return 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700';
      case 'studio':
        return 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700';
      case 'consultation':
        return 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700';
    }
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
            <div className="glass-morphism rounded-xl p-6 mb-8 transform hover:translate-y-[-5px] transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gradient mb-4">What would you like to book?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setBookingType('dj')}
                  className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
                    bookingType === 'dj' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-purple-500/50 bg-white/5'
                  }`}
                >
                  <div className="mb-3 h-32 overflow-hidden rounded-md">
                    <BookingImage type="dj" className="h-full w-full" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <BookingTypeIcon type="dj" className="text-purple-400" size={28} />
                  </div>
                  <h3 className="text-lg font-medium">DJ Performance</h3>
                  <p className="text-white/70 text-sm mt-1">Book JESTFLY for your event or venue</p>
                </button>
                
                <button 
                  onClick={() => setBookingType('studio')}
                  className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
                    bookingType === 'studio' 
                      ? 'border-cyan-500 bg-cyan-900/20' 
                      : 'border-white/10 hover:border-cyan-500/50 bg-white/5'
                  }`}
                >
                  <div className="mb-3 h-32 overflow-hidden rounded-md">
                    <BookingImage type="studio" className="h-full w-full" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <BookingTypeIcon type="studio" className="text-cyan-400" size={28} />
                  </div>
                  <h3 className="text-lg font-medium">Studio Session</h3>
                  <p className="text-white/70 text-sm mt-1">Collaborate in the studio on your project</p>
                </button>
                
                <button 
                  onClick={() => setBookingType('consultation')}
                  className={`p-4 rounded-lg border backdrop-blur-md transition-all ${
                    bookingType === 'consultation' 
                      ? 'border-pink-500 bg-pink-900/20' 
                      : 'border-white/10 hover:border-pink-500/50 bg-white/5'
                  }`}
                >
                  <div className="mb-3 h-32 overflow-hidden rounded-md">
                    <BookingImage type="consultation" className="h-full w-full" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <BookingTypeIcon type="consultation" className="text-pink-400" size={28} />
                  </div>
                  <h3 className="text-lg font-medium">Consultation</h3>
                  <p className="text-white/70 text-sm mt-1">Get advice on your music or event</p>
                </button>
              </div>
            </div>
            
            {/* Interactive Calendar */}
            <div className={`glass-morphism rounded-xl border-t border-l border-white/20 p-6 mb-8 bg-gradient-to-br ${getGradientClass()}`}>
              <GlassCalendar 
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                bookingType={bookingType}
              />
            </div>
            
            {/* Booking Form */}
            <div className={`glass-morphism rounded-xl border-t border-l border-white/20 p-6 bg-gradient-to-br ${getGradientClass()}`}>
              <h2 className="text-2xl font-semibold text-gradient mb-6 glow-text flex items-center gap-3">
                <BookingTypeIcon type={bookingType} size={28} />
                {bookingType === 'dj' ? 'DJ Booking Request' : 
                 bookingType === 'studio' ? 'Studio Session Request' : 
                 'Consultation Request'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <Users size={16} className="text-white/60" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-white/60" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <Users size={16} className="text-white/60" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-white/60" />
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <Clock size={16} className="text-white/60" />
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-white/60" />
                      {bookingType === 'dj' ? 'Event Location' : 
                       bookingType === 'studio' ? 'Studio Location' : 
                       'Preferred Meeting Method'}
                    </label>
                    {bookingType === 'consultation' ? (
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="">Select one...</option>
                        <option value="zoom">Zoom</option>
                        <option value="teams">Microsoft Teams</option>
                        <option value="hangouts">Google Meet</option>
                        <option value="in-person">In Person</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-white/80 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} className="text-white/60" />
                    {bookingType === 'dj' ? 'Event Details' : 
                     bookingType === 'studio' ? 'Project Details' : 
                     'What would you like to discuss?'}
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    rows={5}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className={`px-8 py-3 rounded-full text-white transition-colors ${getButtonGradient()} shadow-lg transform hover:scale-105 transition duration-300 ease-in-out`}
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Showcase Image */}
            <div className="rounded-xl overflow-hidden mb-6 transform hover:translate-y-[-5px] transition-all duration-300">
              <BookingImage type={bookingType} className="h-56 w-full" />
            </div>
          
            {/* Booking Info */}
            <div className="glass-morphism rounded-xl p-6 transform hover:translate-y-[-5px] transition-all duration-300">
              <h2 className="text-2xl font-semibold text-gradient mb-4">Booking Information</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Response Time</h3>
                    <p className="text-white/70">We typically respond to booking inquiries within 24-48 hours.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Availability</h3>
                    <p className="text-white/70">Bookings are subject to availability. We recommend booking at least 4-6 weeks in advance for events.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <BookingTypeIcon type={bookingType} className="text-cyan-400 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <h3 className="text-lg font-medium text-white">Technical Requirements</h3>
                    <p className="text-white/70">For DJ performances, we'll provide a detailed technical rider after your booking is confirmed.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="glass-morphism rounded-xl p-6 transform hover:translate-y-[-5px] transition-all duration-300">
              <h2 className="text-xl font-semibold text-gradient mb-4">What People Say</h2>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                  <p className="text-white/80 italic">"JESTFLY brought an incredible energy to our corporate event. The fusion of visual art and music was unlike anything we've experienced before."</p>
                  <p className="text-white/60 text-sm mt-2">— Alex Chen, Event Director</p>
                </div>
                <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                  <p className="text-white/80 italic">"The studio session with JESTFLY transformed our track into something truly special. Professional, creative, and inspiring."</p>
                  <p className="text-white/60 text-sm mt-2">— SoundWave Collective</p>
                </div>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="glass-morphism rounded-xl p-6 transform hover:translate-y-[-5px] transition-all duration-300">
              <h2 className="text-xl font-semibold text-gradient mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg">
                  <h3 className="text-white/90 font-medium">What areas do you serve?</h3>
                  <p className="text-white/70 text-sm mt-1">We're available for bookings worldwide, with additional travel fees for locations outside our base city.</p>
                </div>
                <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg">
                  <h3 className="text-white/90 font-medium">What is your cancellation policy?</h3>
                  <p className="text-white/70 text-sm mt-1">Cancellations made 14+ days before the event receive a full refund. Less than 14 days notice will incur a fee.</p>
                </div>
                <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg">
                  <h3 className="text-white/90 font-medium">Do you offer custom music production?</h3>
                  <p className="text-white/70 text-sm mt-1">Yes! Book a studio session or consultation to discuss your project's needs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;
