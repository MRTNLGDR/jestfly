
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

interface ThemeOptionProps {
  value: 'light' | 'dark' | 'system';
  label: string;
  icon: React.ReactNode;
  description: string;
  active: boolean;
  onClick: () => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({ 
  value, 
  label, 
  icon, 
  description, 
  active, 
  onClick 
}) => {
  return (
    <div 
      className={`relative p-4 rounded-lg border cursor-pointer transition-all ${
        active 
          ? 'bg-purple-600/20 border-purple-500/50' 
          : 'bg-black/20 border-white/10 hover:bg-black/30'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-full ${active ? 'bg-purple-600/40' : 'bg-black/30'}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-white font-medium">{label}</h4>
          <p className="text-sm text-white/60">{description}</p>
        </div>
      </div>
      {active && (
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500"></span>
      )}
    </div>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun className="h-5 w-5 text-yellow-300" />,
      description: 'Aparência com fundo claro'
    },
    {
      value: 'dark',
      label: 'Escuro',
      icon: <Moon className="h-5 w-5 text-blue-300" />,
      description: 'Aparência com fundo escuro'
    },
    {
      value: 'system',
      label: 'Sistema',
      icon: <Monitor className="h-5 w-5 text-gray-300" />,
      description: 'Segue as configurações do sistema'
    }
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white">Tema do Aplicativo</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themeOptions.map((option) => (
          <ThemeOption
            key={option.value}
            value={option.value}
            label={option.label}
            icon={option.icon}
            description={option.description}
            active={theme === option.value}
            onClick={() => setTheme(option.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
