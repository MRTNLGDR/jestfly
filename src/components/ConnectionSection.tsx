
import React, { useState } from 'react';
import { Input } from './ui/input';
import { Diamond, Send, CheckCircle } from 'lucide-react';

const ConnectionSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Aqui você conectaria com um serviço real de newsletter
      console.log("Email submitted:", email);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="w-full py-20 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-black z-0"></div>
      
      {/* Animated background shapes */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-900/20 blur-[80px] animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full bg-blue-900/20 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4 inline-flex items-center justify-center p-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
            <Diamond className="h-5 w-5 text-purple-400 animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tighter">
            JOIN THE <span className="text-gradient-primary">FUTURE</span>
          </h2>
          
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Subscribe to our newsletter to receive exclusive updates, early access to events, and special offers.
          </p>
          
          <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
            <div className="neo-blur rounded-full p-1 border border-white/10">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="rounded-full bg-transparent border-0 pr-12 focus-visible:ring-offset-0 focus-visible:ring-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-transform hover:scale-105"
                >
                  {isSubmitted ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <Send className="h-5 w-5 text-white" />
                  )}
                </button>
              </div>
            </div>
            
            {isSubmitted && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-green-400 text-sm animate-fade-in">
                Thanks for subscribing!
              </div>
            )}
          </form>
          
          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/50 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <span>Exclusive Content</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
              <span>Early Access</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
              <span>Special Offers</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-pink-400 mr-2"></div>
              <span>Community Events</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectionSection;
