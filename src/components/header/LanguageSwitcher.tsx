
import React from 'react';
import { Globe } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { useLanguage } from '../../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Globe size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 bg-black/90 border border-white/20 text-white p-0" align="end">
        <div className="p-2">
          <h3 className="text-sm font-medium mb-2 text-white/70">Languages</h3>
          <div className="grid grid-cols-1 gap-1">
            {availableLanguages.map((lang) => (
              <Button 
                key={lang}
                variant={lang === language ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => setLanguage(lang)}
              >
                {t(`language.${lang}`)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageSwitcher;
