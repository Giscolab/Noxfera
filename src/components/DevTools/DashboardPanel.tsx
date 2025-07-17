import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, FileText, Code2, Layers, Repeat, Clock } from 'lucide-react';
import useDevToolsStore from '@/stores/useDevToolsStore';

export function DashboardPanel() {
  const { 
    htmlCode, 
    cssCode, 
    jsCode, 
    codeStats, 
    setCodeStats 
  } = useDevToolsStore();

  useEffect(() => {
    const analyzeCode = () => {
      const allCode = `${htmlCode}\n${cssCode}\n${jsCode}`;
      
      // Comptage des lignes
      const totalLines = allCode.split('\n').length;
      const htmlLines = htmlCode.split('\n').length;
      const cssLines = cssCode.split('\n').length;
      const jsLines = jsCode.split('\n').length;
      
      // Détection de l'indentation
      const indentationMatch = allCode.match(/^(\s+)/m);
      const indentationType = indentationMatch 
        ? (indentationMatch[1].includes('\t') ? 'tabs' : 'spaces')
        : 'spaces';
      
      // Comptage des fonctions JavaScript
      const functionMatches = jsCode.match(/function\s+\w+|=>\s*{|function\s*\(/g) || [];
      const functionCount = functionMatches.length;
      
      // Estimation de duplication (lignes identiques)
      const lines = allCode.split('\n').filter(line => line.trim().length > 0);
      const uniqueLines = new Set(lines);
      const duplicationPercentage = lines.length > 0 
        ? Math.round(((lines.length - uniqueLines.size) / lines.length) * 100)
        : 0;
      
      // Taille en bytes
      const totalSize = new Blob([allCode]).size;
      
      // Complexité estimée (basée sur les structures de contrôle)
      const complexityPatterns = /if|else|for|while|switch|catch|function|\?|&&|\|\|/g;
      const complexityMatches = allCode.match(complexityPatterns) || [];
      const estimatedComplexity = complexityMatches.length;
      
      // Comptage des commentaires
      const commentMatches = allCode.match(/\/\*[\s\S]*?\*\/|\/\/.*$/gm) || [];
      const commentCount = commentMatches.length;
      
      // Ratio commentaires/code
      const commentRatio = totalLines > 0 
        ? Math.round((commentCount / totalLines) * 100)
        : 0;

      setCodeStats({
        lines: totalLines,
        htmlLines,
        cssLines,
        jsLines,
        functions: functionCount,
        indentation: indentationType,
        duplication: duplicationPercentage,
        size: totalSize,
        complexity: estimatedComplexity,
        comments: commentCount,
        commentRatio
      });
    };

    analyzeCode();
  }, [htmlCode, cssCode, jsCode, setCodeStats]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity <= 10) return 'text-success';
    if (complexity <= 25) return 'text-warning';
    return 'text-destructive';
  };

  const getDuplicationColor = (duplication: number) => {
    if (duplication <= 5) return 'text-success';
    if (duplication <= 15) return 'text-warning';
    return 'text-destructive';
  };

  const getCommentRatioColor = (ratio: number) => {
    if (ratio >= 20) return 'text-success';
    if (ratio >= 10) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="neumorph-floating">
      <CardHeader className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-sm font-semibold">Dashboard d'Analyse</h3>
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
                <span className="text-xs text-muted-foreground">Complexité estimée</span>
                <span className={`text-xs font-mono ${getComplexityColor(codeStats.complexity)}`}>
                  {codeStats.complexity}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Repeat className="w-3 h-3" />
                  Duplication
                </span>
                <span className={`text-xs font-mono ${getDuplicationColor(codeStats.duplication)}`}>
                  {codeStats.duplication}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Ratio commentaires</span>
                <span className={`text-xs font-mono ${getCommentRatioColor(codeStats.commentRatio)}`}>
                  {codeStats.commentRatio}%
                </span>
              </div>
            </div>
          </div>

          {/* Indicateurs visuels */}
          <div className="neumorph-flat p-4 rounded-xl">
            <h4 className="text-sm font-medium mb-3">Indicateurs de qualité</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Lisibilité</span>
                  <span className={getCommentRatioColor(codeStats.commentRatio)}>
                    {codeStats.commentRatio >= 20 ? 'Excellente' : 
                     codeStats.commentRatio >= 10 ? 'Bonne' : 'Améliorable'}
                  </span>
                </div>
                <Progress 
                  value={Math.min(codeStats.commentRatio * 5, 100)} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Maintenabilité</span>
                  <span className={getDuplicationColor(codeStats.duplication)}>
                    {codeStats.duplication <= 5 ? 'Excellente' : 
                     codeStats.duplication <= 15 ? 'Bonne' : 'Améliorable'}
                  </span>
                </div>
                <Progress 
                  value={Math.max(100 - (codeStats.duplication * 5), 0)} 
                  className="h-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Simplicité</span>
                  <span className={getComplexityColor(codeStats.complexity)}>
                    {codeStats.complexity <= 10 ? 'Excellente' : 
                     codeStats.complexity <= 25 ? 'Bonne' : 'Améliorable'}
                  </span>
                </div>
                <Progress 
                  value={Math.max(100 - (codeStats.complexity * 3), 0)} 
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}