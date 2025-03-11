
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { CardContent } from "@/components/ui/card";
import { CartItem } from '@/contexts/CartContext';

interface OrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, cartTotal }) => {
  return (
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
  );
};

export default OrderSummary;
