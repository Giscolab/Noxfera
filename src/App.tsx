import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SimpleLayout from "./components/Layout/SimpleLayout";

const App = () => (
  <React.StrictMode>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SimpleLayout />
    </TooltipProvider>
  </React.StrictMode>
);

export default App;