import React from 'react';
import { Sparkles, FileCode, ScanLine, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

interface Template {
  type: string;
  label: string;
  icon: string;
}

export default function WelcomeOverlay(): JSX.Element {
  const {
    setShowWelcome,
    setOriginalCode,
    setCurrentLanguage,
    detectLanguage,
  } = useEditorStore();

  const { createNewFile } = useFileStore();

  const handleMagicPaste = (): void => {
    const code = prompt('✨ Collez ici votre code pour exécuter les vérifications syntaxiques :');
    if (code) {
      const language = detectLanguage(code);
      setOriginalCode(code);
      setCurrentLanguage(language);
      setShowWelcome(false);
    }
  };

  const handleTemplate = (type: string): void => {
    createNewFile(`example.${type}`, type);
    setShowWelcome(false);
  };

  const templates: Template[] = [
    { type: 'html', label: 'HTML Template', icon: '🌐' },
    { type: 'css', label: 'CSS Styles', icon: '🎨' },
    { type: 'javascript', label: 'JavaScript', icon: '⚡' },
    { type: 'json', label: 'JSON Data', icon: '📋' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--greyLight-1)] text-[var(--greyDark)] animate-fade-in">
      <Card className="w-full max-w-2xl bg-[var(--greyLight-1)] rounded-[2rem] p-8 shadow-[0.3rem_0.3rem_0.6rem_var(--greyLight-2),_-0.2rem_-0.2rem_0.5rem_var(--white)] relative">
        <CardHeader className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            noxfera
          </CardTitle>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Transformez votre code chaotique en une structure propre, élégante et digne d’un niveau professionnel.
            Compatible avec HTML, CSS, JavaScript, JSON, YAML — et bien d’autres langages.
          </p>
        </CardHeader>

        <CardContent className="space-y-8 p-0">
          {/* Magic Box */}
          <div
            onClick={handleMagicPaste}
            className="mx-auto max-w-md p-6 rounded-2xl shadow-[inset_0.2rem_0.2rem_0.5rem_var(--greyLight-2),_inset_-0.2rem_-0.2rem_0.5rem_var(--white)] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="text-center space-y-3">
              <ScanLine className="w-8 h-8 text-primary mx-auto transition-all group-hover:animate-bounce group-hover:text-primary/80" />
              <h3 className="font-semibold">Interface de formatage universel</h3>
              <p className="text-sm text-muted-foreground">
                Déposez un fichier ou collez du code à analyser, reformater et normaliser.
              </p>
            </div>
          </div>

          {/* Templates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">Ou utilisez un modèle de départ :</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {templates.map((template) => (
                <Button
                  key={template.type}
                  variant="ghost"
                  type="button"
                  onClick={() => handleTemplate(template.type)}
                  className="p-4 h-auto flex-col gap-2 rounded-xl bg-[var(--greyLight-1)] text-[var(--greyDark)] shadow-[0.3rem_0.3rem_0.6rem_var(--greyLight-2),_-0.2rem_-0.2rem_0.5rem_var(--white)] hover:shadow-[inset_0.2rem_0.2rem_0.5rem_var(--greyLight-2),_inset_-0.2rem_-0.2rem_0.5rem_var(--white)] transition-all"
                >
                  <span className="text-2xl">{template.icon}</span>
                  <span className="text-xs">{template.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Action principale */}
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              onClick={() => setShowWelcome(false)}
              className="px-8 py-2 rounded-xl bg-[var(--greyLight-1)] text-[var(--greyDark)] shadow-[0.3rem_0.3rem_0.6rem_var(--greyLight-2),_-0.2rem_-0.2rem_0.5rem_var(--white)] hover:shadow-[inset_0.2rem_0.2rem_0.5rem_var(--greyLight-2),_inset_-0.2rem_-0.2rem_0.5rem_var(--white)] transition-all"
            >
              <FileCode className="w-4 h-4 mr-2" />
              Commencer
            </Button>
          </div>
        </CardContent>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => setShowWelcome(false)}
          className="absolute top-4 right-4"
          aria-label="Fermer l'écran de bienvenue"
        >
          <X className="w-4 h-4" />
        </Button>
      </Card>
    </div>
  );
}
