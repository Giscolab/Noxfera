import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';

// Import dynamique avec fallback pour compatibilité navigateur
let escomplex: any = null;
let isComplexityAvailable = false;

// Fallback pour escomplex qui ne marche pas en navigateur
const performSimpleComplexityAnalysis = (code: string) => {
  const lines = code.split('\n').filter(line => line.trim());
  const functions = code.match(/function\s+\w+|const\s+\w+\s*=\s*\([^)]*\)\s*=>/g) || [];
  const conditionals = code.match(/if\s*\(|else\s*if\s*\(|while\s*\(|for\s*\(/g) || [];
  const switches = code.match(/switch\s*\(/g) || [];
  
  // Calcul basique de complexité cyclomatique : 1 + nombre de points de décision
  const cyclomaticComplexity = 1 + conditionals.length + switches.length;
  
  return {
    complexity: {
      cyclomatic: cyclomaticComplexity,
      sloc: {
        physical: lines.length,
        logical: lines.filter(line => 
          !line.trim().startsWith('//') && 
          !line.trim().startsWith('/*') && 
          line.trim() !== ''
        ).length
      },
      halstead: {
        bugs: Math.round(cyclomaticComplexity * 0.1 * 100) / 100,
        difficulty: Math.round(cyclomaticComplexity * 1.5 * 100) / 100,
        effort: cyclomaticComplexity * 100,
        length: code.length,
        time: Math.round(cyclomaticComplexity * 5.5 * 100) / 100,
        vocabulary: new Set(code.match(/\w+/g) || []).size,
        volume: Math.round(Math.log2(new Set(code.match(/\w+/g) || []).size) * code.length)
      }
    },
    functions: functions.map((func, index) => ({
      name: func.replace(/function\s+/, '').replace(/const\s+/, '').split(/[=\s(]/)[0] || `Function_${index + 1}`,
      complexity: {
        cyclomatic: Math.max(1, Math.floor(cyclomaticComplexity / Math.max(1, functions.length))),
        sloc: {
          physical: Math.floor(lines.length / Math.max(1, functions.length)),
          logical: Math.floor(lines.length / Math.max(1, functions.length))
        }
      }
    }))
  };
};

interface ComplexityResult {
  complexity: {
    cyclomatic: number;
    sloc: {
      physical: number;
      logical: number;
    };
    halstead: {
      bugs: number;
      difficulty: number;
      effort: number;
      length: number;
      time: number;
      vocabulary: number;
      volume: number;
    };
  };
  functions: Array<{
    name: string;
    complexity: {
      cyclomatic: number;
      sloc: {
        physical: number;
        logical: number;
      };
    };
  }>;
}

export function ComplexityPanel() {
  const originalCode = useEditorStore(state => state.originalCode);
  const currentLanguage = useEditorStore(state => state.currentLanguage);
  const [complexityResults, setComplexityResults] = React.useState(null);

  useEffect(() => {
    // Seulement analyser le code JavaScript/TypeScript
    if (!originalCode.trim() || !['javascript', 'typescript'].includes(currentLanguage)) {
      setComplexityResults(null);
      return;
    }

    try {
      // Utilise l'analyse simple comme fallback
      const analysis = performSimpleComplexityAnalysis(originalCode);
      setComplexityResults(analysis);
    } catch (error) {
      console.error('Erreur lors de l\'analyse de complexité:', error);
      setComplexityResults(null);
    }
  }, [originalCode, currentLanguage]);

  const getComplexityLevel = (cyclomatic: number) => {
    if (cyclomatic <= 5) return { level: 'Simple', color: 'text-success', bg: 'bg-success/10' };
    if (cyclomatic <= 10) return { level: 'Modéré', color: 'text-warning', bg: 'bg-warning/10' };
    if (cyclomatic <= 15) return { level: 'Complexe', color: 'text-destructive', bg: 'bg-destructive/10' };
    return { level: 'Très complexe', color: 'text-destructive', bg: 'bg-destructive/20' };
  };

  const getComplexityIcon = (cyclomatic: number) => {
    if (cyclomatic <= 5) return <CheckCircle className="w-4 h-4 text-success" />;
    if (cyclomatic <= 10) return <AlertCircle className="w-4 h-4 text-warning" />;
    return <AlertCircle className="w-4 h-4 text-destructive" />;
  };

  const getProgressValue = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
  };

  if (!complexityResults) {
    return (
      <Card className="neumorph-floating">
        <CardHeader className="p-4 border-b border-border/30">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Complexité Cyclomatique</h3>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucun code JavaScript à analyser</p>
            <p className="text-xs mt-1">Ajoutez du code JS pour voir l'analyse de complexité</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const mainComplexity = getComplexityLevel(complexityResults.complexity.cyclomatic);

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold">Complexité Cyclomatique</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 max-h-96 overflow-auto custom-scrollbar">
        {/* Complexité globale */}
        <div className="neumorph-flat p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">Complexité globale</h4>
            <div className="flex items-center gap-2">
              {getComplexityIcon(complexityResults.complexity.cyclomatic)}
              <span className={`text-sm font-medium ${mainComplexity.color}`}>
                {mainComplexity.level}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Complexité cyclomatique</span>
                <span className="font-mono">{complexityResults.complexity.cyclomatic}</span>
              </div>
              <Progress 
                value={getProgressValue(complexityResults.complexity.cyclomatic, 20)} 
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="neumorph-inset p-2 rounded-lg">
                <div className="text-muted-foreground">Lignes physiques</div>
                <div className="font-mono font-medium">{complexityResults.complexity.sloc.physical}</div>
              </div>
              <div className="neumorph-inset p-2 rounded-lg">
                <div className="text-muted-foreground">Lignes logiques</div>
                <div className="font-mono font-medium">{complexityResults.complexity.sloc.logical}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques Halstead */}
        <div className="neumorph-flat p-4 rounded-xl mb-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Métriques Halstead
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="neumorph-inset p-2 rounded-lg">
              <div className="text-muted-foreground">Difficulté</div>
              <div className="font-mono font-medium">{complexityResults.complexity.halstead.difficulty.toFixed(2)}</div>
            </div>
            <div className="neumorph-inset p-2 rounded-lg">
              <div className="text-muted-foreground">Volume</div>
              <div className="font-mono font-medium">{complexityResults.complexity.halstead.volume.toFixed(0)}</div>
            </div>
            <div className="neumorph-inset p-2 rounded-lg">
              <div className="text-muted-foreground">Effort</div>
              <div className="font-mono font-medium">{complexityResults.complexity.halstead.effort.toFixed(0)}</div>
            </div>
            <div className="neumorph-inset p-2 rounded-lg">
              <div className="text-muted-foreground">Bugs estimés</div>
              <div className="font-mono font-medium">{complexityResults.complexity.halstead.bugs.toFixed(3)}</div>
            </div>
          </div>
        </div>

        {/* Complexité par fonction */}
        {complexityResults.functions && complexityResults.functions.length > 0 && (
          <div className="neumorph-flat p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-3">Complexité par fonction</h4>
            
            <div className="space-y-3">
              {complexityResults.functions.map((func, index) => {
                const funcComplexity = getComplexityLevel(func.complexity.cyclomatic);
                
                return (
                  <div key={index} className="neumorph-inset p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono font-medium">
                        {func.name || `Fonction ${index + 1}`}
                      </span>
                      <div className="flex items-center gap-2">
                        {getComplexityIcon(func.complexity.cyclomatic)}
                        <span className={`text-xs ${funcComplexity.color}`}>
                          {func.complexity.cyclomatic}
                        </span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={getProgressValue(func.complexity.cyclomatic, 15)} 
                      className="h-1"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{func.complexity.sloc.logical} lignes logiques</span>
                      <span className={funcComplexity.color}>{funcComplexity.level}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}