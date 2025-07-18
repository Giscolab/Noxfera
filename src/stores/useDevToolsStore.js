import { create } from 'zustand';

const useDevToolsStore = create((set, get) => ({
  // Dev Tools state
  advancedMode: false,
  htmlCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Preview</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
  cssCode: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}',
  jsCode: 'console.log("Hello from preview!");\n\n// Exemple de fonction\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Utilisation\nconst message = greet("World");\nconsole.log(message);',
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
    codeSmells: []
  },

  // Actions
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
      codeSmells: []
    }
  })
}));

export default useDevToolsStore;