
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface PreferencesTabProps {
  preferences: {
    theme: string;
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  setPreferences: React.Dispatch<React.SetStateAction<{
    theme: string;
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  }>>;
  handlePreferencesUpdate: (e: React.FormEvent) => Promise<void>;
  updating: boolean;
}

const PreferencesTab: React.FC<PreferencesTabProps> = ({ 
  preferences, 
  setPreferences, 
  handlePreferencesUpdate, 
  updating 
}) => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Preferências do Usuário</h2>
        
        <form onSubmit={handlePreferencesUpdate} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Aparência</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-white">Tema</Label>
                <select
                  id="theme"
                  value={preferences.theme}
                  onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                >
                  <option value="dark">Escuro</option>
                  <option value="light">Claro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language" className="text-white">Idioma</Label>
                <select
                  id="language"
                  value={preferences.language}
                  onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Regional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-white">Moeda</Label>
                <select
                  id="currency"
                  value={preferences.currency}
                  onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full rounded bg-black/20 border border-white/10 p-2 text-white"
                >
                  <option value="BRL">Real (R$)</option>
                  <option value="USD">Dólar (US$)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" disabled={updating} className="bg-purple-600 hover:bg-purple-700">
              {updating ? 'Salvando...' : 'Salvar Preferências'}
            </Button>
          </div>
        </form>
      </div>
    </GlassCard>
  );
};

export default PreferencesTab;
