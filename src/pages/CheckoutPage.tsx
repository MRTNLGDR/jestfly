import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from '@/hooks/auth/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import { ShoppingBag, CreditCard, Lock, ArrowLeft } from 'lucide-react';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
}

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
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          total: cartTotal
        })
        .select()
        .single();
      
      if (orderError) {
        throw orderError;
      }
      
      for (const item of cartItems) {
        const { error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: orderData.id,
            product_id: item.productId,
            quantity: item.quantity,
            price_at_time: item.price
          });
        
        if (itemError) {
          throw itemError;
        }
      }
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderData.id);
      
      if (updateError) {
        throw updateError;
      }
      
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

  const menuItems = [
    { label: "Store", href: "/store" },
    { label: "Checkout", href: "/store/checkout" }
  ];

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
                <CardContent className="p-6">
                  <div className="flex mb-6 relative">
                    <div className={`flex flex-col items-center ${step === 1 ? 'text-white' : 'text-white/60'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-purple-600' : 'bg-white/10'}`}>
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <span className="mt-2 text-sm">Shipping</span>
                    </div>
                    
                    <div className={`flex-1 h-0.5 self-center mx-4 ${step > 1 ? 'bg-purple-600' : 'bg-white/10'}`} />
                    
                    <div className={`flex flex-col items-center ${step === 2 ? 'text-white' : 'text-white/60'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-purple-600' : 'bg-white/10'}`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <span className="mt-2 text-sm">Payment</span>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">Shipping Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-black/30 border-white/10 text-white"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="bg-black/30 border-white/10 text-white"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <Input
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip/Postal Code</Label>
                            <Input
                              id="zipCode"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                              id="country"
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          >
                            Continue to Payment
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <h3 className="text-xl font-semibold">Payment Information</h3>
                        
                        <div className="rounded-lg border border-white/10 p-4 flex items-center bg-black/20">
                          <Lock className="h-5 w-5 mr-2 text-green-500" />
                          <span className="text-sm text-white/70">
                            Your payment information is encrypted and secure
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="0000 0000 0000 0000"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            className="bg-black/30 border-white/10 text-white font-mono"
                            maxLength={19}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            className="bg-black/30 border-white/10 text-white"
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={handleExpiryChange}
                              className="bg-black/30 border-white/10 text-white font-mono"
                              maxLength={5}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input
                              id="cardCvc"
                              name="cardCvc"
                              type="password"
                              placeholder="***"
                              value={formData.cardCvc}
                              onChange={handleChange}
                              className="bg-black/30 border-white/10 text-white font-mono"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4 space-y-3">
                          <Button 
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            disabled={loading}
                          >
                            {loading ? "Processing..." : "Complete Order"}
                          </Button>
                          
                          <Button 
                            type="button" 
                            variant="outline"
                            className="w-full border-white/10 text-white hover:bg-white/10"
                            onClick={() => setStep(1)}
                            disabled={loading}
                          >
                            Back to Shipping
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:w-1/3">
              <Card className="bg-black/40 backdrop-blur-md border-white/10 sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                  
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 rounded bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-white/40 text-md font-bold">{item.title[0]}</div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex justify-between text-sm text-white/70">
                            <span>Qty: {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4 bg-white/10" />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Shipping</span>
                      <span>Free</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Tax</span>
                      <span>${(cartTotal * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-white/10" />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${(cartTotal + cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                </CardContent>
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
