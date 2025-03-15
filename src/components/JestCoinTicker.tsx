
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoldCoin3D from './GoldCoin3D';

interface JestCoinTickerProps {
  className?: string;
  compact?: boolean;
}

const JestCoinTicker: React.FC<JestCoinTickerProps> = ({ className = "", compact = false }) => {
  const [price, setPrice] = useState(0.0382);
  const [change, setChange] = useState(3.2);
  const [isIncreasing, setIsIncreasing] = useState(true);
  
  // Simulate real-time price changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Random price fluctuation within a small range
      const fluctuation = (Math.random() - 0.5) * 0.002;
      const newPrice = Math.max(0.001, price + fluctuation);
      setPrice(newPrice);
      
      // Calculate percent change
      const newChange = ((newPrice - 0.037) / 0.037) * 100;
      setChange(parseFloat(newChange.toFixed(2)));
      setIsIncreasing(newChange > 0);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [price]);
  
  if (compact) {
    // Compact ticker for smaller spaces
    return (
      <Link to="/airdrop" className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-black/80 to-black/30 backdrop-blur-md border border-yellow-500/30 hover:border-yellow-500/50 transition-all ${className}`}>
        <div className="mr-2 relative">
          <GoldCoin3D size={24} />
        </div>
        <span className="font-mono text-xs font-bold text-yellow-100">
          ${price.toFixed(4)}
        </span>
        <span className={`ml-1 text-xs ${isIncreasing ? 'text-green-400' : 'text-red-400'}`}>
          {isIncreasing ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        </span>
      </Link>
    );
  }
  
  // Full ticker with more details
  return (
    <Link to="/airdrop" className={`group flex items-center p-3 rounded-lg bg-gradient-to-br from-black/80 to-zinc-900/50 backdrop-blur-xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all shadow-lg ${className}`}>
      <div className="w-12 h-12 relative mr-4 flex items-center justify-center">
        <GoldCoin3D size={48} />
      </div>
      
      <div>
        <div className="flex items-center">
          <span className="font-mono font-bold text-yellow-100">${price.toFixed(4)}</span>
          <span className={`ml-2 text-xs flex items-center ${isIncreasing ? 'text-green-400' : 'text-red-400'}`}>
            {isIncreasing ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </span>
        </div>
        <div className="text-xs text-yellow-100/60 font-medium">JestCoin</div>
      </div>
      
      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs font-semibold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent px-2 py-1 rounded border border-yellow-500/20">AIRDROP</span>
      </div>
    </Link>
  );
};

export default JestCoinTicker;
