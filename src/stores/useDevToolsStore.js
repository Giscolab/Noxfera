import { create } from 'zustand';

// Temporary simple store without useSyncExternalStore issues
let state = {
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
  }
};

const listeners = new Set();

const useDevToolsStore = () => {
  return {
    ...state,
    setAdvancedMode: (enabled) => {
      state = { ...state, advancedMode: enabled };
      listeners.forEach(listener => listener());
    },
    setHtmlCode: (code) => {
      state = { ...state, htmlCode: code };
      listeners.forEach(listener => listener());
    },
    setCssCode: (code) => {
      state = { ...state, cssCode: code };
      listeners.forEach(listener => listener());
    },
    setJsCode: (code) => {
      state = { ...state, jsCode: code };
      listeners.forEach(listener => listener());
    },
    setJshintResults: (results) => {
      state = { ...state, jshintResults: results };
      listeners.forEach(listener => listener());
    },
    setMinifiedCode: (code) => {
      state = { ...state, minifiedCode: code };
      listeners.forEach(listener => listener());
    },
    setObfuscatedCode: (code) => {
      state = { ...state, obfuscatedCode: code };
      listeners.forEach(listener => listener());
    },
    setComplexityResults: (results) => {
      state = { ...state, complexityResults: results };
      listeners.forEach(listener => listener());
    },
    setCodeStats: (stats) => {
      state = { ...state, codeStats: stats };
      listeners.forEach(listener => listener());
    },
    generatePreviewHTML: () => {
      return `
        ${state.htmlCode}
        <style>${state.cssCode}</style>
        <script>${state.jsCode}</script>
      `;
    },
    resetDevTools: () => {
      state = {
        ...state,
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
      };
      listeners.forEach(listener => listener());
    }
  };
};

export default useDevToolsStore;