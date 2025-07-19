import React, { useEffect } from 'react';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';
import Header from './Header';
import Sidebar from './Sidebar';
import EditorPane from '../Editor/EditorPane';
import PreviewPane from '../Preview/PreviewPane';
import WelcomeOverlay from '../Welcome/WelcomeOverlay';
import DragDropArea from '../DragDrop/DragDropArea';

interface StatusItemProps {
  icon: string;
  text: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, text }) => (
  <div className="flex items-center gap-2">
    <span>{icon}</span>
    <span>{text}</span>
  </div>
);

const MainLayout: React.FC = () => {
  const { currentTheme, sidebarOpen, showWelcome } = useEditorStore();
  const { loadProject, autoSave, saveProject } = useFileStore();

  useEffect(() => {
    loadProject();

    if (autoSave) {
      const interval = setInterval(() => {
        saveProject();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [loadProject, autoSave, saveProject]);

  useEffect(() => {
    document.documentElement.className = currentTheme;
  }, [currentTheme]);

  return (
    <div className={`min-h-screen bg-background text-foreground ${currentTheme}`}>
      <div className="grid grid-cols-1 grid-rows-[60px_1fr_40px] h-screen overflow-hidden
                      lg:grid-cols-[280px_1fr] lg:grid-rows-[60px_1fr_40px]
                      lg:grid-areas-[header_header][sidebar_main][footer_footer]">

        <Header />
        <Sidebar />

        <main className="flex flex-col overflow-hidden lg:col-start-2">
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
            <EditorPane type="original" />
            <EditorPane type="formatted" />
          </div>
          <div className="h-60 border-t border-border">
            <PreviewPane />
          </div>
        </main>

        <footer className="col-span-full bg-surface border-t border-border px-6 py-2 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <StatusItem icon="💻" text="noxfera" />
            <StatusItem icon="🎯" text="Ready" />
          </div>
          <div className="flex items-center gap-4">
            <StatusItem icon="💾" text="Auto-save ON" />
            <StatusItem icon="⚡" text="Online" />
          </div>
        </footer>
      </div>

      {showWelcome && <WelcomeOverlay />}
      <DragDropArea active={false} />
    </div>
  );
};

export default MainLayout;
