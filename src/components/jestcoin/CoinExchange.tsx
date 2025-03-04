
import React, { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useJestCoin } from '@/hooks/jestcoin/useJestCoin';
import { ArrowDown, ArrowUp, RefreshCcw } from 'lucide-react';
import GoldCoin3D from '../GoldCoin3D';
import { toast } from 'sonner';

const CoinExchange: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [isDeposit, setIsDeposit] = useState<boolean>(true);
  const { wallet, addBalance, isAdding } = useJestCoin();
  
  const handleExchange = () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Digite um valor válido');
      return;
    }
    
    if (!isDeposit && (!wallet || numAmount > wallet.balance)) {
      toast.error('Saldo insuficiente');
      return;
    }
    
    // Para demonstração, simulamos uma troca sem integração real com pagamentos
    addBalance({
      amount: isDeposit ? numAmount : -numAmount,
      type: isDeposit ? 'deposit' : 'withdraw',
      description: isDeposit ? `Depósito de ${numAmount} JestCoins` : `Saque de ${numAmount} JestCoins`
    });
    
    setAmount('');
    toast.success(isDeposit ? 'Depósito realizado com sucesso!' : 'Saque solicitado com sucesso!');
  };
  
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Converter Tokens</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 hover:text-white"
          onClick={() => setIsDeposit(!isDeposit)}
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Alternar
        </Button>
      </div>
      
      <div className="flex flex-col items-center mb-6">
        <div className="relative p-4 mb-4">
          <GoldCoin3D size={64} />
          <div className="absolute -right-2 bottom-0 bg-black rounded-full p-1">
            {isDeposit ? (
              <ArrowDown className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowUp className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h4 className="text-lg font-medium text-white">
            {isDeposit ? 'Depositar JestCoins' : 'Sacar JestCoins'}
          </h4>
          <p className="text-sm text-white/60">
            {isDeposit 
              ? 'Adicione JestCoins à sua carteira' 
              : 'Converta seus JestCoins para outras moedas'}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Quantidade</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/20 border-white/10 text-white pl-10 pr-20"
              min={0}
              step={0.01}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-yellow-400">JC</span>
            </div>
            {!isDeposit && wallet && (
              <Button
                type="button"
                variant="ghost"
                className="absolute inset-y-0 right-0 px-3 text-xs text-white/70"
                onClick={() => setAmount(wallet.balance.toString())}
              >
                MAX
              </Button>
            )}
          </div>
        </div>
        
        <Button
          type="button"
          className={`w-full ${isDeposit ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={handleExchange}
          disabled={isAdding || !amount || parseFloat(amount) <= 0}
        >
          {isAdding ? 'Processando...' : isDeposit ? 'Depositar' : 'Sacar'}
        </Button>
      </div>
    </GlassCard>
  );
};

export default CoinExchange;
