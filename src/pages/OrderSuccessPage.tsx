
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import GlassHeader from '@/components/GlassHeader';
import Footer from '@/components/Footer';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const menuItems = [
    { label: "Store", href: "/store" },
    { label: "Order Success", href: "/store/order-success" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <GlassHeader menuItems={menuItems} />
      
      <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
          
          <p className="text-white/70 mb-6">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
          
          {orderId && (
            <div className="bg-white/5 border border-white/10 rounded-md p-4 mb-8">
              <p className="text-sm text-white/50 mb-1">Order ID:</p>
              <p className="font-mono text-white/90">{orderId}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="border-white/10 text-white hover:bg-white/10"
              onClick={() => navigate('/store')}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Back to Store
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => navigate('/profile')}
            >
              My Orders
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
