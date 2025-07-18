import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

const useEditorStore = create(
  subscribeWithSelector((set, get) => ({
    // Editor state
    originalCode: `// Welcome to noxfera!
// Paste your code here or drag & drop files
function helloWorld() {
console.log("Hello, world!");
}

const user = {
name: "Developer",
skills: ["JavaScript", "React", "CSS"]
};`,
    formattedCode: '',
    currentLanguage: 'javascript',
    isFormatted: false,
    
    // UI state
    activeTab: 'preview',
    sidebarOpen: true,
    showWelcome: true,
    currentTheme: 'default',
    
    // Beautify options
    beautifyOptions: {
      indent_size: 2,
      indent_char: ' ',
      brace_style: 'collapse',
      end_with_newline: true,
      wrap_line_length: 120,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      indent_inner_html: true,
      unformatted: ['pre', 'code'],
      content_unformatted: ['script', 'style'],
      space_after_anon_function: true,
      space_before_conditional: true,
    },
    
    // Actions
    setOriginalCode: (code) => set({ originalCode: code }),
    setFormattedCode: (code) => set({ formattedCode: code }),
    setCurrentLanguage: (language) => set({ currentLanguage: language }),
    setIsFormatted: (formatted) => set({ isFormatted: formatted }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setShowWelcome: (show) => set({ showWelcome: show }),
    setCurrentTheme: (theme) => set({ currentTheme: theme }),
    setBeautifyOptions: (options) => set({ 
      beautifyOptions: { ...get().beautifyOptions, ...options }
    }),
    
    // Complex actions
    formatCode: () => {
      const { originalCode, currentLanguage, beautifyOptions } = get();
      let formatted = originalCode;
      
      try {
        switch (currentLanguage) {
          case 'html':
            formatted = formatHTML(originalCode, beautifyOptions);
            break;
          case 'css':
            formatted = formatCSS(originalCode, beautifyOptions);
            break;
          case 'javascript':
          case 'typescript':
            formatted = formatJavaScript(originalCode, beautifyOptions);
            break;
          case 'json':
            const parsed = JSON.parse(originalCode);
            formatted = JSON.stringify(parsed, null, beautifyOptions.indent_size);
            break;
          case 'yaml':
            formatted = formatYAML(originalCode, beautifyOptions);
            break;
          case 'markdown':
            formatted = formatMarkdown(originalCode, beautifyOptions);
            break;
          default:
            formatted = originalCode;
        }
      } catch (error) {
        formatted = `// Error formatting code:\n// ${error.message}\n\n${originalCode}`;
      }
      
      set({ formattedCode: formatted, isFormatted: true });
    },
    
    detectLanguage: (code) => {
      let language = 'text';
      
      if (code.trim().startsWith('<!DOCTYPE') || code.trim().startsWith('<html')) {
        language = 'html';
      } else if (code.trim().startsWith('<')) {
        language = 'html';
      } else if (code.includes('@media') || code.includes('{') && code.includes('}') && code.includes(':')) {
        if (code.includes('function') || code.includes('const') || code.includes('let')) {
          language = 'javascript';
        } else {
          language = 'css';
        }
      } else if (code.trim().startsWith('{') || code.trim().startsWith('[')) {
        try {
          JSON.parse(code);
          language = 'json';
        } catch {
          language = 'javascript';
        }
      } else if (code.includes('function') || code.includes('const') || code.includes('let') || code.includes('=>')) {
        language = 'javascript';
      } else if (code.includes('---') || code.includes('name:') || code.includes('version:')) {
        language = 'yaml';
      } else if (code.includes('#') && code.includes('\n')) {
        language = 'markdown';
      }
      
      set({ currentLanguage: language });
      return language;
    }
  }))
);

// Beautify functions
function formatHTML(code, options) {
  // Simple HTML formatter
  let formatted = code;
  const indent = ' '.repeat(options.indent_size);
  
  // Remove extra whitespace
  formatted = formatted.replace(/>\s+</g, '><');
  
  // Add proper indentation
  let indentLevel = 0;
  const lines = formatted.split(/></);
  const formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    if (i > 0) line = '<' + line;
    if (i < lines.length - 1) line = line + '>';
    
    if (line.includes('</') && !line.includes('</'+ line.split('</')[1].split('>')[0] + '>')) {
      indentLevel--;
    }
    
    formattedLines.push(indent.repeat(Math.max(0, indentLevel)) + line.trim());
    
    if (line.includes('<') && !line.includes('</') && !line.includes('/>')) {
      indentLevel++;
    }
  }
  
  return formattedLines.join('\n');
}

function formatCSS(code, options) {
  // Simple CSS formatter
  const indent = ' '.repeat(options.indent_size);
  
  return code
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      if (trimmed.includes('{')) return trimmed;
      if (trimmed === '}') return '}';
      return indent + trimmed;
    })
    .join('\n')
    .replace(/\n\n+/g, '\n\n');
}

function formatJavaScript(code, options) {
  // Simple JavaScript formatter
  const indent = ' '.repeat(options.indent_size);
  let formatted = code;
  let indentLevel = 0;
  
  // Add spaces around operators
  formatted = formatted.replace(/([=+\-*\/])/g, ' $1 ');
  formatted = formatted.replace(/\s+/g, ' ');
  
  // Format braces
  if (options.brace_style === 'expand') {
    formatted = formatted.replace(/\{/g, '\n{\n');
  } else {
    formatted = formatted.replace(/\{/g, ' {\n');
  }
  
  formatted = formatted.replace(/\}/g, '\n}\n');
  formatted = formatted.replace(/;/g, ';\n');
  
  return formatted
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      
      if (trimmed.includes('}')) indentLevel = Math.max(0, indentLevel - 1);
      const result = indent.repeat(indentLevel) + trimmed;
      if (trimmed.includes('{')) indentLevel++;
      
      return result;
    })
    .join('\n')
    .replace(/\n\n+/g, '\n\n');
}

function formatYAML(code, options) {
  // Simple YAML formatter - just fix indentation
  const lines = code.split('\n');
  const indent = ' '.repeat(options.indent_size);
  
  return lines
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      
      const depth = (line.match(/^\s*/)[0].length / 2) || 0;
      return indent.repeat(depth) + trimmed;
    })
    .join('\n');
}

function formatMarkdown(code, options) {
  // Simple Markdown formatter
  return code
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n\n+/g, '\n\n');
}

export default useEditorStore;