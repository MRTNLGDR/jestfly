
import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Coins, User, ArrowRight, CircleDollarSign } from 'lucide-react';
import { useLanguage } from '../../../contexts/language';

interface JestCoinStatsProps {
  totalJestCoins: number;
  activeUsers: number;
}

export const JestCoinStats: React.FC<JestCoinStatsProps> = ({ 
  totalJestCoins, 
  activeUsers 
}) => {
  const { formatCurrency, jestCoinInCurrency } = useLanguage();
  
  // Calculate total market cap
  const marketCapInCurrency = totalJestCoins * jestCoinInCurrency;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-yellow-700/30">
        <CardContent className="flex items-center p-6">
          <div className="bg-yellow-500/20 p-3 rounded-full mr-4">
            <Coins className="h-8 w-8 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">Total JestCoins</p>
            <h3 className="text-2xl font-bold">{totalJestCoins.toLocaleString()}</h3>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-900/40 to-green-800/20 border-green-700/30">
        <CardContent className="flex items-center p-6">
          <div className="bg-green-500/20 p-3 rounded-full mr-4">
            <CircleDollarSign className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">JestCoin Value</p>
            <h3 className="text-2xl font-bold">{formatCurrency(jestCoinInCurrency)}</h3>
            <p className="text-xs text-white/40 mt-1">1 J$C = {formatCurrency(jestCoinInCurrency)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border-purple-700/30">
        <CardContent className="flex items-center p-6">
          <div className="bg-purple-500/20 p-3 rounded-full mr-4">
            <ArrowRight className="h-8 w-8 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">Market Cap</p>
            <h3 className="text-2xl font-bold">{formatCurrency(marketCapInCurrency)}</h3>
            <p className="text-xs text-white/40 mt-1">{totalJestCoins.toLocaleString()} J$C</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/30">
        <CardContent className="flex items-center p-6">
          <div className="bg-blue-500/20 p-3 rounded-full mr-4">
            <User className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/60">Active Users</p>
            <h3 className="text-2xl font-bold">{activeUsers}</h3>
            <p className="text-xs text-white/40 mt-1">({((activeUsers / 100) * 100).toFixed(0)}% growth)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
