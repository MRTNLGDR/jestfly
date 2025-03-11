
import React from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';

interface CheckoutStepperProps {
  step: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ step }) => {
  return (
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
  );
};

export default CheckoutStepper;
