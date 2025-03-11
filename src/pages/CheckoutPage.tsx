
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/components/ui/use-toast';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { CheckoutFormData } from '@/components/checkout/types';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { createOrder } from '@/components/checkout/CheckoutService';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (cartItems.length === 0) {
    navigate('/store');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const formatCardNumber = (value: string) => {
    const val = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = val.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setFormData({
      ...formData,
      cardNumber: value
    });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setFormData({
      ...formData,
      cardExpiry: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setLoading(true);
    
    try {
      if (!user) {
        toast({
          title: "Login required",
          description: "Please login to complete your purchase",
          variant: "destructive"
        });
        navigate('/auth');
        return;
      }
      
      const orderData = await createOrder(user.id, cartItems, cartTotal);
      
      clearCart();
      
      toast({
        title: "Order successful!",
        description: "Your order has been placed successfully",
      });
      
      navigate('/store/order-success', { state: { orderId: orderData.id } });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <GlassHeader />
      
      <main className="flex-1 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/store')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Store
            </Button>
            
            <h1 className="text-3xl font-bold mt-4">Checkout</h1>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <Card className="bg-black/40 backdrop-blur-md border-white/10">
                <div className="p-6">
                  <CheckoutStepper step={step} />
                  
                  {step === 1 ? (
                    <ShippingForm 
                      formData={formData} 
                      onChange={handleChange} 
                      onSubmit={handleSubmit} 
                    />
                  ) : (
                    <PaymentForm 
                      formData={formData}
                      onChange={handleChange}
                      onCardNumberChange={handleCardNumberChange}
                      onExpiryChange={handleExpiryChange}
                      onSubmit={handleSubmit}
                      onBack={() => setStep(1)}
                      loading={loading}
                    />
                  )}
                </div>
              </Card>
            </div>
            
            <div className="lg:w-1/3">
              <Card className="bg-black/40 backdrop-blur-md border-white/10 sticky top-24">
                <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
