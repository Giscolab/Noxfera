import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UltimateBeautifierLayout } from "./components/Layout/UltimateBeautifierLayout";

const App = () => (
  <React.StrictMode>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UltimateBeautifierLayout />
    </TooltipProvider>
  </React.StrictMode>
);

export default App;