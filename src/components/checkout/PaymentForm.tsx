
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from 'lucide-react';

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvc: string;
}

interface PaymentFormProps {
  formData: PaymentFormData;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  formData, 
  onCardNumberChange, 
  onExpiryChange, 
  onChange, 
  onSubmit, 
  onBack, 
  loading 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onChange={onCardNumberChange}
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
          onChange={onChange}
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
            onChange={onExpiryChange}
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
            onChange={onChange}
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
          onClick={onBack}
          disabled={loading}
        >
          Back to Shipping
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
