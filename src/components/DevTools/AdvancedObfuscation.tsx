import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoEditor } from '../Editor/MonacoEditor';
import { Shield, Download, Copy, FileText, Settings, Palette } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useEditorStore from '@/stores/useEditorStore';

// Import dynamique pour JavaScript Obfuscator
let JavaScriptObfuscator: any = null;
let htmlMinifier: any = null;
let CleanCSS: any = null;

if (typeof window !== 'undefined') {
  import('javascript-obfuscator').then(module => {
    JavaScriptObfuscator = module.default;
  });
  
  import('html-minifier-terser').then(module => {
    htmlMinifier = module;
  });
}

export function AdvancedObfuscation() {
  const { toast } = useToast();
  const { originalCode, currentLanguage } = useEditorStore();
  
  const [activeTab, setActiveTab] = useState('js');
  const [obfuscatedContent, setObfuscatedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<{
    originalSize: number;
    processedSize: number;
    compressionRatio: number;
  } | null>(null);

  const processContent = async () => {
    if (!originalCode.trim()) return;
    
    setIsProcessing(true);
    
    try {
      let processed = '';
      const originalSize = originalCode.length;
      
      switch (currentLanguage) {
        case 'javascript':
        case 'typescript':
          if (JavaScriptObfuscator) {
            const result = JavaScriptObfuscator.obfuscate(originalCode, {
              compact: true,
              controlFlowFlattening: true,
              controlFlowFlatteningThreshold: 0.8,
              deadCodeInjection: true,
              deadCodeInjectionThreshold: 0.4,
              stringArray: true,
              stringArrayThreshold: 0.8,
              stringArrayEncoding: ['base64', 'rc4'],
              transformObjectKeys: true,
              unicodeEscapeSequence: true,
              target: 'browser'
            });
            processed = result.getObfuscatedCode();
          }
          break;
          
        case 'html':
          if (htmlMinifier?.minify) {
            processed = htmlMinifier.minify(originalCode, {
              removeAttributeQuotes: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
              collapseWhitespace: true,
              minifyCSS: true,
              minifyJS: true,
              processScripts: ['text/html']
            });
          }
          break;
          
        case 'css':
          // Simulation de minification CSS
          processed = originalCode
            .replace(/\/\*.*?\*\//g, '') // Supprimer commentaires
            .replace(/\s+/g, ' ') // Réduire espaces
            .replace(/;\s*}/g, '}') // Optimiser 
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*:\s*/g, ':')
            .trim();
          break;
          
        default:
          processed = originalCode;
      }
      
      const processedSize = processed.length;
      const compressionRatio = Math.round(((originalSize - processedSize) / originalSize) * 100);
      
      setObfuscatedContent(processed);
      setStats({
        originalSize,
        processedSize,
        compressionRatio
      });
      
      toast({
        title: "Traitement terminé !",
        description: `Code ${currentLanguage} traité avec succès (${compressionRatio}% de compression)`,
        duration: 3000,
      });
      
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le code",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    setIsProcessing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(obfuscatedContent);
      toast({
        title: "Code copié !",
        description: "Le code traité a été copié dans le presse-papiers",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDownload = () => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      html: 'html',
      css: 'css'
    };
    
    const extension = extensions[currentLanguage as keyof typeof extensions] || 'txt';
    const filename = `processed_${Date.now()}.${extension}`;
    
    const blob = new Blob([obfuscatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Fichier téléchargé !",
      description: `Code sauvegardé dans ${filename}`,
      duration: 3000,
    });
  };

  const getProcessingLabel = () => {
    switch (currentLanguage) {
      case 'javascript':
      case 'typescript':
        return 'Obfusquer JS';
      case 'html':
        return 'Minifier HTML';
      case 'css':
        return 'Minifier CSS';
      default:
        return 'Traiter';
    }
  };

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Traitement Avancé</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {currentLanguage.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={processContent}
              disabled={isProcessing || !originalCode.trim()}
              className="neumorph-button px-4"
              size="sm"
            >
              {isProcessing ? 'Traitement...' : getProcessingLabel()}
            </Button>
          </div>
        </div>

        {stats && (
          <div className="mt-3 neumorph-inset p-3 rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Original</div>
                <div className="font-mono font-medium text-sm">{stats.originalSize.toLocaleString()} chars</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Traité</div>
                <div className="font-mono font-medium text-sm">{stats.processedSize.toLocaleString()} chars</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Compression</div>
                <div className="font-mono font-medium text-sm text-primary">
                  {stats.compressionRatio > 0 ? '-' : '+'}{Math.abs(stats.compressionRatio)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Code {currentLanguage} traité
          </div>
          
          <div className="flex items-center gap-2">
            {obfuscatedContent && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="neumorph-button h-8 w-8 p-0"
                  title="Copier le code traité"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="neumorph-button h-8 w-8 p-0"
                  title="Télécharger le code traité"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="h-96 neumorph-inset rounded-xl overflow-hidden">
          {obfuscatedContent ? (
            <MonacoEditor
              value={obfuscatedContent}
              language={currentLanguage === 'typescript' ? 'javascript' : currentLanguage}
              theme="vs-light"
              readOnly
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Cliquez sur "{getProcessingLabel()}" pour traiter votre code</p>
                <p className="text-xs mt-1">
                  {currentLanguage === 'javascript' && 'Obfuscation avancée avec protection contre le reverse engineering'}
                  {currentLanguage === 'html' && 'Minification HTML avec optimisation CSS/JS intégrée'}
                  {currentLanguage === 'css' && 'Minification CSS avec suppression de commentaires et espaces'}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}