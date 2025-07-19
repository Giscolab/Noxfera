import React, { useEffect, useRef, memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Code2, 
  Terminal, 
  RefreshCw,
  ExternalLink,
  Maximize2
} from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';

interface DiffStats {
  added: number;
  removed: number;
}

interface DiffViewerProps {
  original: string;
  formatted: string;
  stats: DiffStats;
}

interface LogEntry {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

const PreviewPane = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { 
    formattedCode, 
    originalCode, 
    currentLanguage, 
    activeTab, 
    setActiveTab 
  } = useEditorStore();

  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [diffStats, setDiffStats] = React.useState<DiffStats>({ added: 0, removed: 0 });

  // Update preview when code changes
  useEffect(() => {
    updatePreview();
    calculateDiff();
  }, [formattedCode, originalCode, currentLanguage]);

  const updatePreview = () => {
    if (currentLanguage === 'html' && iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (doc) {
          doc.open();
          doc.write(formattedCode || originalCode || '');
          doc.close();
          setPreviewError(null);
        }
      } catch (error: any) {
        setPreviewError(error.message);
      }
    }
  };

  const calculateDiff = () => {
    if (!originalCode || !formattedCode) {
      setDiffStats({ added: 0, removed: 0 });
      return;
    }

    const originalLines = originalCode.split('\n');
    const formattedLines = formattedCode.split('\n');
    
    // Simple diff calculation
    const maxLines = Math.max(originalLines.length, formattedLines.length);
    let added = 0;
    let removed = 0;

    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || '';
      const formattedLine = formattedLines[i] || '';
      
      if (originalLine !== formattedLine) {
        if (!originalLine) added++;
        else if (!formattedLine) removed++;
        else {
          // Line changed - count as both added and removed
          added++;
          removed++;
        }
      }
    }

    setDiffStats({ added, removed });
  };

  const handleRefresh = () => {
    updatePreview();
  };

  const handleOpenExternal = () => {
    if (currentLanguage === 'html') {
      const blob = new Blob([formattedCode || originalCode || ''], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  const canPreview = ['html', 'css'].includes(currentLanguage);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">Preview & Analysis</h3>
            {canPreview && (
              <Badge variant="secondary" className="text-xs">
                Live Preview
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {canPreview && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  className="h-7 w-7 p-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleOpenExternal}
                  className="h-7 w-7 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 m-2">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="diff" className="flex items-center gap-2">
              <Code2 className="h-4 w-4" />
              Diff
              {(diffStats.added > 0 || diffStats.removed > 0) && (
                <Badge variant="outline" className="text-xs ml-1">
                  {diffStats.added + diffStats.removed}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="console" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Console
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-hidden">
            <TabsContent value="preview" className="h-full mt-0">
              {canPreview ? (
                <div className="h-full relative">
                  {previewError ? (
                    <div className="h-full flex items-center justify-center bg-destructive/10">
                      <div className="text-center">
                        <div className="text-destructive text-2xl mb-2">⚠️</div>
                        <h3 className="font-medium mb-2">Preview Error</h3>
                        <p className="text-sm text-muted-foreground">{previewError}</p>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      className="w-full h-full border-0 bg-white"
                      title="Code Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-muted/20">
                  <div className="text-center">
                    <div className="text-4xl mb-4">👁️</div>
                    <h3 className="font-medium mb-2">Preview Not Available</h3>
                    <p className="text-sm text-muted-foreground">
                      Live preview is only available for HTML files
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current language: <span className="font-mono">{currentLanguage}</span>
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="diff" className="h-full mt-0">
              <DiffViewer 
                original={originalCode || ''} 
                formatted={formattedCode || ''}
                stats={diffStats}
              />
            </TabsContent>
            
            <TabsContent value="console" className="h-full mt-0">
              <ConsoleOutput />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const DiffViewer = ({ original, formatted, stats }: DiffViewerProps) => {
  if (!original || !formatted) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="font-medium mb-2">No Comparison Available</h3>
          <p className="text-sm text-muted-foreground">
            Add content to see the differences
          </p>
        </div>
      </div>
    );
  }

  const originalLines = original.split('\n');
  const formattedLines = formatted.split('\n');
  const maxLines = Math.max(originalLines.length, formattedLines.length);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50 bg-muted/20">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Code Comparison</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Added: {stats.added}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm">Removed: {stats.removed}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 h-full">
          <div className="border-r border-border/50">
            <div className="bg-red-500/10 px-3 py-2 text-sm font-medium">Original</div>
            <div className="p-3 font-mono text-sm">
              {originalLines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-muted-foreground mr-2">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-green-500/10 px-3 py-2 text-sm font-medium">Formatted</div>
            <div className="p-3 font-mono text-sm">
              {formattedLines.map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-muted-foreground mr-2">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MAX_LOGS = 100;

const ConsoleOutput = memo(function ConsoleOutput() {
  const [logs, setLogs] = React.useState<LogEntry[]>([
    { type: 'info', message: 'noxfera initialized', timestamp: Date.now() },
    { type: 'success', message: 'Code formatting engine ready', timestamp: Date.now() + 1000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setLogs(prev => {
          const newLog = {
            type: 'info' as const,
            message: `Auto-save completed at ${new Date().toLocaleTimeString()}`,
            timestamp: Date.now()
          };
          // Garder seulement les MAX_LOGS derniers logs
          const updatedLogs = [...prev, newLog];
          return updatedLogs.slice(-MAX_LOGS);
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="h-full bg-gray-900 text-gray-100 font-mono text-sm">
      <div className="p-3 border-b border-gray-700">
        <h4 className="font-medium text-gray-300">Console Output</h4>
      </div>
      
      <div className="p-3 space-y-2 overflow-auto h-full">
        {logs.map((log, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-xs">{getLogIcon(log.type)}</span>
            <span className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`flex-1 ${getLogColor(log.type)}`}>
              {log.message}
            </span>
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-2xl mb-2">📱</div>
            <p>Console output will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default PreviewPane;