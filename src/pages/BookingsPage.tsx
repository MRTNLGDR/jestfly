
import React, { useState } from 'react';
import Footer from '../components/Footer';

const BookingsPage: React.FC = () => {
  const [bookingType, setBookingType] = useState<'dj' | 'studio' | 'consultation'>('dj');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', { type: bookingType, ...formData });
    // Here you would typically send this data to your backend
    alert('Booking request submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-6 pb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Book JESTFLY</h1>
        <p className="text-xl text-white/70 max-w-3xl mb-12">
          Ready to bring the future of sound to your event? Book JESTFLY for your next party, 
          festival, or private event and experience a sonic journey like no other.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Booking Type Selector */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">What would you like to book?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setBookingType('dj')}
                  className={`p-4 rounded-lg border transition-all ${
                    bookingType === 'dj' 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-white/10 hover:border-purple-500/50'
                  }`}
                >
                  <div className="text-3xl mb-2">🎧</div>
                  <h3 className="text-lg font-medium">DJ Performance</h3>
                  <p className="text-white/70 text-sm mt-1">Book JESTFLY for your event or venue</p>
                </button>
                
                <button 
                  onClick={() => setBookingType('studio')}
                  className={`p-4 rounded-lg border transition-all ${
                    bookingType === 'studio' 
                      ? 'border-cyan-500 bg-cyan-900/20' 
                      : 'border-white/10 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="text-3xl mb-2">🎹</div>
                  <h3 className="text-lg font-medium">Studio Session</h3>
                  <p className="text-white/70 text-sm mt-1">Collaborate in the studio on your project</p>
                </button>
                
                <button 
                  onClick={() => setBookingType('consultation')}
                  className={`p-4 rounded-lg border transition-all ${
                    bookingType === 'consultation' 
                      ? 'border-pink-500 bg-pink-900/20' 
                      : 'border-white/10 hover:border-pink-500/50'
                  }`}
                >
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="text-lg font-medium">Consultation</h3>
                  <p className="text-white/70 text-sm mt-1">Get advice on your music or event</p>
                </button>
              </div>
            </div>
            
            {/* Booking Form */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                {bookingType === 'dj' ? 'DJ Booking Request' : 
                 bookingType === 'studio' ? 'Studio Session Request' : 
                 'Consultation Request'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-white/80 mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Preferred Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">Preferred Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2">
                      {bookingType === 'dj' ? 'Event Location' : 
                       bookingType === 'studio' ? 'Studio Location' : 
                       'Preferred Meeting Method'}
                    </label>
                    {bookingType === 'consultation' ? (
                      <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      >
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
                        className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-white/80 mb-2">
                    {bookingType === 'dj' ? 'Event Details' : 
                     bookingType === 'studio' ? 'Project Details' : 
                     'What would you like to discuss?'}
                  </label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
                    rows={5}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className={`px-8 py-3 rounded-full text-white transition-colors ${
                    bookingType === 'dj' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                      : bookingType === 'studio'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700'
                      : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700'
                  }`}
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
          
          <div>
            {/* Booking Info */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Booking Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white">Response Time</h3>
                  <p className="text-white/70">We typically respond to booking inquiries within 24-48 hours.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Availability</h3>
                  <p className="text-white/70">Bookings are subject to availability. We recommend booking at least 4-6 weeks in advance for events.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">Technical Requirements</h3>
                  <p className="text-white/70">For DJ performances, we'll provide a detailed technical rider after your booking is confirmed.</p>
                </div>
              </div>
            </div>
            
            {/* Testimonials */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">What People Say</h2>
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/80 italic">"JESTFLY brought an incredible energy to our corporate event. The fusion of visual art and music was unlike anything we've experienced before."</p>
                  <p className="text-white/60 text-sm mt-2">— Alex Chen, Event Director</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-white/80 italic">"The studio session with JESTFLY transformed our track into something truly special. Professional, creative, and inspiring."</p>
                  <p className="text-white/60 text-sm mt-2">— SoundWave Collective</p>
                </div>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-white/90 font-medium">What areas do you serve?</h3>
                  <p className="text-white/70 text-sm mt-1">We're available for bookings worldwide, with additional travel fees for locations outside our base city.</p>
                </div>
                <div>
                  <h3 className="text-white/90 font-medium">What is your cancellation policy?</h3>
                  <p className="text-white/70 text-sm mt-1">Cancellations made 14+ days before the event receive a full refund. Less than 14 days notice will incur a fee.</p>
                </div>
                <div>
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
