import React from 'react';
import { CloudUpload } from 'lucide-react';

interface DragDropAreaProps {
  active: boolean;
}

export function DragDropArea({ active }: DragDropAreaProps) {
  if (!active) return null;

  return (
    <div className="drag-area active animate-fade-in">
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <CloudUpload className="w-16 h-16 text-primary mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-primary mb-2">
            Déposez vos fichiers ici
          </h3>
          <p className="text-muted-foreground text-lg">
            Glissez-déposez des fichiers HTML, CSS, JS, JSON, etc.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DragDropArea;
