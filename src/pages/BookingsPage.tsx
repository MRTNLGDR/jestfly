
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Footer from '@/components/Footer';
import BookingForm from '@/components/bookings/BookingForm';
import BookingsList from '@/components/bookings/BookingsList';
import AvailabilityCalendar from '@/components/bookings/AvailabilityCalendar';
import { BookingType } from '@/services/bookingsService';

const BookingsPage: React.FC = () => {
  const [bookingType, setBookingType] = useState<BookingType>('dj');
  const [activeTab, setActiveTab] = useState<'new' | 'my-bookings'>('new');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleBookingComplete = () => {
    setActiveTab('my-bookings');
  };

  const bookingTypeInfo = {
    dj: {
      emoji: "🎧",
      title: "DJ Performance",
      description: "Reservar JESTFLY para seu evento ou venue"
    },
    studio: {
      emoji: "🎹",
      title: "Sessão de Estúdio",
      description: "Colaborar no estúdio em seu projeto"
    },
    consultation: {
      emoji: "💬",
      title: "Consultoria",
      description: "Obter orientação sobre sua música ou evento"
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="container mx-auto px-6 pb-20">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Reservar JESTFLY</h1>
        <p className="text-xl text-white/70 max-w-3xl mb-12">
          Pronto para trazer o futuro do som para seu evento? Reserve JESTFLY para sua próxima festa,
          festival ou evento privado e experimente uma jornada sonora como nenhuma outra.
        </p>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'new' | 'my-bookings')} className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="new">Nova Reserva</TabsTrigger>
            <TabsTrigger value="my-bookings">Minhas Reservas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Booking Type Selector */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
                  <h2 className="text-2xl font-semibold text-white mb-4">O que você gostaria de reservar?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button 
                      onClick={() => setBookingType('dj')}
                      className={`p-4 rounded-lg border transition-all ${
                        bookingType === 'dj' 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-white/10 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{bookingTypeInfo.dj.emoji}</div>
                      <h3 className="text-lg font-medium">{bookingTypeInfo.dj.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{bookingTypeInfo.dj.description}</p>
                    </button>
                    
                    <button 
                      onClick={() => setBookingType('studio')}
                      className={`p-4 rounded-lg border transition-all ${
                        bookingType === 'studio' 
                          ? 'border-cyan-500 bg-cyan-900/20' 
                          : 'border-white/10 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{bookingTypeInfo.studio.emoji}</div>
                      <h3 className="text-lg font-medium">{bookingTypeInfo.studio.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{bookingTypeInfo.studio.description}</p>
                    </button>
                    
                    <button 
                      onClick={() => setBookingType('consultation')}
                      className={`p-4 rounded-lg border transition-all ${
                        bookingType === 'consultation' 
                          ? 'border-pink-500 bg-pink-900/20' 
                          : 'border-white/10 hover:border-pink-500/50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{bookingTypeInfo.consultation.emoji}</div>
                      <h3 className="text-lg font-medium">{bookingTypeInfo.consultation.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{bookingTypeInfo.consultation.description}</p>
                    </button>
                  </div>
                </div>
                
                {/* Booking Form */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <BookingForm 
                    bookingType={bookingType} 
                    onBookingComplete={handleBookingComplete}
                  />
                </div>
              </div>
              
              <div>
                {/* Calendar */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Selecione uma Data</h2>
                  <AvailabilityCalendar 
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                  />
                  <p className="text-center text-white/60 text-sm mt-2">
                    Data selecionada: {format(selectedDate, 'dd/MM/yyyy')}
                  </p>
                </div>
                
                {/* Booking Info */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-semibold text-white mb-4">Informações de Reserva</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-white">Tempo de Resposta</h3>
                      <p className="text-white/70">Normalmente respondemos às solicitações de reserva em 24-48 horas.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Disponibilidade</h3>
                      <p className="text-white/70">As reservas estão sujeitas à disponibilidade. Recomendamos reservar com pelo menos 4-6 semanas de antecedência para eventos.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Requisitos Técnicos</h3>
                      <p className="text-white/70">Para performances de DJ, forneceremos um rider técnico detalhado após a confirmação da sua reserva.</p>
                    </div>
                  </div>
                </div>
                
                {/* Testimonials */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4">O que as Pessoas Dizem</h2>
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-white/80 italic">"JESTFLY trouxe uma energia incrível para nosso evento corporativo. A fusão de arte visual e música foi diferente de tudo o que já experimentamos antes."</p>
                      <p className="text-white/60 text-sm mt-2">— Alex Chen, Diretor de Eventos</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-white/80 italic">"A sessão de estúdio com JESTFLY transformou nossa faixa em algo realmente especial. Profissional, criativo e inspirador."</p>
                      <p className="text-white/60 text-sm mt-2">— SoundWave Collective</p>
                    </div>
                  </div>
                </div>
                
                {/* FAQ */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Perguntas Frequentes</h2>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white/90 font-medium">Quais áreas vocês atendem?</h3>
                      <p className="text-white/70 text-sm mt-1">Estamos disponíveis para reservas em todo o mundo, com taxas adicionais de viagem para locais fora da nossa cidade base.</p>
                    </div>
                    <div>
                      <h3 className="text-white/90 font-medium">Qual é a política de cancelamento?</h3>
                      <p className="text-white/70 text-sm mt-1">Cancelamentos feitos com 14+ dias antes do evento recebem reembolso total. Menos de 14 dias de antecedência incorrerá em uma taxa.</p>
                    </div>
                    <div>
                      <h3 className="text-white/90 font-medium">Vocês oferecem produção musical personalizada?</h3>
                      <p className="text-white/70 text-sm mt-1">Sim! Reserve uma sessão de estúdio ou consultoria para discutir as necessidades do seu projeto.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="my-bookings">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Minhas Reservas</h2>
              <BookingsList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;
