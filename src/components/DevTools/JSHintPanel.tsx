import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, XCircle, Play, RotateCcw, FileText } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';
import { useDevConsole } from './DevConsole';

export function JSHintPanel() {
  const { originalCode, currentLanguage } = useEditorStore();
  const { addMessage } = useDevConsole();
  
  const [code, setCode] = useState(originalCode || `function exampleFunction() {
    var x = 5;
    console.log(x);
    return x * 2;
}`);
  
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Synchroniser avec le code de l'éditeur principal
  useEffect(() => {
    if (originalCode && currentLanguage === 'javascript') {
      setCode(originalCode);
    }
  }, [originalCode, currentLanguage]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    addMessage('info', 'JSHint', 'Début de l\'analyse du code JavaScript...');
    
    // Analyse JSHint simulée mais plus réaliste
    setTimeout(() => {
      const lines = code.split('\n');
      const mockResults = [];
      
      // Vérifications basiques
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Variables non utilisées
        if (line.includes('var ') && !code.includes(line.split('var ')[1].split(' ')[0].split('=')[0])) {
          mockResults.push({
            id: `var-${lineNum}`,
            line: lineNum,
            character: line.indexOf('var') + 1,
            reason: `Variable '${line.split('var ')[1].split(' ')[0].split('=')[0]}' définie mais jamais utilisée.`,
            severity: 'warning'
          });
        }
        
        // Missing semicolons
        if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}')) {
          if (!line.includes('function') && !line.includes('if') && !line.includes('for') && !line.includes('while')) {
            mockResults.push({
              id: `semicolon-${lineNum}`,
              line: lineNum,
              character: line.length,
              reason: 'Point-virgule manquant.',
              severity: 'error'
            });
          }
        }
        
        // Console.log en production
        if (line.includes('console.log')) {
          mockResults.push({
            id: `console-${lineNum}`,
            line: lineNum,
            character: line.indexOf('console.log') + 1,
            reason: 'Évitez console.log en production.',
            severity: 'info'
          });
        }
      });
      
      // Vérification globale
      if (!code.includes('use strict')) {
        mockResults.unshift({
          id: 'strict-mode',
          line: 1,
          character: 1,
          reason: "Déclaration 'use strict' manquante.",
          severity: 'info'
        });
      }
      
      setResults(mockResults);
      setIsAnalyzing(false);
      
      const errorCount = mockResults.filter(r => r.severity === 'error').length;
      const warningCount = mockResults.filter(r => r.severity === 'warning').length;
      
      addMessage(
        errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'success',
        'JSHint',
        `Analyse terminée: ${errorCount} erreur(s), ${warningCount} avertissement(s), ${mockResults.length - errorCount - warningCount} info(s)`
      );
    }, 1200);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'destructive';
      case 'warning': return 'default';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <Card className="neumorph-panel">
        <CardHeader className="p-4 bg-muted/30 rounded-t-2xl border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">JSHint - Analyse de Code</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={analyzeCode}
                disabled={isAnalyzing}
                className="neumorph-button"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyse...' : 'Analyser'}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setResults([]);
                  addMessage('info', 'JSHint', 'Résultats effacés');
                }}
                className="neumorph-button"
                size="sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Effacer
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-48 font-mono text-sm neumorph-inset resize-none"
            placeholder="Entrez votre code JavaScript ici..."
          />
        </CardContent>
      </Card>

      <Card className="neumorph-panel flex-1">
        <CardHeader className="p-4 bg-muted/30 rounded-t-2xl border-b border-border/30">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Résultats de l'analyse</h4>
            {results.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="destructive" className="text-xs">
                  {results.filter(r => r.severity === 'error').length} erreurs
                </Badge>
                <Badge variant="default" className="text-xs">
                  {results.filter(r => r.severity === 'warning').length} avertissements
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {results.filter(r => r.severity === 'info').length} infos
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
          {results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Aucun problème détecté ou analyse non effectuée</p>
              <p className="text-xs mt-1">Cliquez sur "Analyser" pour commencer</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result) => (
                <Alert key={result.id} className="neumorph-flat transition-all hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-1">
                      {getSeverityIcon(result.severity)}
                    </div>
                    <div className="flex-1">
                      <AlertDescription className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            Ligne {result.line}:{result.character}
                          </Badge>
                          <Badge variant={getSeverityColor(result.severity)} className="text-xs capitalize">
                            {result.severity}
                          </Badge>
                        </div>
                        <p className="text-foreground">{result.reason}</p>
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}