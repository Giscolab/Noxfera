import React, { useEffect, useState } from 'react';
import { Monitor, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UltimateBeautifierSidebar } from './UltimateBeautifierSidebar';
import { EditorArea } from '../Editor/EditorArea';
import { PreviewArea } from '../Preview/PreviewArea';
import { DevToolsManager } from '../DevTools/DevToolsManager';
import WelcomeOverlay from '../Welcome/WelcomeOverlay';
import DragDropArea from '../DragDrop/DragDropArea';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

export function UltimateBeautifierLayout(): JSX.Element {
  const {
    currentTheme,
    setCurrentTheme,
    sidebarOpen,
    setSidebarOpen,
    showWelcome,
    currentLanguage
  } = useEditorStore();

  const [advancedMode, setAdvancedMode] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const { files, importFiles } = useFileStore();

  useEffect(() => {
    document.documentElement.className = currentTheme || 'lovable-neumorph';
  }, [currentTheme]);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget) setIsDragActive(false);
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
  }, [importFiles]);

  const handleToggleCollapse = () => setSidebarOpen(!sidebarOpen);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      await importFiles(Array.from(selectedFiles));
    }
  };

  return (
    <div className={`app-grid ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Aller au contenu
      </a>

      {/* Header */}
      <header className="header">
        <div className="logo" aria-label="Logo noxfera">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 1024 1024">
  <path d="m356.8 418.1-.3 37.2-18.7 8.1-18.8 8.1v79.2l10.6 4.7c5.9 2.7 14.4 6.6 19 8.7l8.4 3.9v84h72v-41h-35v-74.6l-13.2-5.8c-7.3-3.3-18.2-8.1-24.3-10.8-6-2.8-12.5-5.6-14.4-6.5-1.9-.8-3-1.8-2.5-2.3.9-.9 47.9-21.7 52.6-23.3 1.6-.6 1.8-3.3 2-33.9l.3-33.3 17.3-.3 17.2-.2v-39h-72l-.2 37.1zM588 400.5V420h37v66.6l27.1 12.1c14.9 6.6 26.9 12.4 26.7 12.9-.1.5-12.3 6.2-27 12.8L625 536.3V572c0 19.7-.3 36.5-.6 37.4-.5 1.4-3.1 1.6-18.5 1.6H588v41h72.7l.7-5.3c.3-2.8.6-21.9.6-42.2v-37l11.3-5c6.1-2.7 14-6.2 17.4-7.7l6.1-2.8.7-6.3c.3-3.4.5-21.5.3-40.2l-.3-33.9-3.5-1.8c-1.9-1-9.6-4.5-17-7.9-7.4-3.4-13.8-6.5-14.2-6.8-.4-.4-.8-17.2-.8-37.4l-.1-36.7H588v19.5zm-119 72V487h80v-29h-80v14.5zm0 81V568h80v-29h-80v14.5z"/>
</svg>

        <span>noxfera</span>
          <div className="text-xs text-muted-foreground font-normal">
            by <span className="text-primary font-semibold">Giscolab</span>
          </div>
        </div>

        <div className="header-controls flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => document.getElementById('fileInput')?.click()}
            className="neumorph-button"
          >
            Importer un fichier
          </Button>
          <input
            id="fileInput"
            type="file"
            className="sr-only"
            onChange={handleFileInput}
            aria-hidden
            tabIndex={-1}
          />

          <Select value={currentTheme || 'lovable-neumorph'} onValueChange={setCurrentTheme}>
            <SelectTrigger className="theme-selector w-40 neumorph-button" aria-label="Changer de thème">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="frankenstein">Frankenstein</SelectItem>
              <SelectItem value="mummy">Mummy</SelectItem>
              <SelectItem value="werewolf">Werewolf</SelectItem>
              <SelectItem value="phantom">Phantom</SelectItem>
              <SelectItem value="dorian">Dorian</SelectItem>
              <SelectItem value="witch">Witch</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="command-palette neumorph-button">
            <Monitor className="w-4 h-4 mr-2" />
            Command (Ctrl+K)
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <UltimateBeautifierSidebar
        collapsed={!sidebarOpen}
        onToggleCollapse={handleToggleCollapse}
        advancedMode={advancedMode}
        onAdvancedModeChange={setAdvancedMode}
      />

      {/* Main */}
      <main id="main-content" className="main-content" aria-label="Zone principale">
        {advancedMode ? (
          <div className="col-span-2 h-full">
            <DevToolsManager isAdvancedMode />
          </div>
        ) : (
          <>
            <EditorArea />
            <PreviewArea />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="status-item">
          <i className="fas fa-code"></i>
          <span>{currentLanguage}</span>
        </div>
        <div className="status-item">
          <i className="fas fa-save"></i>
          <span>Auto-save enabled</span>
        </div>
        <div className="status-item" role="status" aria-live="polite">
          <i className="fas fa-file"></i>
          <span>
            {files.length} file{files.length !== 1 ? 's' : ''} open
          </span>
        </div>
      </footer>

      {/* Overlays */}
      {showWelcome && <WelcomeOverlay />}
      <DragDropArea active={isDragActive} />
    </div>
  );
}