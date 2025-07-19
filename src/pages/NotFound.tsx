import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('❌ 404: route introuvable =>', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] text-[hsl(var(--text-primary))] px-4 animate-fade-in">
      <div className="bg-[hsl(var(--surface))] rounded-[2rem] p-10 max-w-xl shadow-[0.3rem_0.3rem_0.6rem_hsl(var(--greyLight-2)),_-0.2rem_-0.2rem_0.5rem_hsl(var(--white))] text-center space-y-6">
        <div className="relative mx-auto w-14 h-14">
          <Sparkles className="w-14 h-14 text-primary animate-pulse" />
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
        </div>

        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-muted-foreground text-lg">
          Oups ! Cette page n’existe pas ou plus.
        </p>

        <a
          href="/"
          className="inline-block mt-4 px-6 py-2 rounded-xl bg-[hsl(var(--greyLight-1))] text-[hsl(var(--greyDark))] shadow-[0.3rem_0.3rem_0.6rem_hsl(var(--greyLight-2)),_-0.2rem_-0.2rem_0.5rem_hsl(var(--white))] hover:shadow-[inset_0.2rem_0.2rem_0.5rem_hsl(var(--greyLight-2)),_inset_-0.2rem_-0.2rem_0.5rem_hsl(var(--white))] transition-all"
        >
          ⬅ Retour à l’accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
