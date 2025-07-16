import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, ChevronLeft, File, Save, Code } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UltimateBeautifierSidebar } from './UltimateBeautifierSidebar';
import { EditorArea } from '../Editor/EditorArea';
import { PreviewArea } from '../Preview/PreviewArea';
import { WelcomeOverlay } from '../Welcome/WelcomeOverlay';
import { DragDropArea } from '../DragDrop/DragDropArea';

export function UltimateBeautifierLayout() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  // Apply theme to body
  useEffect(() => {
    document.body.className = currentTheme === 'default' ? '' : currentTheme;
  }, [currentTheme]);

  // Handle drag and drop globally
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      if (!e.relatedTarget) {
        setIsDragActive(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      setShowWelcome(false);
    };

    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div className={`app-grid ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Header */}
      <header className="bg-card border-b border-border flex items-center px-5 gap-5" style={{ gridArea: 'header' }}>
        <div className="flex items-center gap-3 text-primary font-bold text-xl">
          <Sparkles className="w-6 h-6" />
          <span>Ultimate Beautifier</span>
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <Select value={currentTheme} onValueChange={setCurrentTheme}>
            <SelectTrigger className="w-40 bg-card border-primary text-foreground">
              <SelectValue placeholder="Thème" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="solarized">Solarized</SelectItem>
              <SelectItem value="tokyo-night">Tokyo Night</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">Commander (Ctrl+K)</span>
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <UltimateBeautifierSidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onFileCountChange={setFileCount}
      />

      {/* Main Content */}
      <main className="overflow-hidden" style={{ gridArea: 'main' }}>
        <div className="grid grid-cols-2 grid-rows-[1fr_250px] gap-4 p-5 h-full">
          <EditorArea />
          <PreviewArea />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border flex items-center px-5 text-sm text-muted-foreground" style={{ gridArea: 'footer' }}>
        <div className="flex items-center gap-2 mr-5">
          <Code className="w-4 h-4" />
          <span id="languageStatus">JavaScript</span>
        </div>
        <div className="flex items-center gap-2 mr-5">
          <Save className="w-4 h-4" />
          <span>Sauvegarde automatique activée</span>
        </div>
        <div className="flex items-center gap-2">
          <File className="w-4 h-4" />
          <span>{fileCount} fichier{fileCount > 1 ? 's' : ''} ouvert{fileCount > 1 ? 's' : ''}</span>
        </div>
      </footer>

      {/* Welcome Overlay */}
      {showWelcome && (
        <WelcomeOverlay onClose={() => setShowWelcome(false)} />
      )}

      {/* Drag Drop Area */}
      <DragDropArea active={isDragActive} />
    </div>
  );
}