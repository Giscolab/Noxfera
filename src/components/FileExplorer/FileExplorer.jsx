import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  FileCode, 
  File, 
  X, 
  Circle 
} from 'lucide-react';
import useFileStore from '@/stores/useFileStore';
import useEditorStore from '@/stores/useEditorStore';

const FileExplorer = () => {
  const { 
    files, 
    activeFileId, 
    setActiveFile, 
    removeFile,
    getActiveFile 
  } = useFileStore();
  
  const { setOriginalCode, setCurrentLanguage } = useEditorStore();

  const handleFileSelect = (file) => {
    setActiveFile(file.id);
    setOriginalCode(file.content);
    setCurrentLanguage(file.language);
  };

  const handleFileRemove = (e, fileId) => {
    e.stopPropagation();
    removeFile(fileId);
  };

  const getFileIcon = (language) => {
    const iconMap = {
      html: FileCode,
      css: FileCode,
      javascript: FileCode,
      typescript: FileCode,
      json: FileCode,
      yaml: FileCode,
      markdown: FileText,
      xml: FileCode,
      python: FileCode,
      vue: FileCode,
      sql: FileCode,
      shell: FileCode,
    };
    
    return iconMap[language] || File;
  };

  const getLanguageColor = (language) => {
    const colors = {
      html: 'text-orange-500',
      css: 'text-blue-500',
      javascript: 'text-yellow-500',
      typescript: 'text-blue-600',
      json: 'text-green-500',
      yaml: 'text-purple-500',
      markdown: 'text-gray-500',
      xml: 'text-red-500',
      python: 'text-green-600',
      vue: 'text-emerald-500',
      sql: 'text-cyan-500',
      shell: 'text-gray-600',
    };
    
    return colors[language] || 'text-muted-foreground';
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No files open</p>
        <p className="text-xs">Create a new file or import existing ones</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {files.map((file) => {
        const Icon = getFileIcon(file.language);
        const isActive = file.id === activeFileId;
        
        return (
          <div
            key={file.id}
            className={`
              group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer
              transition-all duration-200 hover:bg-accent/50
              ${isActive ? 'bg-accent text-accent-foreground shadow-sm' : 'hover:bg-accent/30'}
            `}
            onClick={() => handleFileSelect(file)}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Icon className={`h-4 w-4 flex-shrink-0 ${getLanguageColor(file.language)}`} />
              
              <span className="text-sm font-medium truncate">
                {file.name}
              </span>
              
              {file.modified && (
                <Circle className="h-2 w-2 fill-primary text-primary flex-shrink-0" />
              )}
            </div>
            
            {files.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className={`
                  h-6 w-6 p-0 opacity-0 group-hover:opacity-100 
                  transition-opacity hover:bg-destructive/20 hover:text-destructive
                  ${isActive ? 'opacity-100' : ''}
                `}
                onClick={(e) => handleFileRemove(e, file.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FileExplorer;