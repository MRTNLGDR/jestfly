import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HexColorPicker } from "react-colorful";
import { Check } from "lucide-react";

interface ColorsTabProps {
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  secondaryColor: string;
  setSecondaryColor: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  accentColor: string;
  setAccentColor: React.Dispatch<React.SetStateAction<string>>;
  isColorPickerOpen: string | null;
  setIsColorPickerOpen: React.Dispatch<React.SetStateAction<string | null>>;
  saveColorSettings: () => void;
}

const ColorsTab = ({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  backgroundColor,
  setBackgroundColor,
  accentColor,
  setAccentColor,
  isColorPickerOpen,
  setIsColorPickerOpen,
  saveColorSettings
}: ColorsTabProps) => {
  const toggleColorPicker = (colorName: string) => {
    if (isColorPickerOpen === colorName) {
      setIsColorPickerOpen(null);
    } else {
      setIsColorPickerOpen(colorName);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Cores e Temas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-medium">Cores do Site</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div 
                  className="w-8 h-8 rounded cursor-pointer border border-white/20"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => toggleColorPicker('primary')}
                />
              </div>
              {isColorPickerOpen === 'primary' && (
                <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                  <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                  <div className="mt-2 flex gap-2">
                    <Input 
                      value={primaryColor} 
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => setIsColorPickerOpen(null)}
                      className="bg-gray-600 hover:bg-gray-500"
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div 
                  className="w-8 h-8 rounded cursor-pointer border border-white/20"
                  style={{ backgroundColor: secondaryColor }}
                  onClick={() => toggleColorPicker('secondary')}
                />
              </div>
              {isColorPickerOpen === 'secondary' && (
                <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                  <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                  <div className="mt-2 flex gap-2">
                    <Input 
                      value={secondaryColor} 
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => setIsColorPickerOpen(null)}
                      className="bg-gray-600 hover:bg-gray-500"
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                <div 
                  className="w-8 h-8 rounded cursor-pointer border border-white/20"
                  style={{ backgroundColor: backgroundColor }}
                  onClick={() => toggleColorPicker('background')}
                />
              </div>
              {isColorPickerOpen === 'background' && (
                <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                  <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                  <div className="mt-2 flex gap-2">
                    <Input 
                      value={backgroundColor} 
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => setIsColorPickerOpen(null)}
                      className="bg-gray-600 hover:bg-gray-500"
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="accentColor">Cor de Destaque</Label>
                <div 
                  className="w-8 h-8 rounded cursor-pointer border border-white/20"
                  style={{ backgroundColor: accentColor }}
                  onClick={() => toggleColorPicker('accent')}
                />
              </div>
              {isColorPickerOpen === 'accent' && (
                <div className="mt-2 p-2 bg-gray-700 rounded-lg">
                  <HexColorPicker color={accentColor} onChange={setAccentColor} />
                  <div className="mt-2 flex gap-2">
                    <Input 
                      value={accentColor} 
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                    <Button 
                      size="sm" 
                      onClick={() => setIsColorPickerOpen(null)}
                      className="bg-gray-600 hover:bg-gray-500"
                    >
                      <Check size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={saveColorSettings}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
          >
            Salvar Configurações de Cores
          </Button>
        </div>
        
        <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg">
          <h3 className="text-xl font-medium">Visualização</h3>
          <div className="rounded-lg overflow-hidden" style={{ background: `linear-gradient(to right bottom, ${backgroundColor}, #000)` }}>
            <div className="p-6 min-h-[300px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 mb-4 rounded-full" style={{ background: primaryColor }}></div>
              <div className="h-6 w-32 mb-2 rounded" style={{ background: secondaryColor }}></div>
              <div className="h-4 w-48 rounded" style={{ background: accentColor }}></div>
              
              <div className="mt-8 flex gap-2">
                <button className="px-4 py-2 rounded" style={{ background: primaryColor, color: 'white' }}>
                  Botão
                </button>
                <button className="px-4 py-2 rounded" style={{ background: 'transparent', border: `1px solid ${secondaryColor}`, color: 'white' }}>
                  Secundário
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorsTab;
