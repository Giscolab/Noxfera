import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type BeautifyOptions = {
  indent_size: number;
  indent_char: string;
  brace_style: string;
  end_with_newline: boolean;
  wrap_line_length: number;
  preserve_newlines: boolean;
  max_preserve_newlines: number;
  indent_inner_html: boolean;
  unformatted: string[];
  content_unformatted: string[];
  space_after_anon_function: boolean;
  space_before_conditional: boolean;
};

type SupportedLanguage = {
  id: string;
  name: string;
  extensions: string[];
};

interface EditorState {
  originalCode: string;
  formattedCode: string;
  currentLanguage: string;
  isFormatted: boolean;

  activeTab: string;
  sidebarOpen: boolean;
  showWelcome: boolean;
  currentTheme: string;

  beautifyOptions: BeautifyOptions;

  supportedLanguages: SupportedLanguage[];

  setOriginalCode: (code: string) => void;
  setFormattedCode: (code: string) => void;
  setCurrentLanguage: (lang: string) => void;
  setIsFormatted: (b: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setShowWelcome: (show: boolean) => void;
  setCurrentTheme: (theme: string) => void;
  setBeautifyOptions: (opts: Partial<BeautifyOptions>) => void;

  formatCode: () => void;
  detectLanguage: (code: string) => string;
  setLanguageManually: (lang: string) => void;
}

const useEditorStore = create<EditorState>()(
  subscribeWithSelector((set, get) => ({
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
    activeTab: 'preview',
    sidebarOpen: true,
    showWelcome: true,
    currentTheme: 'default',
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
    supportedLanguages: [
      { id: 'javascript', name: 'JavaScript', extensions: ['.js', '.jsx'] },
      { id: 'typescript', name: 'TypeScript', extensions: ['.ts', '.tsx'] },
      { id: 'html', name: 'HTML', extensions: ['.html', '.htm'] },
      { id: 'css', name: 'CSS', extensions: ['.css', '.scss', '.sass'] },
      { id: 'json', name: 'JSON', extensions: ['.json'] },
      { id: 'python', name: 'Python', extensions: ['.py'] },
      { id: 'java', name: 'Java', extensions: ['.java'] },
      { id: 'cpp', name: 'C++', extensions: ['.cpp', '.c', '.h'] },
      { id: 'yaml', name: 'YAML', extensions: ['.yml', '.yaml'] },
      { id: 'markdown', name: 'Markdown', extensions: ['.md'] },
      { id: 'sql', name: 'SQL', extensions: ['.sql'] }
    ],
    setOriginalCode: code => set({ originalCode: code }),
    setFormattedCode: code => set({ formattedCode: code }),
    setCurrentLanguage: lang => set({ currentLanguage: lang }),
    setIsFormatted: b => set({ isFormatted: b }),
    setActiveTab: tab => set({ activeTab: tab }),
    setSidebarOpen: open => set({ sidebarOpen: open }),
    setShowWelcome: show => set({ showWelcome: show }),
    setCurrentTheme: theme => set({ currentTheme: theme }),
    setBeautifyOptions: options =>
      set(state => ({
        beautifyOptions: { ...state.beautifyOptions, ...options }
      })),
    formatCode: () => {
      const state = get();
      const { originalCode, currentLanguage, beautifyOptions } = state;
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
          case 'json': {
            const parsed = JSON.parse(originalCode);
            formatted = JSON.stringify(parsed, null, beautifyOptions.indent_size);
            break;
          }
          case 'yaml':
            formatted = formatYAML(originalCode, beautifyOptions);
            break;
          case 'markdown':
            formatted = formatMarkdown(originalCode);
            break;
          default:
            formatted = originalCode;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        formatted = `// Error formatting code:\n// ${message}\n\n${originalCode}`;
      }

      set({ formattedCode: formatted, isFormatted: true });
    },
    detectLanguage: (code: string) => {
      let language = 'text';
      const trimmedCode = code.trim().toLowerCase();

      if (trimmedCode.startsWith('<!doctype') || trimmedCode.startsWith('<html')) {
        language = 'html';
      } else if (trimmedCode.startsWith('<') && trimmedCode.includes('</')) {
        language = 'html';
      } else if (trimmedCode.startsWith('{') || trimmedCode.startsWith('[')) {
        try {
          JSON.parse(code);
          language = 'json';
        } catch {
          if (code.includes('function') || code.includes('=>') || code.includes('const')) {
            language = 'javascript';
          }
        }
      } else if (code.includes('import ') && code.includes('from ')) {
        if (code.includes('interface ') || code.includes(': string')) {
          language = 'typescript';
        } else {
          language = 'javascript';
        }
      } else if (code.includes('def ') || (code.includes('import ') && code.includes('print('))) {
        language = 'python';
      } else if (code.includes('#include') || code.includes('int main(')) {
        language = 'cpp';
      } else if (code.includes('public class') || code.includes('System.out.')) {
        language = 'java';
      } else if (code.includes('@media') || (code.includes('selector') && code.includes('{'))) {
        language = 'css';
      } else if (code.includes('function') || code.includes('let ') || code.includes('=>')) {
        language = 'javascript';
      } else if (code.includes('---\n') || code.includes('name:') || code.includes('version:')) {
        language = 'yaml';
      } else if (code.includes('# ') && code.includes('\n')) {
        language = 'markdown';
      } else if (code.includes('SELECT ') || code.includes('FROM ') || code.includes('INSERT ')) {
        language = 'sql';
      }

      set({ currentLanguage: language });
      return language;
    },
    setLanguageManually: lang => set({ currentLanguage: lang }),
  }))
);

// Formatter Functions – pas encore typés finement
function formatHTML(code: string, options: BeautifyOptions): string {
  const formatted = code.replace(/>\s+</g, '><');
  let indentLevel = 0;
  const indent = ' '.repeat(options.indent_size);
  const lines = formatted.split(/></);
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (i > 0) line = '<' + line;
    if (i < lines.length - 1) line = line + '>';
    if (line.includes('</') && !line.includes(`</${line.split('</')[1].split('>')[0]}>`)) indentLevel--;
    result.push(indent.repeat(Math.max(0, indentLevel)) + line.trim());
    if (line.includes('<') && !line.includes('</') && !line.includes('/>')) indentLevel++;
  }

  return result.join('\n');
}

function formatCSS(code: string, options: BeautifyOptions): string {
  const indent = ' '.repeat(options.indent_size);
  return code
    .replace(/\{/g, ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n')
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      if (trimmed.includes('{') || trimmed === '}') return trimmed;
      return indent + trimmed;
    })
    .join('\n')
    .replace(/\n\n+/g, '\n\n');
}

function formatJavaScript(code: string, options: BeautifyOptions): string {
  const indent = ' '.repeat(options.indent_size);
  const formatted = code
    .replace(/([=+*/-])/g, ' $1 ')
    .replace(/\s+/g, ' ')
    .replace(/\{/g, options.brace_style === 'expand' ? '\n{\n' : ' {\n')
    .replace(/\}/g, '\n}\n')
    .replace(/;/g, ';\n');

  let indentLevel = 0;
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

function formatYAML(code: string, options: BeautifyOptions): string {
  const indent = ' '.repeat(options.indent_size);
  return code
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      const depth = (line.match(/^\s*/)?.[0].length || 0) / 2;
      return indent.repeat(depth) + trimmed;
    })
    .join('\n');
}

function formatMarkdown(code: string): string {
  return code
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    .replace(/\n\n+/g, '\n\n');
}

export default useEditorStore;
