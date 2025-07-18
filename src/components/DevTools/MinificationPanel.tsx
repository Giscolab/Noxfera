import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoEditor } from '../Editor/MonacoEditor';
import { Minimize2, Download, Copy, FileText } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';
import { useDevConsole } from './DevConsole';

// Minification CSS simple (intégrée)
const minifyCSS = (css: string): string => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Supprimer commentaires
    .replace(/\s+/g, ' ') // Remplacer multiples espaces
    .replace(/;\s*}/g, '}') // Supprimer point-virgule avant }
    .replace(/\s*{\s*/g, '{') // Supprimer espaces autour de {
    .replace(/}\s*/g, '}') // Supprimer espaces après }
    .replace(/:\s*/g, ':') // Supprimer espaces après :
    .replace(/;\s*/g, ';') // Supprimer espaces après ;
    .trim();
};

// Minification HTML simple
const minifyHTML = (html: string): string => {
  return html
    .replace(/<!--[\s\S]*?-->/g, '') // Supprimer commentaires HTML
    .replace(/>\s+</g, '><') // Supprimer espaces entre balises
    .replace(/\s+/g, ' ') // Remplacer multiples espaces
    .trim();
};

// Minification JS simple
const minifyJS = (js: string): string => {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '') // Supprimer commentaires multi-lignes
    .replace(/\/\/.*$/gm, '') // Supprimer commentaires single-line
    .replace(/\s+/g, ' ') // Remplacer multiples espaces
    .replace(/;\s*}/g, '}') // Optimiser ; avant }
    .trim();
};

export function MinificationPanel() {
  const { originalCode, currentLanguage } = useEditorStore();
  const { addMessage } = useDevConsole();

  const [isMinifying, setIsMinifying] = useState(false);
  const [activeTab, setActiveTab] = useState('javascript');
  
  const [originalCodes, setOriginalCodes] = useState({
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Page d'exemple</title>
</head>
<body>
    <h1>Titre principal</h1>
    <p>Ceci est un paragraphe d'exemple.</p>
</body>
</html>`,
    css: `/* Styles pour le bouton */
.button {
    background-color: #3498db;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.button:hover {
    background-color: #2980b9;
}`,
    javascript: originalCode || `function calculateSum(a, b) {
    // Cette fonction calcule la somme de deux nombres
    const result = a + b;
    console.log('Résultat:', result);
    return result;
}`
  });

  const [minifiedCodes, setMinifiedCodes] = useState({
    html: '',
    css: '',
    javascript: ''
  });

  // Synchroniser avec l'éditeur principal
  useEffect(() => {
    if (originalCode && ['javascript', 'css', 'html'].includes(currentLanguage)) {
      setOriginalCodes(prev => ({
        ...prev,
        [currentLanguage]: originalCode
      }));
      setActiveTab(currentLanguage);
    }
  }, [originalCode, currentLanguage]);

  const handleMinifyAll = async () => {
    setIsMinifying(true);
    addMessage('info', 'Minifier', 'Début de la minification...');
    
    try {
      const minifiedHTML = originalCodes.html.trim() ? minifyHTML(originalCodes.html) : originalCodes.html;
      const minifiedCSS = originalCodes.css.trim() ? minifyCSS(originalCodes.css) : originalCodes.css;
      const minifiedJS = originalCodes.javascript.trim() ? minifyJS(originalCodes.javascript) : originalCodes.javascript;

      setMinifiedCodes({
        html: minifiedHTML,
        css: minifiedCSS,
        javascript: minifiedJS
      });

      // Calculer les statistiques
      const htmlReduction = originalCodes.html.length > 0 ? 
        Math.round((1 - minifiedHTML.length / originalCodes.html.length) * 100) : 0;
      const cssReduction = originalCodes.css.length > 0 ? 
        Math.round((1 - minifiedCSS.length / originalCodes.css.length) * 100) : 0;
      const jsReduction = originalCodes.javascript.length > 0 ? 
        Math.round((1 - minifiedJS.length / originalCodes.javascript.length) * 100) : 0;

      addMessage('success', 'Minifier', 
        `Minification réussie! HTML: -${htmlReduction}%, CSS: -${cssReduction}%, JS: -${jsReduction}%`);
    } catch (error) {
      console.error('Erreur lors de la minification:', error);
      addMessage('error', 'Minifier', `Erreur: ${error.message}`);
    }
    
    setIsMinifying(false);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    addMessage('success', 'Minifier', 'Code minifié copié dans le presse-papier');
  };

  const handleDownload = (code: string, type: string) => {
    const extension = type === 'javascript' ? 'js' : type;
    const mimeType = type === 'javascript' ? 'application/javascript' : 
                     type === 'css' ? 'text/css' : 
                     'text/html';
    
    const blob = new Blob([code], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minified.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addMessage('success', 'Minifier', `Fichier téléchargé: minified.${extension}`);
  };

  const getCurrentCode = () => {
    return minifiedCodes[activeTab];
  };

  const getOriginalSize = () => {
    return originalCodes[activeTab].length;
  };

  const getMinifiedSize = () => {
    return getCurrentCode().length;
  };

  const getCompressionRatio = () => {
    const original = getOriginalSize();
    const minified = getMinifiedSize();
    
    if (original === 0) return 0;
    return Math.round((1 - minified / original) * 100);
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'javascript': return 'javascript';
      default: return 'html';
    }
  };

  return (
    <Card className="neumorph-panel h-full flex flex-col">
      <CardHeader className="p-4 bg-muted/30 rounded-t-2xl border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Minimize2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Minification de Code</h3>
          </div>
          
          <Button 
            onClick={handleMinifyAll}
            disabled={isMinifying}
            className="neumorph-button px-4"
            size="sm"
          >
            {isMinifying ? 'Minification...' : 'Minifier Tout'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-auto grid-cols-3 bg-background neumorph-flat">
              <TabsTrigger value="html" className="neumorph-tab data-[state=active]:neumorph-pressed">HTML</TabsTrigger>
              <TabsTrigger value="css" className="neumorph-tab data-[state=active]:neumorph-pressed">CSS</TabsTrigger>
              <TabsTrigger value="javascript" className="neumorph-tab data-[state=active]:neumorph-pressed">JS</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              {getCurrentCode() && (
                <>
                  <div className="text-xs text-muted-foreground neumorph-flat px-3 py-1 rounded-lg">
                    -{getCompressionRatio()}% ({getOriginalSize()} → {getMinifiedSize()} chars)
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(getCurrentCode())}
                    className="neumorph-button h-8 w-8 p-0"
                    title="Copier le code minifié"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(getCurrentCode(), activeTab)}
                    className="neumorph-button h-8 w-8 p-0"
                    title="Télécharger le code minifié"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0 flex-1">
            <div className="h-full neumorph-inset rounded-xl overflow-hidden">
              {getCurrentCode() ? (
                <MonacoEditor
                  value={getCurrentCode()}
                  language={getLanguage()}
                  theme="vs-light"
                  readOnly
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Cliquez sur "Minifier Tout" pour commencer</p>
                    <p className="text-xs mt-1">Le code minifié apparaîtra ici</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}