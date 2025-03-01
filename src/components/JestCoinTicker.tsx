
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import GoldCoin3D from './GoldCoin3D';

interface JestCoinTickerProps {
  className?: string;
  compact?: boolean;
}

// This component would be connected to real data in a production environment
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
      <div className={`inline-flex items-center px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 ${className}`}>
        <div className="mr-1">
          <GoldCoin3D size={20} />
        </div>
        <span className="font-mono text-xs">
          ${price.toFixed(4)}
        </span>
        <span className={`ml-1 text-xs ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
          {isIncreasing ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        </span>
      </div>
    );
  }
  
  // Full ticker with more details
  return (
    <Link to="/airdrop" className={`group flex items-center p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all ${className}`}>
      <div className="w-10 h-10 relative mr-3 flex items-center justify-center">
        <GoldCoin3D size={40} />
      </div>
      
      <div>
        <div className="flex items-center">
          <span className="font-mono font-bold">${price.toFixed(4)}</span>
          <span className={`ml-2 text-xs flex items-center ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
            {isIncreasing ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </span>
        </div>
        <div className="text-xs text-white/60">JestCoin</div>
      </div>
      
      <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <LinkIcon className="h-3 w-3 text-purple-400" />
      </div>
    </Link>
  );
};

export default JestCoinTicker;
