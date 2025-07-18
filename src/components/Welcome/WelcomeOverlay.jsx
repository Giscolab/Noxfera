import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, FileCode, ScanLine, X } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

const WelcomeOverlay = () => {
  const { setShowWelcome, setOriginalCode, setCurrentLanguage, detectLanguage } = useEditorStore();
  const { createNewFile } = useFileStore();

  const handleMagicPaste = () => {
    const code = prompt("Collez ici votre code pour exécuter les vérifications syntaxiques:");
    if (code) {
      const language = detectLanguage(code);
      setOriginalCode(code);
      setCurrentLanguage(language);
      setShowWelcome(false);
    }
  };

  const handleTemplate = (type) => {
    createNewFile(`example.${type}`, type);
    setShowWelcome(false);
  };

  const templates = [
    { type: 'html', label: 'HTML Template', icon: '🌐' },
    { type: 'css', label: 'CSS Styles', icon: '🎨' },
    { type: 'javascript', label: 'JavaScript', icon: '⚡' },
    { type: 'json', label: 'JSON Data', icon: '📋' },
  ];

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-surface/95 backdrop-blur border-primary/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center space-y-6">

            {/* Header */}
            <div className="space-y-3">
              <div className="relative mx-auto w-16 h-16">
                <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              </div>

              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                noxfera
              </h1>

              <p className="text-muted-foreground max-w-lg mx-auto mt-2">
                Transformez votre code chaotique en une structure propre, élégante et digne d’un niveau professionnel.
                Compatible avec HTML, CSS, JavaScript, JSON, YAML — et bien d’autres langages.
              </p>
            </div>

            {/* Magic Box */}
            <Card
              className="mx-auto max-w-md p-6 border-2 border-dashed border-primary/30 
                        hover:border-primary/60 hover:bg-primary/5 transition-all duration-300
                        cursor-pointer group"
              onClick={handleMagicPaste}
            >
              <div className="text-center space-y-3">
                <ScanLine className="w-8 h-8 text-primary mx-auto transition-all group-hover:animate-bounce group-hover:text-primary/80" />
                <h3 className="font-semibold">Interface de formatage universel</h3>
                <p className="text-sm text-muted-foreground">
                  Déposez un fichier ou collez du code à analyser, reformater et normaliser.
                </p>
              </div>
            </Card>

            {/* Templates */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Ou utilisez un modèle de départ :</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {templates.map((template) => (
                  <Button
                    key={template.type}
                    variant="outline"
                    type="button"
                    onClick={() => handleTemplate(template.type)}
                    className="p-4 h-auto flex-col gap-2 hover:bg-primary/10"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <span className="text-xs">{template.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Action principale */}
            <div className="flex justify-center pt-4">
              <Button type="button" onClick={() => setShowWelcome(false)} className="px-8">
                <FileCode className="w-4 h-4 mr-2" />
                Commencer
              </Button>
            </div>
          </div>

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

        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeOverlay;
