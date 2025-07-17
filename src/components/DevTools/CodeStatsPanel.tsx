import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  FileText, 
  Code2, 
  Layers, 
  Repeat, 
  Clock,
  Download,
  Copy,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle
} from 'lucide-react';
import useDevToolsStore from '@/stores/useDevToolsStore';
import { useDevConsole } from './DevConsole';

interface CodeStats {
  lines: number;
  htmlLines: number;
  cssLines: number;
  jsLines: number;
  functions: number;
  indentation: string;
  duplication: number;
  size: number;
  complexity: number;
  comments: number;
  commentRatio: number;
  maintainabilityIndex: number;
  codeSmells: string[];
}

export function CodeStatsPanel() {
  const { 
    htmlCode, 
    cssCode, 
    jsCode, 
    codeStats, 
    setCodeStats 
  } = useDevToolsStore();

  const { addMessage } = useDevConsole();

  useEffect(() => {
    const analyzeCode = () => {
      const allCode = `${htmlCode}\n${cssCode}\n${jsCode}`;
      
      // Comptage des lignes détaillé
      const totalLines = allCode.split('\n').length;
      const htmlLines = htmlCode.split('\n').length;
      const cssLines = cssCode.split('\n').length;
      const jsLines = jsCode.split('\n').length;
      const nonEmptyLines = allCode.split('\n').filter(line => line.trim().length > 0).length;
      
      // Détection de l'indentation plus précise
      const indentationMatches = allCode.match(/^(\s+)/gm) || [];
      let tabCount = 0;
      let spaceCount = 0;
      
      indentationMatches.forEach(match => {
        if (match.includes('\t')) tabCount++;
        else spaceCount++;
      });
      
      const indentationType = tabCount > spaceCount ? 'tabs' : 'spaces';
      
      // Comptage des fonctions JavaScript plus précis
      const functionPatterns = [
        /function\s+\w+\s*\(/g,
        /\w+\s*:\s*function\s*\(/g,
        /\w+\s*=\s*function\s*\(/g,
        /\w+\s*=>\s*{/g,
        /\w+\s*=\s*\([^)]*\)\s*=>/g
      ];
      
      let functionCount = 0;
      functionPatterns.forEach(pattern => {
        const matches = jsCode.match(pattern) || [];
        functionCount += matches.length;
      });
      
      // Estimation de duplication de code
      const lines = allCode.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('//') && !line.startsWith('/*'));
      
      const lineOccurrences = new Map<string, number>();
      lines.forEach(line => {
        lineOccurrences.set(line, (lineOccurrences.get(line) || 0) + 1);
      });
      
      const duplicatedLines = Array.from(lineOccurrences.entries())
        .filter(([_, count]) => count > 1)
        .reduce((sum, [_, count]) => sum + count - 1, 0);
      
      const duplicationPercentage = lines.length > 0 
        ? Math.round((duplicatedLines / lines.length) * 100)
        : 0;
      
      // Taille en bytes
      const totalSize = new Blob([allCode]).size;
      
      // Complexité estimée avancée
      const complexityPatterns = [
        /if\s*\(/g,        // Conditions
        /else\s+if/g,      // Else if
        /for\s*\(/g,       // Boucles for
        /while\s*\(/g,     // Boucles while
        /switch\s*\(/g,    // Switch
        /catch\s*\(/g,     // Try-catch
        /\?\s*[^:]+\s*:/g, // Opérateurs ternaires
        /&&|\|\|/g,        // Opérateurs logiques
        /function\s/g      // Fonctions
      ];
      
      let complexityScore = 0;
      complexityPatterns.forEach(pattern => {
        const matches = allCode.match(pattern) || [];
        complexityScore += matches.length;
      });
      
      // Comptage des commentaires
      const commentPatterns = [
        /\/\*[\s\S]*?\*\//g,    // Commentaires multi-lignes
        /\/\/.*$/gm,            // Commentaires single-line
        /<!--[\s\S]*?-->/g      // Commentaires HTML
      ];
      
      let commentCount = 0;
      commentPatterns.forEach(pattern => {
        const matches = allCode.match(pattern) || [];
        commentCount += matches.length;
      });
      
      // Ratio commentaires/code
      const commentRatio = nonEmptyLines > 0 
        ? Math.round((commentCount / nonEmptyLines) * 100)
        : 0;

      // Index de maintenabilité (0-100)
      const maintainabilityIndex = Math.max(0, Math.min(100, 
        100 - complexityScore * 2 - duplicationPercentage - Math.max(0, 20 - commentRatio)
      ));

      // Code smells detection
      const codeSmells: string[] = [];
      if (functionCount > 20) codeSmells.push('Trop de fonctions');
      if (duplicationPercentage > 15) codeSmells.push('Code dupliqué élevé');
      if (commentRatio < 10) codeSmells.push('Manque de commentaires');
      if (complexityScore > 50) codeSmells.push('Complexité élevée');
      if (totalLines > 1000) codeSmells.push('Fichier trop volumineux');

      const newStats: CodeStats = {
        lines: totalLines,
        htmlLines,
        cssLines,
        jsLines,
        functions: functionCount,
        indentation: indentationType,
        duplication: duplicationPercentage,
        size: totalSize,
        complexity: complexityScore,
        comments: commentCount,
        commentRatio,
        maintainabilityIndex,
        codeSmells
      };

      setCodeStats(newStats);
      
      // Log dans la console de dev
      addMessage('info', 'CodeStats', `Analyse terminée: ${totalLines} lignes, ${functionCount} fonctions`);
      
      if (codeSmells.length > 0) {
        addMessage('warning', 'CodeStats', `${codeSmells.length} code smell(s) détecté(s)`);
      }
    };

    analyzeCode();
  }, [htmlCode, cssCode, jsCode, setCodeStats, addMessage]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getQualityColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-success';
    if (value >= thresholds.warning) return 'text-warning';
    return 'text-destructive';
  };

  const getQualityBadge = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'Excellent';
    if (value >= thresholds.warning) return 'Bon';
    return 'À améliorer';
  };

  const getTrendIcon = (value: number, threshold: number, inverted = false) => {
    const isGood = inverted ? value < threshold : value > threshold;
    if (isGood) return <TrendingUp className="w-3 h-3 text-success" />;
    if (value === threshold) return <Minus className="w-3 h-3 text-warning" />;
    return <TrendingDown className="w-3 h-3 text-destructive" />;
  };

  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      codeStats,
      analysis: {
        maintainabilityIndex: codeStats.maintainabilityIndex,
        codeSmells: codeStats.codeSmells,
        recommendations: [
          ...(codeStats.commentRatio < 20 ? ['Ajouter plus de commentaires'] : []),
          ...(codeStats.duplication > 10 ? ['Réduire la duplication de code'] : []),
          ...(codeStats.complexity > 30 ? ['Simplifier la logique complexe'] : []),
          ...(codeStats.functions > 15 ? ['Diviser en modules plus petits'] : [])
        ]
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addMessage('success', 'CodeStats', 'Rapport d\'analyse exporté');
  };

  const copyStats = () => {
    const statsText = `
Code Statistics:
- Total Lines: ${codeStats.lines}
- Functions: ${codeStats.functions}
- Size: ${formatBytes(codeStats.size)}
- Maintainability Index: ${codeStats.maintainabilityIndex}/100
- Code Smells: ${codeStats.codeSmells.length}
`;
    
    navigator.clipboard.writeText(statsText);
    addMessage('success', 'CodeStats', 'Statistiques copiées dans le presse-papiers');
  };

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold">Dashboard d'Analyse</h3>
            <Badge 
              variant={codeStats.maintainabilityIndex >= 70 ? "default" : "destructive"}
              className="neumorph-flat"
            >
              {codeStats.maintainabilityIndex}/100
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyStats}
              className="neumorph-button h-8 w-8 p-0"
              title="Copier les statistiques"
            >
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportReport}
              className="neumorph-button h-8 w-8 p-0"
              title="Exporter le rapport"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 max-h-96 overflow-auto custom-scrollbar">
        <div className="space-y-4">
          {/* Métriques générales */}
          <div className="neumorph-flat p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Métriques générales
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="neumorph-inset p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{codeStats.lines}</div>
                <div className="text-xs text-muted-foreground">Lignes totales</div>
              </div>
              
              <div className="neumorph-inset p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{formatBytes(codeStats.size)}</div>
                <div className="text-xs text-muted-foreground">Taille du code</div>
              </div>
              
              <div className="neumorph-inset p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{codeStats.functions}</div>
                <div className="text-xs text-muted-foreground">Fonctions JS</div>
              </div>
              
              <div className="neumorph-inset p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{codeStats.comments}</div>
                <div className="text-xs text-muted-foreground">Commentaires</div>
              </div>
            </div>
          </div>

          {/* Répartition par langage */}
          <div className="neumorph-flat p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Répartition par langage
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#e34c26] rounded-full"></div>
                    HTML
                  </span>
                  <span className="font-mono">{codeStats.htmlLines} lignes</span>
                </div>
                <Progress 
                  value={codeStats.lines > 0 ? (codeStats.htmlLines / codeStats.lines) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2965f1] rounded-full"></div>
                    CSS
                  </span>
                  <span className="font-mono">{codeStats.cssLines} lignes</span>
                </div>
                <Progress 
                  value={codeStats.lines > 0 ? (codeStats.cssLines / codeStats.lines) * 100 : 0} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#f0db4f] rounded-full"></div>
                    JavaScript
                  </span>
                  <span className="font-mono">{codeStats.jsLines} lignes</span>
                </div>
                <Progress 
                  value={codeStats.lines > 0 ? (codeStats.jsLines / codeStats.lines) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Qualité du code */}
          <div className="neumorph-flat p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Qualité du code
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Indentation</span>
                <span className="text-xs font-mono neumorph-inset px-2 py-1 rounded">
                  {codeStats.indentation}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Complexité</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(codeStats.complexity, 25, true)}
                  <span className={`text-xs font-mono ${getQualityColor(codeStats.complexity, { good: 10, warning: 25 })}`}>
                    {codeStats.complexity}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  Duplication
                </span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(codeStats.duplication, 10, true)}
                  <span className={`text-xs font-mono ${getQualityColor(100 - codeStats.duplication, { good: 90, warning: 80 })}`}>
                    {codeStats.duplication}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ratio commentaires</span>
                <div className="flex items-center gap-1">
                  {getTrendIcon(codeStats.commentRatio, 15)}
                  <span className={`text-xs font-mono ${getQualityColor(codeStats.commentRatio, { good: 20, warning: 10 })}`}>
                    {codeStats.commentRatio}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Index de maintenabilité */}
          <div className="neumorph-flat p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-3">Index de maintenabilité</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Maintenabilité globale</span>
                  <span className={getQualityColor(codeStats.maintainabilityIndex, { good: 70, warning: 40 })}>
                    {getQualityBadge(codeStats.maintainabilityIndex, { good: 70, warning: 40 })}
                  </span>
                </div>
                <Progress 
                  value={codeStats.maintainabilityIndex} 
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Code smells */}
          {codeStats.codeSmells && codeStats.codeSmells.length > 0 && (
            <div className="neumorph-flat p-4 rounded-xl">
              <h4 className="text-sm font-medium mb-3 text-warning">Code Smells Détectés</h4>
              
              <div className="space-y-2">
                {codeStats.codeSmells.map((smell, index) => (
                  <div key={index} className="neumorph-inset p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-warning" />
                      <span className="text-xs">{smell}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}