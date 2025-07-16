import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import useFileStore from '@/stores/useFileStore';
import useEditorStore from '@/stores/useEditorStore';

const DragDropArea = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { importFiles } = useFileStore();
  const { setShowWelcome } = useEditorStore();

  useEffect(() => {
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      if (!e.relatedTarget) {
        setIsDragging(false);
      }
    };

    const handleDrop = async (e) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await importFiles(files);
        setShowWelcome(false);
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
  }, [importFiles, setShowWelcome]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="bg-surface border-2 border-dashed border-primary rounded-lg p-12 text-center max-w-md mx-4">
        <Upload className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-semibold mb-2">Drop Your Files</h3>
        <p className="text-muted-foreground">
          Release to import and start formatting your code
        </p>
        <div className="mt-4 text-sm text-muted-foreground">
          <FileText className="w-4 h-4 inline mr-1" />
          Supports: HTML, CSS, JS, JSON, YAML, MD, and more
        </div>
      </div>
    </div>
  );
};

export default DragDropArea;