import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Download, Share2, RotateCcw, Undo2, Redo2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useEditorStore from '@/stores/useEditorStore';

export function CodeActions() {
  const { toast } = useToast();
  const { formattedCode, originalCode, currentLanguage, isFormatted } = useEditorStore();

  const handleCopy = async () => {
    const codeToCopy = isFormatted ? formattedCode : originalCode;
    try {
      await navigator.clipboard.writeText(codeToCopy);
      toast({
        title: "Code copié !",
        description: "Le code a été copié dans le presse-papiers",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDownload = () => {
    const codeToDownload = isFormatted ? formattedCode : originalCode;
    const extensions = {
      javascript: 'js',
      typescript: 'ts', 
      html: 'html',
      css: 'css',
      json: 'json',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      yaml: 'yml',
      markdown: 'md',
      sql: 'sql'
    };

    const extension = extensions[currentLanguage as keyof typeof extensions] || 'txt';
    const filename = `code_${Date.now()}.${extension}`;

    const blob = new Blob([codeToDownload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Fichier téléchargé !",
      description: `Le code a été sauvegardé dans ${filename}`,
      duration: 3000,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Code partagé via Noxfera',
          text: isFormatted ? formattedCode : originalCode,
        });
      } catch (error) {
        handleCopy(); // Fallback vers copie
      }
    } else {
      handleCopy(); // Fallback vers copie
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="neumorph-button h-8 px-3 text-xs"
        title="Copier le code"
      >
        <Copy className="w-3 h-3 mr-1" />
        Copier
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="neumorph-button h-8 px-3 text-xs"
        title="Télécharger le fichier"
      >
        <Download className="w-3 h-3 mr-1" />
        Export
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="neumorph-button h-8 px-3 text-xs"
        title="Partager le code"
      >
        <Share2 className="w-3 h-3 mr-1" />
        Partager
      </Button>
    </div>
  );
}