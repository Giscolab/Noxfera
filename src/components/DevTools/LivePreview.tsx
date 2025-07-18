import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from '../Editor/MonacoEditor';
import { RefreshCw, ExternalLink, Code, Eye } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';

export function LivePreview() {
  const { originalCode, currentLanguage } = useEditorStore();
  
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Bienvenue dans l'aperçu live !</p>
</body>
</html>`);
  
  const [cssCode, setCssCode] = useState(`body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    margin: 0;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

p {
    text-align: center;
    font-size: 1.2rem;
    opacity: 0.9;
}`);
  
  const [jsCode, setJsCode] = useState(`console.log('Live Preview initialisé !');

// Animation simple
document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('h1');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
        title.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 100);
    }
});`);

  const [activeTab, setActiveTab] = useState('html');
  const [previewKey, setPreviewKey] = useState(0);

  // Synchronisation avec l'éditeur principal
  useEffect(() => {
    if (currentLanguage === 'html' && originalCode !== htmlCode) {
      setHtmlCode(originalCode);
    } else if (currentLanguage === 'css' && originalCode !== cssCode) {
      setCssCode(originalCode);
    } else if (currentLanguage === 'javascript' && originalCode !== jsCode) {
      setJsCode(originalCode);
    }
  }, [originalCode, currentLanguage]);

  // Debounce pour éviter les refreshs trop fréquents
  const [debouncedHTML, setDebouncedHTML] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedHTML(generatePreviewHTML());
    }, 300); // 300ms de debounce

    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode]);

  const generatePreviewHTML = () => {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>${cssCode}</style>
</head>
<body>
    ${htmlCode.replace(/<!DOCTYPE.*?<body[^>]*>/is, '').replace(/<\/body>.*?<\/html>/is, '')}
    <script>${jsCode}</script>
</body>
</html>`;
  };
  
  // Memoization du HTML généré avec debounce
  const previewHTML = useMemo(() => debouncedHTML, [debouncedHTML]);

  const handleRefresh = () => {
    setPreviewKey(prev => prev + 1);
    setDebouncedHTML(generatePreviewHTML());
  };

  const handleOpenExternal = () => {
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return htmlCode;
      case 'css': return cssCode;
      case 'js': return jsCode;
      default: return '';
    }
  };

  const handleCodeChange = (value: string) => {
    switch (activeTab) {
      case 'html': setHtmlCode(value); break;
      case 'css': setCssCode(value); break;
      case 'js': setJsCode(value); break;
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': return 'javascript';
      default: return 'html';
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Éditeur à gauche */}
      <Card className="neumorph-panel flex flex-col">
        <CardHeader className="p-4 bg-muted/30 flex flex-row items-center justify-between rounded-t-2xl border-b border-border/30">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Éditeur de Code</h3>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="grid w-auto grid-cols-3 bg-background neumorph-flat">
              <TabsTrigger value="html" className="neumorph-tab data-[state=active]:neumorph-pressed">HTML</TabsTrigger>
              <TabsTrigger value="css" className="neumorph-tab data-[state=active]:neumorph-pressed">CSS</TabsTrigger>
              <TabsTrigger value="js" className="neumorph-tab data-[state=active]:neumorph-pressed">JS</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent className="p-0 flex-1">
          <div className="h-[500px] neumorph-inset rounded-b-2xl overflow-hidden">
            <MonacoEditor
              value={getCurrentCode()}
              onChange={handleCodeChange}
              language={getLanguage()}
              theme="vs-light"
            />
          </div>
        </CardContent>
      </Card>

      {/* Aperçu à droite */}
      <Card className="neumorph-panel flex flex-col">
        <CardHeader className="p-4 bg-muted/30 flex flex-row items-center justify-between rounded-t-2xl border-b border-border/30">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Aperçu Live</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh}
              className="neumorph-button h-8 w-8 p-0"
              title="Rafraîchir l'aperçu"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleOpenExternal}
              className="neumorph-button h-8 w-8 p-0"
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1">
          <div className="h-[500px] neumorph-inset rounded-b-2xl overflow-hidden">
            <iframe
              key={previewKey}
              className="w-full h-full border-none bg-white rounded-b-2xl"
              title="Aperçu du code"
              srcDoc={previewHTML}
              sandbox="allow-scripts allow-same-origin allow-modals"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}