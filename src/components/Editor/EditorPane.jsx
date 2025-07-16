import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Download, 
  Maximize2, 
  Minimize2,
  Eye,
  EyeOff,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

// Monaco Editor will be loaded dynamically
let monaco = null;

const EditorPane = ({ type }) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [isMaximized, setIsMaximized] = React.useState(false);
  const [isMinimized, setIsMinimized] = React.useState(false);
  
  const { 
    originalCode, 
    formattedCode, 
    currentLanguage, 
    setOriginalCode,
    currentTheme 
  } = useEditorStore();
  
  const { updateFile, getActiveFile } = useFileStore();
  const { toast } = useToast();

  const isOriginal = type === 'original';
  const code = isOriginal ? originalCode : formattedCode;
  const title = isOriginal ? 'Original Code' : 'Formatted Code';

  // Initialize Monaco Editor
  useEffect(() => {
    const initMonaco = async () => {
      if (!monaco) {
        // Load Monaco Editor
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
        document.head.appendChild(script);
        
        script.onload = () => {
          window.require.config({ 
            paths: { 
              'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' 
            } 
          });
          
          window.require(['vs/editor/editor.main'], () => {
            monaco = window.monaco;
            createEditor();
          });
        };
      } else {
        createEditor();
      }
    };

    const createEditor = () => {
      if (containerRef.current && monaco) {
        // Dispose existing editor
        if (editorRef.current) {
          editorRef.current.dispose();
        }

        // Create new editor
        editorRef.current = monaco.editor.create(containerRef.current, {
          value: code,
          language: currentLanguage,
          theme: getMonacoTheme(currentTheme),
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: true, side: 'right' },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          lineHeight: 1.6,
          fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", "Source Code Pro", monospace',
          fontLigatures: true,
          readOnly: !isOriginal,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'all',
          selectOnLineNumbers: true,
          roundedSelection: false,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        });

        // Add event listeners for original editor
        if (isOriginal) {
          editorRef.current.onDidChangeModelContent(() => {
            const newCode = editorRef.current.getValue();
            setOriginalCode(newCode);
            
            // Update active file
            const activeFile = getActiveFile();
            if (activeFile) {
              updateFile(activeFile.id, { content: newCode });
            }
          });
        }
      }
    };

    initMonaco();

    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Update editor content when props change
  useEffect(() => {
    if (editorRef.current && code !== editorRef.current.getValue()) {
      editorRef.current.setValue(code);
    }
  }, [code]);

  // Update language
  useEffect(() => {
    if (editorRef.current && monaco) {
      monaco.editor.setModelLanguage(editorRef.current.getModel(), currentLanguage);
    }
  }, [currentLanguage]);

  // Update theme
  useEffect(() => {
    if (monaco) {
      monaco.editor.setTheme(getMonacoTheme(currentTheme));
    }
  }, [currentTheme]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
    });
  };

  const handleDownload = () => {
    const activeFile = getActiveFile();
    const filename = activeFile ? activeFile.name : `${type}-code.txt`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `File saved as ${filename}`,
    });
  };

  const handleReset = () => {
    if (isOriginal) {
      setOriginalCode('');
    }
  };

  const getMonacoTheme = (theme) => {
    const themeMap = {
      'default': 'vs-dark',
      'dark': 'vs-dark',
      'light': 'vs',
      'dracula': 'vs-dark',
      'tokyo-night': 'vs-dark',
      'solarized': 'vs-dark',
    };
    return themeMap[theme] || 'vs-dark';
  };

  if (isMinimized) {
    return (
      <Card className="border border-border">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">{title}</h3>
              <Badge variant="outline" className="text-xs">
                Minimized
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(false)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={`border border-border flex flex-col ${isMaximized ? 'fixed inset-4 z-50' : 'h-full'}`}>
      <CardHeader className="pb-2 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium">{title}</h3>
            <Badge variant="secondary" className="text-xs capitalize">
              {currentLanguage}
            </Badge>
            {!isOriginal && (
              <Badge variant="outline" className="text-xs">
                Read-only
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            {isOriginal && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                title="Clear editor"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              title="Minimize"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              title={isMaximized ? "Restore" : "Maximize"}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 relative">
        <div 
          ref={containerRef} 
          className="w-full h-full"
          style={{ minHeight: '300px' }}
        />
        
        {/* Loading state */}
        {!editorRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading editor...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EditorPane;