
import React from 'react';
import { DollarSign } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const CurrencySwitcher: React.FC = () => {
  const { currency, setCurrency, t, availableCurrencies } = useLanguage();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <DollarSign size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-black/90 border border-white/20 text-white p-0" align="end">
        <div className="p-2">
          <h3 className="text-sm font-medium mb-2 text-white/70">Currencies</h3>
          <div className="grid grid-cols-1 gap-1">
            {availableCurrencies.map((curr) => (
              <Button 
                key={curr}
                variant={curr === currency ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => setCurrency(curr)}
              >
                {t(`currency.${curr}`)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySwitcher;
