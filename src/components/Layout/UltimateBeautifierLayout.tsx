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

export function UltimateBeautifierLayout() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  useEffect(() => {
    document.body.className = currentTheme;
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

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragActive(false);
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
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleFileCountChange = (count: number) => {
    setFileCount(count);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <i className="fas fa-magic"></i>
          <span>Ultimate Beautifier</span>
        </div>
        <div className="header-controls">
          <Select value={currentTheme} onValueChange={setCurrentTheme}>
            <SelectTrigger className="theme-selector">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="dracula">Dracula</SelectItem>
              <SelectItem value="solarized">Solarized</SelectItem>
              <SelectItem value="tokyo-night">Tokyo Night</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="command-palette">
            <Monitor className="w-4 h-4 mr-2" />
            Command (Ctrl+K)
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <UltimateBeautifierSidebar 
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        onFileCountChange={handleFileCountChange}
      />

      {/* Main Content */}
      <main className="main-content">
        <EditorArea />
        <PreviewArea />
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="status-item">
          <i className="fas fa-code"></i>
          <span id="languageStatus">JavaScript</span>
        </div>
        <div className="status-item">
          <i className="fas fa-save"></i>
          <span>Auto-save enabled</span>
        </div>
        <div className="status-item">
          <i className="fas fa-file"></i>
          <span>{fileCount} file{fileCount !== 1 ? 's' : ''} open</span>
        </div>
      </footer>

      {/* Overlays */}
      {showWelcome && <WelcomeOverlay />}
      <DragDropArea active={isDragActive} />
    </div>
  );
}