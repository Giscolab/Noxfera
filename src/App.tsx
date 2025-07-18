import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UltimateBeautifierLayout } from "./components/Layout/UltimateBeautifierLayout";
import { useReactHealth, validateZustandReact } from "./hooks/useReactHealth";

const App = () => {
  const isReactHealthy = useReactHealth();
  
  // Valider la compatibilité React/Zustand au démarrage
  React.useEffect(() => {
    const isZustandCompatible = validateZustandReact();
    if (!isZustandCompatible) {
      console.error('Zustand compatibility issue detected');
    }
  }, []);
  
  if (!isReactHealthy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Chargement...</h1>
          <p className="text-muted-foreground">Initialisation de l'application</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <Toaster />
      <Sonner />
      <UltimateBeautifierLayout />
    </div>
  );
};

export default App;