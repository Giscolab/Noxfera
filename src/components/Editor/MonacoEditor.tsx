import React, { useEffect, useRef } from 'react';

interface MonacoEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  height?: string;
}

export function MonacoEditor({ 
  value, 
  onChange, 
  language = 'javascript', 
  theme = 'vs-dark',
  readOnly = false,
  height = '100%'
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    // Load Monaco Editor dynamically
    const loadMonaco = async () => {
      if (typeof window !== 'undefined' && !window.monaco) {
        // Load Monaco from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.37.1/min/vs/loader.min.js';
        script.onload = () => {
          if (window.require) {
            window.require.config({ 
              paths: { 
                'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.37.1/min/vs' 
              }
            });
            
            window.require(['vs/editor/editor.main'], () => {
              initializeEditor();
            });
          }
        };
        document.head.appendChild(script);
      } else if (window.monaco && editorRef.current) {
        initializeEditor();
      }
    };

    const initializeEditor = () => {
      if (editorRef.current && window.monaco && !monacoRef.current) {
        monacoRef.current = window.monaco.editor.create(editorRef.current, {
          value: value,
          language: language,
          theme: theme,
          readOnly: readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
        });

        // Set up onChange listener
        if (onChange && !readOnly) {
          monacoRef.current.onDidChangeModelContent(() => {
            const currentValue = monacoRef.current.getValue();
            onChange(currentValue);
          });
        }
      }
    };

    loadMonaco();

    return () => {
      if (monacoRef.current) {
        monacoRef.current.dispose();
        monacoRef.current = null;
      }
    };
  }, []);

  // Update editor content when value prop changes
  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value);
    }
  }, [value]);

  // Update language
  useEffect(() => {
    if (monacoRef.current && window.monaco) {
      const model = monacoRef.current.getModel();
      if (model) {
        window.monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  // Update theme
  useEffect(() => {
    if (window.monaco) {
      window.monaco.editor.setTheme(theme);
    }
  }, [theme]);

  return (
    <div 
      ref={editorRef} 
      style={{ height, width: '100%' }}
      className="monaco-editor-container"
    />
  );
}

// Global type declaration for Monaco
declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}