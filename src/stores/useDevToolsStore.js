import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDevToolsStore = create(
  persist(
    (set, get) => ({
      // État du mode avancé (persisté)
      advancedMode: false,
      setAdvancedMode: (enabled) => set({ advancedMode: enabled }),

      // Code pour la prévisualisation
      htmlCode: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Preview</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>',
      cssCode: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}',
      jsCode: 'console.log("Hello from preview!");\n\n// Exemple de fonction\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Utilisation\nconst message = greet("World");\nconsole.log(message);',
      
      setHtmlCode: (code) => set({ htmlCode: code }),
      setCssCode: (code) => set({ cssCode: code }),
      setJsCode: (code) => set({ jsCode: code }),

      // État des panneaux dev tools
      showJSHint: false,
      showMinification: false,
      showObfuscation: false,
      showComplexity: false,
      showDashboard: false,

      toggleJSHint: () => set((state) => ({ showJSHint: !state.showJSHint })),
      toggleMinification: () => set((state) => ({ showMinification: !state.showMinification })),
      toggleObfuscation: () => set((state) => ({ showObfuscation: !state.showObfuscation })),
      toggleComplexity: () => set((state) => ({ showComplexity: !state.showComplexity })),
      toggleDashboard: () => set((state) => ({ showDashboard: !state.showDashboard })),

      // Résultats des analyses
      jshintResults: [],
      minifiedCode: { html: '', css: '', js: '' },
      obfuscatedCode: '',
      complexityResults: null,
      codeStats: {
        lines: 0,
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

      setJshintResults: (results) => set({ jshintResults: results }),
      setMinifiedCode: (code) => set({ minifiedCode: code }),
      setObfuscatedCode: (code) => set({ obfuscatedCode: code }),
      setComplexityResults: (results) => set({ complexityResults: results }),
      setCodeStats: (stats) => set({ codeStats: stats }),

      // Méthodes utilitaires
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
    }),
    {
      name: 'dev-tools-storage',
      partialize: (state) => ({ advancedMode: state.advancedMode })
    }
  )
);

export default useDevToolsStore;