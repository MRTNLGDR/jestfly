
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from '@/contexts/CartContext';
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { cartItems, isCartOpen, cartTotal, closeCart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/store/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md bg-black/90 backdrop-blur-lg border-white/10 text-white">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center text-white">
            <ShoppingBag className="w-5 h-5 mr-2" /> 
            Your Cart
          </SheetTitle>
          <SheetDescription className="text-white/60">
            {cartItems.length === 0 
              ? "Your cart is empty" 
              : `You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-6 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 mx-auto text-white/20" />
              <p className="mt-4 text-white/60">Your cart is empty</p>
              <Button 
                onClick={closeCart} 
                variant="outline" 
                className="mt-4 border-white/20 text-white hover:bg-white/10"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-md bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white/40 text-xl font-bold">{item.title[0]}</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.title}</h4>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded">
                      {item.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm font-mono text-white">${item.price.toFixed(2)}</div>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-7 w-7 rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-7 w-7 rounded-full border-white/20 text-white hover:bg-white/10"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <div className="mt-6">
              <Separator className="my-4 bg-white/10" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <Separator className="my-4 bg-white/10" />
              
              <div className="flex justify-between">
                <span className="text-lg">Total</span>
                <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <SheetFooter className="mt-6">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
