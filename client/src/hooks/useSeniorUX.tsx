import React, { useState, useEffect, useContext, createContext } from "react";
import { Eye, EyeOff, Type, Monitor, Moon, Sun, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Context creation
const SeniorUXContext = createContext<{
  seniorMode: boolean;
  fontSize: string;
  highContrast: boolean;
  reducedMotion: boolean;
  toggleSeniorMode: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setFontSize: (size: string) => void;
  toggleHighContrast: () => void;
  setReducedMotion: (value: boolean) => void;
} | null>(null);

// Component that renders the accessibility controls
function SeniorUXControls() {
  const [seniorMode, setSeniorMode] = useState(false);
  const [fontSize, setFontSize] = useState('text-lg');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar preferências salvas no localStorage
    const savedPreferences = localStorage.getItem('senior-preferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        setSeniorMode(prefs.seniorMode || false);
        setFontSize(prefs.fontSize || 'text-lg');
        setHighContrast(prefs.highContrast || false);
        setReducedMotion(prefs.reducedMotion || false);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
  }, []);

  // Salvar preferências quando mudar
  useEffect(() => {
    const preferences = {
      seniorMode,
      fontSize,
      highContrast,
      reducedMotion,
    };
    localStorage.setItem('senior-preferences', JSON.stringify(preferences));
  }, [seniorMode, fontSize, highContrast, reducedMotion]);

  const toggleSeniorMode = () => {
    setSeniorMode(!seniorMode);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const increaseFontSize = () => {
    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
    setFontSize(sizes[nextIndex]);
  };

  const decreaseFontSize = () => {
    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const currentIndex = sizes.indexOf(fontSize);
    const prevIndex = Math.max(0, currentIndex - 1);
    setFontSize(sizes[prevIndex]);
  };

  return (
    <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold">Configurações para Acessibilidade</h3>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Moon className="size-4" />
          <Switch
            checked={seniorMode}
            onCheckedChange={toggleSeniorMode}
          />
          <Label htmlFor="senior-mode" className="text-sm">Modo Sênior</Label>
        </div>

        <div className="flex items-center gap-2">
          <Monitor className="size-4" />
          <Switch
            checked={highContrast}
            onCheckedChange={toggleHighContrast}
          />
          <Label htmlFor="high-contrast" className="text-sm">Alto Contraste</Label>
        </div>

        <div className="flex items-center gap-2">
          <Type className="size-4" />
          <Button
            variant="outline"
            size="sm"
            onClick={decreaseFontSize}
            disabled={fontSize === 'text-sm'}
          >
            <Minus className="size-4" />
          </Button>

          <span className="text-sm px-2">{fontSize}</span>

          <Button
            variant="outline"
            size="sm"
            onClick={increaseFontSize}
            disabled={fontSize === 'text-3xl'}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Provider Component
export default function SeniorUXProvider({ children }: { children: React.ReactNode }) {
  const [seniorMode, setSeniorMode] = useState(false);
  const [fontSize, setFontSize] = useState('text-lg');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Verificar preferências salvas no localStorage
    const savedPreferences = localStorage.getItem('senior-preferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        setSeniorMode(prefs.seniorMode || false);
        setFontSize(prefs.fontSize || 'text-lg');
        setHighContrast(prefs.highContrast || false);
        setReducedMotion(prefs.reducedMotion || false);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
  }, []);

  // Salvar preferências quando mudar
  useEffect(() => {
    const preferences = {
      seniorMode,
      fontSize,
      highContrast,
      reducedMotion,
    };
    localStorage.setItem('senior-preferences', JSON.stringify(preferences));
  }, [seniorMode, fontSize, highContrast, reducedMotion]);

  const toggleSeniorMode = () => {
    setSeniorMode(!seniorMode);
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  const increaseFontSize = () => {
    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
    setFontSize(sizes[nextIndex]);
  };

  const decreaseFontSize = () => {
    const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const currentIndex = sizes.indexOf(fontSize);
    const prevIndex = Math.max(0, currentIndex - 1);
    setFontSize(sizes[prevIndex]);
  };

  return (
    <SeniorUXContext.Provider
      value={{
        seniorMode,
        fontSize,
        highContrast,
        reducedMotion,
        toggleSeniorMode,
        increaseFontSize,
        decreaseFontSize,
        setFontSize,
        toggleHighContrast,
        setReducedMotion,
      }}
    >
      <div 
        className={seniorMode ? 'senior-mode' : ''}
        style={{
          fontSize: fontSize,
          lineHeight: '1.6',
          filter: highContrast ? 'contrast(1.2)' : 'none',
          transition: reducedMotion ? 'none' : 'all 0.3s ease',
        }}
      >
        {children}
      </div>
    </SeniorUXContext.Provider>
  );
}

// Hook para usar configurações de acessibilidade
export function useSeniorUX() {
  const context = useContext(SeniorUXContext);
  if (!context) {
    throw new Error("useSeniorUX deve ser usado dentro de um SeniorUXProvider");
  }
  return context;
}

// Export controls component for use in admin panel
export { SeniorUXControls };
