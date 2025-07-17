import React, { useState } from 'react';
import { Copy, Download, FileCode, Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonacoEditor } from './MonacoEditor';

export function EditorArea() {
  const [originalCode, setOriginalCode] = useState(`// Collez votre code ici ou glissez-déposez un fichier
function helloWorld() {
  console.log("Hello, world!");
}`);
  
  const [formattedCode, setFormattedCode] = useState('');
  const [activeFile, setActiveFile] = useState('script.js');
  const [language, setLanguage] = useState('javascript');

  const [openFiles, setOpenFiles] = useState([
  { name: 'script.js', active: true },
  { name: 'styles.css', active: false },
  { name: 'index.html', active: false },
]);


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
        {openFiles.map((file, index) => (
          <Button
  key={index}
  variant={file.active ? "default" : "ghost"}
  size="sm"
  className={`flex items-center gap-2 rounded-t-lg rounded-b-none h-8 ${
    file.active ? 'bg-background border-b-2 border-primary' : ''
  }`}
  onClick={() => setActiveFile(file.name)}
>
  <FileCode className="w-3 h-3" />
  <span className="text-xs">{file.name}</span>
  {file.active && (
    <span
      className="ml-1 text-destructive hover:text-destructive/80 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation(); // évite le déclenchement du `onClick` parent
		setOpenFiles(prev => prev.filter(f => f.name !== file.name));
        console.log("Fermeture onglet pas encore implémentée");
        // ici tu pourras ajouter la logique pour fermer l'onglet
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
            <Button variant="ghost" size="sm" title="Détecter le langage">
              <Languages className="w-4 h-4" />
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
              language={language}
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
              onClick={() => handleDownload(formattedCode, `formatted_${activeFile}`)}
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
              onChange={setFormattedCode}
              language={language}
              theme="vs-dark"
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}


