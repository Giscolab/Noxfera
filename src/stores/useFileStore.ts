import { create } from 'zustand';

export interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  modified: boolean;
  created: number;
}

interface FileStoreState {
  files: CodeFile[];
  activeFileId: string | null;
  fileCounter: number;
  projectName: string;
  lastSaved: number | null;
  autoSave: boolean;
}

interface FileStoreActions {
  addFile: (file: Partial<CodeFile>) => string;
  removeFile: (fileId: string) => void;
  updateFile: (fileId: string, updates: Partial<CodeFile>) => void;
  setActiveFile: (fileId: string) => void;
  getActiveFile: () => CodeFile | undefined;
  getAllFiles: () => CodeFile[];
  createNewFile: (name: string, language?: string) => string;
  importFiles: (fileList: FileList) => Promise<string[]>;
  exportFile: (fileId: string, format?: string) => void;
  exportAllFiles: () => void;
  saveProject: () => void;
  loadProject: () => boolean;
  setProjectName: (name: string) => void;
}

type FileStore = FileStoreState & FileStoreActions;

const useFileStore = create<FileStore>((set, get) => ({
  files: [
    {
      id: '1',
      name: 'example.js',
      language: 'javascript',
      content: `// Example JavaScript file
function calculateSum(a, b) {
  return a + b;
}

const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, num) => acc + num, 0);
console.log('Sum:', sum);`,
      modified: false,
      created: Date.now(),
    },
  ],
  activeFileId: '1',
  fileCounter: 1,
  projectName: 'Untitled Project',
  lastSaved: null,
  autoSave: true,

  addFile: (file) => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: file.name || `untitled-${get().fileCounter + 1}.txt`,
      language: file.language || 'text',
      content: file.content || '',
      modified: false,
      created: Date.now(),
    };

    set((state) => ({
      files: [...state.files, newFile],
      activeFileId: newFile.id,
      fileCounter: state.fileCounter + 1,
    }));

    return newFile.id;
  },

  removeFile: (fileId) => {
    const { files, activeFileId } = get();
    const newFiles = files.filter((f) => f.id !== fileId);

    const newActiveId = activeFileId === fileId && newFiles.length > 0 ? newFiles[0].id : activeFileId;

    set({
      files: newFiles,
      activeFileId: newActiveId,
    });
  },

  updateFile: (fileId, updates) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId ? { ...file, ...updates, modified: true } : file
      ),
    }));
  },

  setActiveFile: (fileId) => {
    set({ activeFileId: fileId });
  },

  getActiveFile: () => {
    const { files, activeFileId } = get();
    return files.find((f) => f.id === activeFileId);
  },

  getAllFiles: () => get().files,

  createNewFile: (name, language = 'text') => {
    const templates: Record<string, string> = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>`,
      css: `/* Styles for ${name} */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`,
      javascript: `// ${name}
function main() {
    console.log('Hello, World!');
}

main();`,
      json: `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "A new JSON file"
}`,
      yaml: `# ${name}
name: ${name}
version: 1.0.0
description: A new YAML file`,
      markdown: `# ${name}

Welcome to your new Markdown file!

## Features

- **Bold text**
- *Italic text*
- \`Code blocks\`

### Code Example

\`\`\`javascript
console.log('Hello from Markdown!');
\`\`\``,
    };

    const content = templates[language] || `// New ${language} file\n`;

    return get().addFile({
      name: name || `untitled.${getFileExtension(language)}`,
      language,
      content,
    });
  },

  importFiles: async (fileList) => {
    const importedFiles: string[] = [];

    for (const file of Array.from(fileList)) {
      try {
        const content = await readFileAsText(file);
        const language = detectLanguageFromFilename(file.name);

        const fileId = get().addFile({
          name: file.name,
          language,
          content,
        });

        importedFiles.push(fileId);
      } catch (error) {
        console.error('Error importing file:', file.name, error);
      }
    }

    return importedFiles;
  },

  exportFile: (fileId, format = 'text') => {
    const file = get().files.find((f) => f.id === fileId);
    if (!file) return;

    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportAllFiles: () => {
    const { files } = get();

    const allContent = files
      .map((file) => `// File: ${file.name}\n${file.content}\n\n`)
      .join('---\n\n');

    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${get().projectName || 'project'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  saveProject: () => {
    const { files, projectName } = get();
    const projectData = {
      name: projectName,
      files,
      saved: Date.now(),
    };

    localStorage.setItem('beautifier-project', JSON.stringify(projectData));
    set({ lastSaved: Date.now() });
  },

  loadProject: () => {
    try {
      const saved = localStorage.getItem('beautifier-project');
      if (saved) {
        const projectData = JSON.parse(saved);
        set({
          files: projectData.files || [],
          projectName: projectData.name || 'Untitled Project',
          lastSaved: projectData.saved,
          activeFileId: projectData.files?.[0]?.id || null,
        });
        return true;
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
    return false;
  },

  setProjectName: (name) => {
    set({ projectName: name });
  },
}));

// Helpers
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

function detectLanguageFromFilename(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  const extensionMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    json: 'json',
    yml: 'yaml',
    yaml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
    xml: 'xml',
    svg: 'xml',
    py: 'python',
    php: 'php',
    vue: 'vue',
    sql: 'sql',
    sh: 'shell',
    bash: 'shell',
  };

  return extensionMap[extension || ''] || 'text';
}

function getFileExtension(language: string): string {
  const extensionMap: Record<string, string> = {
    javascript: 'js',
    typescript: 'ts',
    html: 'html',
    css: 'css',
    json: 'json',
    yaml: 'yml',
    markdown: 'md',
    xml: 'xml',
    python: 'py',
    vue: 'vue',
    sql: 'sql',
    shell: 'sh',
  };

  return extensionMap[language] || 'txt';
}

export default useFileStore;
