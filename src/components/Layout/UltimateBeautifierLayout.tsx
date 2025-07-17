import React, { useEffect, useState } from 'react';
import { Monitor, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UltimateBeautifierSidebar } from './UltimateBeautifierSidebar';
import { EditorArea } from '../Editor/EditorArea';
import { PreviewArea } from '../Preview/PreviewArea';
// @ts-ignore
import WelcomeOverlay from '../Welcome/WelcomeOverlay';
// @ts-ignore
import DragDropArea from '../DragDrop/DragDropArea';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

export function UltimateBeautifierLayout() {
  const { 
    currentTheme, 
    setCurrentTheme, 
    sidebarOpen, 
    setSidebarOpen, 
    showWelcome, 
    setShowWelcome,
    currentLanguage 
  } = useEditorStore();
  
  const { 
    files, 
    importFiles, 
    getAllFiles 
  } = useFileStore();
  
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget) {
        setIsDragActive(false);
      }
    };

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
      
      const droppedFiles = e.dataTransfer?.files;
      if (droppedFiles && droppedFiles.length > 0) {
        await importFiles(Array.from(droppedFiles));
      }
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

  const handleToggleCollapse = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      await importFiles(Array.from(selectedFiles));
    }
  };

  return (
    <div className={`app-grid ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
    {/* Lien pour accéder directement au contenu principal (accessibilité) */}
    <a href="#main-content" className="sr-only focus:not-sr-only">
      Aller au contenu
    </a>

    {/* Header */}
    <header className="header">
      <div className="logo" aria-label="Logo Ultimate Beautifier">
        <i className="fas fa-magic"></i>
        <span>Ultimate Beautifier</span>
      </div>
      <div className="header-controls">
        <Button 
          variant="secondary" 
          onClick={() => document.getElementById('fileInput')?.click()}
          aria-label="Importer un fichier"
        >
          Importer un fichier
        </Button>
        <input
  id="fileInput"
  type="file"
  className="sr-only"
  aria-hidden="true"
  tabIndex={-1}
  onChange={handleFileInput}
/>


        <Select value={currentTheme} onValueChange={setCurrentTheme}>
          <SelectTrigger
            className="theme-selector"
            aria-label="Changer de thème"
            aria-haspopup="listbox"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="dracula">Dracula</SelectItem>
            <SelectItem value="solarized">Solarized</SelectItem>
            <SelectItem value="tokyo-night">Tokyo Night</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="command-palette"
          aria-label="Ouvrir la palette de commandes"
        >
          <Monitor className="w-4 h-4 mr-2" />
          Command (Ctrl+K)
        </Button>
      </div>
    </header>

    {/* Sidebar */}
    <UltimateBeautifierSidebar 
      collapsed={!sidebarOpen}
      onToggleCollapse={handleToggleCollapse}
    />

    {/* Main Content */}
    <main id="main-content" className="main-content" aria-label="Zone principale">
      <EditorArea />
      <PreviewArea />
    </main>

    {/* Footer */}
    <footer className="footer">
      <div className="status-item">
        <i className="fas fa-code"></i>
        <span id="languageStatus">{currentLanguage}</span>
      </div>
      <div className="status-item">
        <i className="fas fa-save"></i>
        <span>Auto-save enabled</span>
      </div>
      <div className="status-item" role="status" aria-live="polite">
        <i className="fas fa-file"></i>
        <span>{files.length} file{files.length !== 1 ? 's' : ''} open</span>
      </div>
    </footer>

    {/* Overlays */}
    {showWelcome && <WelcomeOverlay />}
    <DragDropArea active={isDragActive} />
  </div>
);
}