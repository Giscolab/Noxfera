import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoEditor } from '../Editor/MonacoEditor';
import { Minimize2, Download, Copy, FileText } from 'lucide-react';
import useDevToolsStore from '@/stores/useDevToolsStore';

// Imports dynamiques pour éviter les erreurs SSR
let terser: any = null;
let htmlMinifier: any = null;

if (typeof window !== 'undefined') {
  import('terser').then(module => {
    terser = module;
  });
  
  import('html-minifier-terser').then(module => {
    htmlMinifier = module;
  });
}

export function MinificationPanel() {
  const { 
    htmlCode, 
    cssCode, 
    jsCode, 
    minifiedCode, 
    setMinifiedCode 
  } = useDevToolsStore();

  const [isMinifying, setIsMinifying] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  const minifyCSS = (css: string): string => {
    // Minification CSS simple (enlever commentaires, espaces, nouvelles lignes)
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Supprimer commentaires
      .replace(/\s+/g, ' ') // Remplacer multiples espaces par un seul
      .replace(/;\s*}/g, '}') // Supprimer point-virgule avant accolade fermante
      .replace(/\s*{\s*/g, '{') // Supprimer espaces autour des accolades ouvrantes
      .replace(/}\s*/g, '}') // Supprimer espaces après accolades fermantes
      .replace(/:\s*/g, ':') // Supprimer espaces après deux-points
      .replace(/;\s*/g, ';') // Supprimer espaces après point-virgule
      .trim();
  };

  const handleMinifyAll = async () => {
    setIsMinifying(true);
    
    try {
      let minifiedHTML = htmlCode;
      let minifiedCSS = cssCode;
      let minifiedJS = jsCode;

      // Minifier HTML
      if (htmlMinifier && htmlCode.trim()) {
        try {
          minifiedHTML = htmlMinifier.minify(htmlCode, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true,
            minifyCSS: true,
            minifyJS: true
          });
        } catch (error) {
          console.error('Erreur minification HTML:', error);
        }
      }

      // Minifier CSS
      if (cssCode.trim()) {
        minifiedCSS = minifyCSS(cssCode);
      }

      // Minifier JavaScript
      if (terser && jsCode.trim()) {
        try {
          const result = await terser.minify(jsCode, {
            compress: {
              dead_code: true,
              drop_console: false,
              drop_debugger: true,
              keep_fnames: false,
              keep_fargs: false
            },
            mangle: {
              keep_fnames: false
            },
            format: {
              comments: false
            }
          });
          
          if (result.code) {
            minifiedJS = result.code;
          }
        } catch (error) {
          console.error('Erreur minification JS:', error);
        }
      }

      setMinifiedCode({
        html: minifiedHTML,
        css: minifiedCSS,
        js: minifiedJS
      });
    } catch (error) {
      console.error('Erreur lors de la minification:', error);
    }
    
    setIsMinifying(false);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = (code: string, type: string) => {
    const extension = type === 'js' ? 'js' : type === 'css' ? 'css' : 'html';
    const mimeType = type === 'js' ? 'application/javascript' : 
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
  };

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html': return minifiedCode.html;
      case 'css': return minifiedCode.css;
      case 'js': return minifiedCode.js;
      default: return '';
    }
  };

  const getOriginalSize = () => {
    switch (activeTab) {
      case 'html': return htmlCode.length;
      case 'css': return cssCode.length;
      case 'js': return jsCode.length;
      default: return 0;
    }
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
      case 'js': return 'javascript';
      default: return 'html';
    }
  };

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Minimize2 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Minification de Code</h3>
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
      
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-auto grid-cols-3 bg-background neumorph-flat">
              <TabsTrigger value="html" className="neumorph-tab data-[state=active]:neumorph-pressed">HTML</TabsTrigger>
              <TabsTrigger value="css" className="neumorph-tab data-[state=active]:neumorph-pressed">CSS</TabsTrigger>
              <TabsTrigger value="js" className="neumorph-tab data-[state=active]:neumorph-pressed">JS</TabsTrigger>
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

          <TabsContent value={activeTab} className="mt-0">
            <div className="h-64 neumorph-inset rounded-xl overflow-hidden">
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