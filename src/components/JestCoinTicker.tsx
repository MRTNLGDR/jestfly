
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
    // Compact ticker for smaller spaces - pure glassmorphism without gold border
    return (
      <Link to="/airdrop" className={`inline-flex items-center px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all ${className}`}>
        <div className="mr-2 relative">
          <GoldCoin3D size={24} />
        </div>
        <span className="font-mono text-xs text-white">
          ${price.toFixed(4)}
        </span>
        <span className={`ml-1 text-xs ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
          {isIncreasing ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        </span>
      </Link>
    );
  }
  
  // Full ticker with more details - pure glassmorphism without gold border
  return (
    <Link to="/airdrop" className={`group flex items-center p-2 rounded-lg bg-black/30 backdrop-blur-sm hover:bg-black/40 transition-all ${className}`}>
      <div className="w-12 h-12 relative mr-3 flex items-center justify-center">
        <GoldCoin3D size={48} />
      </div>
      
      <div>
        <div className="flex items-center">
          <span className="font-mono font-bold text-white">${price.toFixed(4)}</span>
          <span className={`ml-2 text-xs flex items-center ${isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
            {isIncreasing ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </span>
        </div>
        <div className="text-xs text-white/60">JestCoin</div>
      </div>
      
      <div className="ml-auto mr-2 opacity-40 group-hover:opacity-100 transition-opacity">
        <span className="text-xs text-white">AIRDROP</span>
      </div>
    </Link>
  );
};

export default JestCoinTicker;
