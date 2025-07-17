import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

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
  height = '100%',
}: MonacoEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      instanceRef.current = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme,
        readOnly,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
      });

      if (onChange && !readOnly) {
        instanceRef.current.onDidChangeModelContent(() => {
          const current = instanceRef.current?.getValue() ?? '';
          onChange(current);
        });
      }
    }

    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (instanceRef.current && instanceRef.current.getValue() !== value) {
      instanceRef.current.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (instanceRef.current) {
      const model = instanceRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  useEffect(() => {
    monaco.editor.setTheme(theme);
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