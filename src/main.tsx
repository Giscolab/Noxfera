import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TooltipProvider } from "@/components/ui/tooltip"
import App from './App.tsx'
import './index.css'

// S'assurer qu'il n'y a qu'une seule instance de React
console.log('React version:', React.version);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>
)
