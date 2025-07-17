import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import useDevToolsStore from '@/stores/useDevToolsStore';

// Import dynamique de JSHint pour éviter les erreurs SSR
let JSHINT: any = null;
if (typeof window !== 'undefined') {
  import('jshint').then(module => {
    JSHINT = module.JSHINT;
  });
}

export function JSHintPanel() {
  const { jsCode, jshintResults, setJshintResults } = useDevToolsStore();

  useEffect(() => {
    if (!JSHINT || !jsCode.trim()) {
      setJshintResults([]);
      return;
    }

    try {
      // Configuration JSHint
      const options = {
        esversion: 6,
        browser: true,
        devel: true,
        jquery: true,
        node: false
      };

      const result = JSHINT(jsCode, options);
      
      if (JSHINT.errors) {
        const errors = JSHINT.errors
          .filter(error => error) // Filtrer les erreurs null
          .map(error => ({
            line: error.line,
            character: error.character,
            reason: error.reason,
            evidence: error.evidence,
            severity: error.code && error.code.startsWith('W') ? 'warning' : 'error'
          }));
        
        setJshintResults(errors);
      } else {
        setJshintResults([]);
      }
    } catch (error) {
      console.error('Erreur JSHint:', error);
      setJshintResults([{
        line: 1,
        character: 1,
        reason: 'Erreur lors de l\'analyse JSHint',
        evidence: '',
        severity: 'error'
      }]);
    }
  }, [jsCode, setJshintResults]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'bg-destructive/10 border-destructive/20 text-destructive-foreground';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning-foreground';
      default:
        return 'bg-muted/10 border-muted/20 text-muted-foreground';
    }
  };

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold">Analyse JSHint</h3>
          {jshintResults.length === 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-xs text-success">Aucune erreur</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 max-h-96 overflow-auto custom-scrollbar">
        {jshintResults.length > 0 ? (
          <div className="space-y-3">
            {jshintResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border ${getSeverityClass(result.severity)} neumorph-flat`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(result.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono bg-background/50 px-2 py-1 rounded">
                        Ligne {result.line}:{result.character}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {result.severity}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">{result.reason}</p>
                    {result.evidence && (
                      <pre className="text-xs bg-background/30 p-2 rounded font-mono overflow-x-auto">
                        {result.evidence}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
            <p className="text-sm">Votre code JavaScript est propre !</p>
            <p className="text-xs mt-1">Aucune erreur ou avertissement détecté</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}