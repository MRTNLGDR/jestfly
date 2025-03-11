
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BookingForm from '@/components/bookings/BookingForm';
import BookingsList from '@/components/bookings/BookingsList';
import { Calendar, ListChecks } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="container max-w-6xl mx-auto pt-24 pb-20 px-4">
      <h1 className="text-display-md font-light text-white mb-2">Reservas</h1>
      <p className="text-body-lg text-white/70 mb-8">
        Reserve um DJ para seu evento, sessão de estúdio ou agende uma consultoria
      </p>

      {user ? (
        <Tabs defaultValue="new" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="new" className="data-[state=active]:bg-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              Nova Reserva
            </TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-white/10">
              <ListChecks className="h-4 w-4 mr-2" />
              Minhas Reservas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="p-0">
            <BookingForm />
          </TabsContent>
          
          <TabsContent value="list" className="p-0">
            <BookingsList />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-16 bg-black/20 rounded-lg border border-white/10">
          <h2 className="text-2xl font-medium text-white mb-4">Login Necessário</h2>
          <p className="text-white/70 max-w-md mx-auto mb-8">
            Você precisa estar logado para fazer reservas e visualizar suas reservas existentes.
          </p>
          <Button asChild>
            <Link to="/auth">Fazer Login</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
