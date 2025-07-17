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
      <div className="col-span-2 flex items-center gap-1 bg-card rounded-t-lg border-b border-border px-3 py-2 min-h-[40px] overflow-x-auto custom-scrollbar">
        {files.map((file) => (
          <Button
            key={file.id}
            variant={file.id === activeFileId ? "default" : "ghost"}
            size="sm"
            className={`flex items-center gap-2 rounded-t-lg rounded-b-none h-8 ${
              file.id === activeFileId ? 'bg-background border-b-2 border-primary' : ''
            }`}
            onClick={() => setActiveFile(file.id)}
          >
            <FileCode className="w-3 h-3" />
            <span className="text-xs">{file.name}</span>
            {file.id === activeFileId && (
              <span
                className="ml-1 text-destructive hover:text-destructive/80 cursor-pointer"
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
      <Card className="rounded-tl-none">
        <CardHeader className="p-3 bg-muted/50 flex flex-row items-center justify-between">
          <h3 className="text-sm font-medium">Code original</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => detectLanguage(originalCode)}
              title="Détecter le langage"
            >
              <Languages className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={formatCode}
              title="Formater le code"
            >
              <Play className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(originalCode)}
              title="Copier"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] relative">
            <MonacoEditor
              value={originalCode}
              onChange={setOriginalCode}
              language={currentLanguage}
              theme="vs-dark"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formatted Editor */}
      <Card className="rounded-tr-none">
        <CardHeader className="p-3 bg-muted/50 flex flex-row items-center justify-between">
          <h3 className="text-sm font-medium">Code formaté</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleCopy(formattedCode)}
              title="Copier"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleDownload(formattedCode, `formatted_${activeFile?.name || 'code'}`)}
              title="Télécharger"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] relative">
            <MonacoEditor
              value={formattedCode}
              language={currentLanguage}
              theme="vs-dark"
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}


