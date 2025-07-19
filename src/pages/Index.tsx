import React from 'react';
import { Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-primary))] px-4 animate-fade-in">
      <div className="bg-[hsl(var(--surface))] rounded-[2rem] p-10 max-w-xl shadow-[0.3rem_0.3rem_0.6rem_hsl(var(--greyLight-2)),_-0.2rem_-0.2rem_0.5rem_hsl(var(--white))] text-center space-y-6">
        <div className="relative mx-auto w-14 h-14">
          <Sparkles className="w-14 h-14 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Bienvenue sur Noxfera
        </h1>
        <p className="text-muted-foreground text-lg">
          L’interface est prête. Tu peux commencer à développer ton projet.
        </p>
      </div>
    </div>
  );
};

export default Index;
