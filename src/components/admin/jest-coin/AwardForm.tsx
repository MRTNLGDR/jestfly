
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../integrations/supabase/client';
import { useLanguage } from '../../../contexts/language';

interface AwardFormProps {
  onAwardSuccess?: () => void;
}

export const AwardForm: React.FC<AwardFormProps> = ({ onAwardSuccess }) => {
  const { jestCoinInCurrency, formatCurrency } = useLanguage();
  
  const [user, setUser] = useState('');
  const [amount, setAmount] = useState<number>(100);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [groupType, setGroupType] = useState('');
  const [groupAmount, setGroupAmount] = useState<number>(50);
  const [groupReason, setGroupReason] = useState('');
  const [groupLoading, setGroupLoading] = useState(false);
  
  const handleAwardCoins = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !amount || !reason) {
      toast.error('Please fill all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would call a Supabase function
      // that would check user permissions and update the database
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add success toast notification
      toast.success(`Awarded ${amount} JestCoins to ${user}`);
      
      // Reset form
      setUser('');
      setAmount(100);
      setReason('');
      
      // Trigger refresh of data if parent component needs it
      if (onAwardSuccess) {
        onAwardSuccess();
      }
    } catch (error) {
      toast.error('Failed to award JestCoins');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGroupAward = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupType || !groupAmount || !groupReason) {
      toast.error('Please fill all fields');
      return;
    }
    
    setGroupLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would query users matching the group criteria
      // and award JestCoins to each one
      
      let userCount = 0;
      switch (groupType) {
        case 'recent':
          userCount = 12;
          break;
        case 'active':
          userCount = 24;
          break;
        case 'creators':
          userCount = 5;
          break;
        default:
          userCount = 0;
      }
      
      if (userCount > 0) {
        const totalAmount = userCount * groupAmount;
        toast.success(`Awarded ${groupAmount} JestCoins to ${userCount} users (${totalAmount} total)`);
      } else {
        toast.info('No users found in this group');
      }
      
      // Reset form
      setGroupType('');
      setGroupAmount(50);
      setGroupReason('');
      
      // Trigger refresh of data if parent component needs it
      if (onAwardSuccess) {
        onAwardSuccess();
      }
    } catch (error) {
      toast.error('Failed to award JestCoins to group');
      console.error(error);
    } finally {
      setGroupLoading(false);
    }
  };
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl">Award JestCoins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form className="space-y-4" onSubmit={handleAwardCoins}>
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Input 
                id="user" 
                placeholder="Username or email" 
                value={user}
                onChange={(e) => setUser(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (J$C)</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="100" 
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={loading}
                />
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  ≈ {formatCurrency(amount * jestCoinInCurrency)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input 
                id="reason" 
                placeholder="Community contribution" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Award JestCoins'
              )}
            </Button>
          </form>
          
          <form className="space-y-4" onSubmit={handleGroupAward}>
            <div className="space-y-2">
              <Label htmlFor="group">Group Award</Label>
              <select 
                id="group" 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                disabled={groupLoading}
              >
                <option value="">Select a group</option>
                <option value="recent">Recent signups</option>
                <option value="active">Most active users</option>
                <option value="creators">Content creators</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupAmount">Amount per user (J$C)</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="groupAmount" 
                  type="number" 
                  placeholder="50" 
                  value={groupAmount || ''}
                  onChange={(e) => setGroupAmount(Number(e.target.value))}
                  disabled={groupLoading}
                />
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  ≈ {formatCurrency(groupAmount * jestCoinInCurrency)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="groupReason">Reason</Label>
              <Input 
                id="groupReason" 
                placeholder="Promotional campaign" 
                value={groupReason}
                onChange={(e) => setGroupReason(e.target.value)}
                disabled={groupLoading}
              />
            </div>
            
            <Button className="w-full" type="submit" disabled={groupLoading}>
              {groupLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Award to Group'
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
