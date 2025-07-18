import React from 'react';
import { Sparkles, FileCode, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeOverlayProps {
  onClose: () => void;
}

export function WelcomeOverlay({ onClose }: WelcomeOverlayProps) {
  const handleMagicBox = () => {
    const code = prompt("Collez votre code ici:");
    if (code) {
      // Handle pasted code
      onClose();
    }
  };

  const handleTemplate = () => {
    const templates = {
      html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body{font-family:sans-serif;margin:0;padding:20px;background:#f5f5f5;}
        .container{max-width:800px;margin:0 auto;background:white;padding:30px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);}
    </style>
</head>
<body>
    <div class="container">
        <h1>Bonjour le monde</h1>
        <p>Ceci est un modèle HTML de départ</p>
    </div>
</body>
</html>`,
      css: `/* Styles de base */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8f9fa;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background-color: #6366f1;
    color: white;
    padding: 20px 0;
    text-align: center;
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background-color: #6366f1;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #4f46e5;
}`,
      javascript: `// Fonction pour calculer la factorielle
function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

// Fonction pour formater une date
function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return \`\${day}/\${month}/\${year}\`;
}

// Utilisation des fonctions
console.log('Factorielle de 5:', factorial(5));
console.log('Date du jour:', formatDate(new Date()));`
    };

    const templateType = prompt("Choisissez un modèle (html, css, javascript):", "html") as keyof typeof templates;
    if (templateType && templates[templateType]) {
      // Handle template selection
      onClose();
    }
  };

  return (
    <div className="welcome-overlay animate-fade-in">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8" />
            noxfera
          </CardTitle>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Formatez votre code instantanément avec une interface élégante et intuitive.
            <br />
            <span className="text-primary font-semibold">Astuce :</span> Utilisez la{' '}
            <strong>boîte magique</strong> pour coller ou déposer du code, ou démarrez avec un modèle.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Magic Box */}
          <Card 
            className="border-2 border-dashed border-muted-foreground/50 hover:border-primary cursor-pointer transition-all duration-300 hover:bg-accent/50 animate-pulse-glow"
            onClick={handleMagicBox}
          >
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Boîte magique de formatage</h3>
              <p className="text-muted-foreground mb-4">
                Collez votre code ici ou glissez-déposez des fichiers
              </p>
              <span className="text-primary text-sm">
                ✨ Astuce : Essayez avec du HTML, CSS, JS, JSON…
              </span>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleTemplate}
              className="flex items-center gap-2"
              size="lg"
            >
              <FileCode className="w-5 h-5" />
              Commencer avec un modèle
            </Button>
            
            <Button 
              variant="outline" 
              onClick={onClose}
              size="lg"
            >
              Explorer par moi-même
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}