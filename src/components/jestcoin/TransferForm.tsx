
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/auth/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, SendHorizonal } from 'lucide-react';

interface TransferFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const transferSchema = z.object({
  recipientId: z.string().min(1, 'Informe o ID do destinatário'),
  amount: z.coerce.number()
    .positive('O valor deve ser positivo')
    .min(1, 'Valor mínimo de 1 JestCoin'),
  description: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferSchema>;

const TransferForm: React.FC<TransferFormProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { user } = useAuth();
  const { wallet, transferJestCoin, isTransferring } = useWallet();
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      recipientId: '',
      amount: 0,
      description: '',
    },
  });

  const onSubmit = async (values: TransferFormValues) => {
    if (!user) {
      setError('Você precisa estar logado para transferir JestCoin');
      return;
    }

    if (values.recipientId === user.id) {
      setError('Você não pode transferir para si mesmo');
      return;
    }

    if (!wallet || wallet.balance < values.amount) {
      setError('Saldo insuficiente');
      return;
    }

    setError(null);
    
    const result = await transferJestCoin({
      recipient_id: values.recipientId,
      amount: values.amount,
      description: values.description,
    });

    if (result.success) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle>Transferir JestCoin</DialogTitle>
          <DialogDescription>
            Envie JestCoin para outro usuário. Você precisará do ID do destinatário.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID do Destinatário</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ID do destinatário" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Insira o ID do usuário que receberá os JestCoins
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      min={1}
                      step={1}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Saldo disponível: {wallet?.balance.toFixed(2) || 0} JestCoin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Motivo da transferência" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded p-2 text-sm text-red-200">
                {error}
              </div>
            )}
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isTransferring}
              >
                Cancelar
              </Button>
              
              <Button 
                type="submit"
                disabled={isTransferring}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isTransferring ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando
                  </>
                ) : (
                  <>
                    <SendHorizonal className="mr-2 h-4 w-4" />
                    Transferir
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferForm;
