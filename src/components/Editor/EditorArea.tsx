import React, { useEffect } from 'react';
import { Copy, Download, FileCode, Languages, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MonacoEditor } from './MonacoEditor';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

export function EditorArea() {
  const { 
    originalCode, 
    formattedCode, 
    currentLanguage, 
    setOriginalCode, 
    formatCode,
    detectLanguage 
  } = useEditorStore();
  
  const { 
    files, 
    activeFileId, 
    setActiveFile, 
    removeFile, 
    getActiveFile 
  } = useFileStore();
  
  const activeFile = getActiveFile();

  useEffect(() => {
    if (activeFile) {
      setOriginalCode(activeFile.content);
    }
  }, [activeFile, setOriginalCode]);


  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* File Tabs */}
      <div className="col-span-2 flex items-center gap-2 bg-card rounded-t-xl border-b border-border px-4 py-3 min-h-[48px] overflow-x-auto custom-scrollbar neumorph-panel">
        {files.map((file) => (
          <Button
            key={file.id}
            variant={file.id === activeFileId ? "default" : "ghost"}
            size="sm"
            className={`flex items-center gap-2 rounded-xl h-9 px-3 transition-all duration-200 ${
              file.id === activeFileId ? 'neumorph-inset text-primary-foreground' : 'neumorph-button'
            }`}
            onClick={() => setActiveFile(file.id)}
          >
            <FileCode className="w-3 h-3" />
            <span className="text-xs font-medium">{file.name}</span>
            {file.id === activeFileId && (
              <span
                className="ml-1 text-destructive hover:text-destructive/80 cursor-pointer text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
              >
                ×
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Original Editor */}
      <Card className="rounded-tl-none neumorph-panel">
        <CardHeader className="p-4 bg-muted/30 flex flex-row items-center justify-between rounded-t-xl">
          <h3 className="text-sm font-semibold text-foreground">Code original</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => detectLanguage(originalCode)}
              title="Détecter le langage"
              className="neumorph-button h-8 w-8 p-0"
            >
              <Languages className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={formatCode}
              title="Formater le code"
              className="neumorph-button h-8 w-8 p-0"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(originalCode)}
              title="Copier"
              className="neumorph-button h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] relative neumorph-inset rounded-b-xl">
            <MonacoEditor
              value={originalCode}
              onChange={setOriginalCode}
              language={currentLanguage}
              theme="vs-light"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formatted Editor */}
      <Card className="rounded-tr-none neumorph-panel">
        <CardHeader className="p-4 bg-muted/30 flex flex-row items-center justify-between rounded-t-xl">
          <h3 className="text-sm font-semibold text-foreground">Code formaté</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(formattedCode)}
              title="Copier"
              className="neumorph-button h-8 w-8 p-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDownload(formattedCode, `formatted_${activeFile?.name || 'code'}`)}
              title="Télécharger"
              className="neumorph-button h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] relative neumorph-inset rounded-b-xl">
            <MonacoEditor
              value={formattedCode}
              language={currentLanguage}
              theme="vs-light"
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}


