import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MonacoEditor } from '../Editor/MonacoEditor';
import { Shield, Download, Copy, FileText, Settings } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useEditorStore from '@/stores/useEditorStore';

// Import dynamique pour éviter les erreurs SSR
type JavaScriptObfuscatorModule = typeof import('javascript-obfuscator');
const JavaScriptObfuscator: { current: JavaScriptObfuscatorModule | null } = { current: null };

if (typeof window !== 'undefined') {
  import('javascript-obfuscator').then(module => {
    JavaScriptObfuscator.current = module.default;
  });
}

interface ObfuscationOptions {
  compact: boolean;
  controlFlowFlattening: boolean;
  deadCodeInjection: boolean;
  stringArray: boolean;
  stringArrayEncoding: string[];
  transformObjectKeys: boolean;
  unicodeEscapeSequence: boolean;
}

export function ObfuscationPanel() {
  const originalCode = useEditorStore(state => state.originalCode);
  const currentLanguage = useEditorStore(state => state.currentLanguage);
  const [obfuscatedCode, setObfuscatedCode] = React.useState('');
  
  const [isObfuscating, setIsObfuscating] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<ObfuscationOptions>({
    compact: true,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    transformObjectKeys: false,
    unicodeEscapeSequence: false
  });

  const handleObfuscate = async () => {
    if (!JavaScriptObfuscator || !originalCode.trim() || !['javascript', 'typescript'].includes(currentLanguage)) return;
    
    setIsObfuscating(true);
    
    try {
      const obfuscationResult = JavaScriptObfuscator.obfuscate(originalCode, {
        compact: options.compact,
        controlFlowFlattening: options.controlFlowFlattening,
        controlFlowFlatteningThreshold: 0.75,
        deadCodeInjection: options.deadCodeInjection,
        deadCodeInjectionThreshold: 0.4,
        stringArray: options.stringArray,
        stringArrayThreshold: 0.75,
        stringArrayEncoding: options.stringArrayEncoding,
        transformObjectKeys: options.transformObjectKeys,
        unicodeEscapeSequence: options.unicodeEscapeSequence,
        target: 'browser'
      });
      
      setObfuscatedCode(obfuscationResult.getObfuscatedCode());
    } catch (error) {
      console.error('Erreur lors de l\'obfuscation:', error);
      setObfuscatedCode('// Erreur lors de l\'obfuscation du code');
    }
    
    setIsObfuscating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(obfuscatedCode);
  };

  const handleDownload = () => {
    const blob = new Blob([obfuscatedCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obfuscated.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOptionChange = (key: keyof ObfuscationOptions, value: boolean | string[]) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getCompressionInfo = () => {
    if (!originalCode || !obfuscatedCode) return null;
    
    const originalSize = originalCode.length;
    const obfuscatedSize = obfuscatedCode.length;
    const ratio = Math.round((obfuscatedSize / originalSize) * 100);
    
    return {
      original: originalSize,
      obfuscated: obfuscatedSize,
      ratio: ratio
    };
  };

  const compressionInfo = getCompressionInfo();

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Obfuscation JavaScript</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <Collapsible open={showOptions} onOpenChange={setShowOptions}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="neumorph-button h-8 w-8 p-0"
                  title="Options d'obfuscation"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Button 
              onClick={handleObfuscate}
              disabled={isObfuscating || !originalCode.trim() || !['javascript', 'typescript'].includes(currentLanguage)}
              className="neumorph-button px-4"
              size="sm"
            >
              {isObfuscating ? 'Obfuscation...' : 'Obfusquer'}
            </Button>
          </div>
        </div>

        <Collapsible open={showOptions} onOpenChange={setShowOptions}>
          <CollapsibleContent className="mt-4">
            <div className="neumorph-inset p-4 rounded-xl space-y-3">
              <h4 className="text-sm font-medium text-foreground mb-3">Options d'obfuscation</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="compact"
                    checked={options.compact}
                    onCheckedChange={(checked) => handleOptionChange('compact', !!checked)}
                  />
                  <Label htmlFor="compact" className="text-xs">Code compact</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="controlFlow"
                    checked={options.controlFlowFlattening}
                    onCheckedChange={(checked) => handleOptionChange('controlFlowFlattening', !!checked)}
                  />
                  <Label htmlFor="controlFlow" className="text-xs">Aplatissement du flux</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="deadCode"
                    checked={options.deadCodeInjection}
                    onCheckedChange={(checked) => handleOptionChange('deadCodeInjection', !!checked)}
                  />
                  <Label htmlFor="deadCode" className="text-xs">Injection de code mort</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="stringArray"
                    checked={options.stringArray}
                    onCheckedChange={(checked) => handleOptionChange('stringArray', !!checked)}
                  />
                  <Label htmlFor="stringArray" className="text-xs">Tableau de chaînes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="transformKeys"
                    checked={options.transformObjectKeys}
                    onCheckedChange={(checked) => handleOptionChange('transformObjectKeys', !!checked)}
                  />
                  <Label htmlFor="transformKeys" className="text-xs">Transform. clés d'objet</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="unicode"
                    checked={options.unicodeEscapeSequence}
                    onCheckedChange={(checked) => handleOptionChange('unicodeEscapeSequence', !!checked)}
                  />
                  <Label htmlFor="unicode" className="text-xs">Séquences Unicode</Label>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground">
            Code JavaScript obfusqué
          </div>
          
          <div className="flex items-center gap-2">
            {compressionInfo && (
              <div className="text-xs text-muted-foreground neumorph-flat px-3 py-1 rounded-lg">
                {compressionInfo.ratio}% de la taille originale ({compressionInfo.original} → {compressionInfo.obfuscated} chars)
              </div>
            )}
            
            {obfuscatedCode && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="neumorph-button h-8 w-8 p-0"
                  title="Copier le code obfusqué"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="neumorph-button h-8 w-8 p-0"
                  title="Télécharger le code obfusqué"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="h-96 neumorph-inset rounded-xl overflow-hidden">
          {obfuscatedCode ? (
            <MonacoEditor
              value={obfuscatedCode}
              language="javascript"
              theme="vs-light"
              readOnly
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Cliquez sur "Obfusquer" pour sécuriser votre code</p>
                <p className="text-xs mt-1">L'obfuscation rend le code difficile à lire et analyser</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}