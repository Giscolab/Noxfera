import { create } from 'zustand';

type MinifiedCode = {
  html: string;
  css: string;
  js: string;
};

interface JSHintError {
  reason: string;
  line: number;
  character: number;
}

interface ComplexityResult {
  complexity: {
    cyclomatic: number;
    sloc: {
      physical: number;
      logical: number;
    };
    halstead: {
      bugs: number;
      difficulty: number;
      effort: number;
      length: number;
      time: number;
      vocabulary: number;
      volume: number;
    };
  };
  functions: Array<{
    name: string;
    complexity: {
      cyclomatic: number;
      sloc: {
        physical: number;
        logical: number;
      };
    };
  }>;
}

interface CodeStats {
  lines: number;
  htmlLines: number;
  cssLines: number;
  jsLines: number;
  functions: number;
  indentation: string;
  duplication: number;
  size: number;
  complexity: number;
  comments: number;
  commentRatio: number;
  maintainabilityIndex: number;
  codeSmells: string[];
};

interface DevToolsStore {
  advancedMode: boolean;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  jshintResults: JSHintError[];
  minifiedCode: MinifiedCode;
  obfuscatedCode: string;
  complexityResults: ComplexityResult | null;
  codeStats: CodeStats;

  setAdvancedMode: (enabled: boolean) => void;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
  setJshintResults: (results: JSHintError[]) => void;
  setMinifiedCode: (code: MinifiedCode) => void;
  setObfuscatedCode: (code: string) => void;
  setComplexityResults: (results: ComplexityResult | null) => void;
  setCodeStats: (stats: CodeStats) => void;
  generatePreviewHTML: () => string;
  resetDevTools: () => void;
}

const useDevToolsStore = create<DevToolsStore>((set, get) => ({
  advancedMode: false,
  htmlCode: `<!DOCTYPE html>
<html>
<head>
  <title>Preview</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
  cssCode: `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #333;
  text-align: center;
}`,
  jsCode: `console.log("Hello from preview!");

function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`,
  jshintResults: [],
  minifiedCode: { html: '', css: '', js: '' },
  obfuscatedCode: '',
  complexityResults: null,
  codeStats: {
    lines: 0,
    htmlLines: 0,
    cssLines: 0,
    jsLines: 0,
    functions: 0,
    indentation: 'spaces',
    duplication: 0,
    size: 0,
    complexity: 0,
    comments: 0,
    commentRatio: 0,
    maintainabilityIndex: 100,
    codeSmells: [],
  },

  setAdvancedMode: (enabled) => set({ advancedMode: enabled }),
  setHtmlCode: (code) => set({ htmlCode: code }),
  setCssCode: (code) => set({ cssCode: code }),
  setJsCode: (code) => set({ jsCode: code }),
  setJshintResults: (results) => set({ jshintResults: results }),
  setMinifiedCode: (code) => set({ minifiedCode: code }),
  setObfuscatedCode: (code) => set({ obfuscatedCode: code }),
  setComplexityResults: (results) => set({ complexityResults: results }),
  setCodeStats: (stats) => set({ codeStats: stats }),

  generatePreviewHTML: () => {
    const { htmlCode, cssCode, jsCode } = get();
    return `
      ${htmlCode}
      <style>${cssCode}</style>
      <script>${jsCode}</script>
    `;
  },

  resetDevTools: () => set({
    jshintResults: [],
    minifiedCode: { html: '', css: '', js: '' },
    obfuscatedCode: '',
    complexityResults: null,
    codeStats: {
      lines: 0,
      htmlLines: 0,
      cssLines: 0,
      jsLines: 0,
      functions: 0,
      indentation: 'spaces',
      duplication: 0,
      size: 0,
      complexity: 0,
      comments: 0,
      commentRatio: 0,
      maintainabilityIndex: 100,
      codeSmells: [],
    },
  }),
}));

export default useDevToolsStore;
