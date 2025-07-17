import React, { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';
import useFileStore from '@/stores/useFileStore';
import useEditorStore from '@/stores/useEditorStore';

const DragDropArea = ({ active }) => {

  if (!active) return null;

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