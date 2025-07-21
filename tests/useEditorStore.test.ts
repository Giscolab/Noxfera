import useEditorStore from '../src/stores/useEditorStore';

const initial = useEditorStore.getState();

beforeEach(() => {
  // reset store to initial state between tests
  useEditorStore.setState(initial, true);
});

describe('useEditorStore actions', () => {
  it('updates original code', () => {
    useEditorStore.getState().setOriginalCode('hello');
    expect(useEditorStore.getState().originalCode).toBe('hello');
  });

  it('merges beautify options', () => {
    useEditorStore.getState().setBeautifyOptions({ indent_size: 4 });
    expect(useEditorStore.getState().beautifyOptions.indent_size).toBe(4);
    expect(useEditorStore.getState().beautifyOptions.end_with_newline).toBe(true);
  });

  it('detects language and updates state', () => {
    const lang = useEditorStore.getState().detectLanguage('function a() {}');
    expect(lang).toBe('javascript');
    expect(useEditorStore.getState().currentLanguage).toBe('javascript');
  });

  it('formats code and sets flag', () => {
    const code = 'function a(){console.log(1);}';
    const { setOriginalCode, setCurrentLanguage, formatCode } = useEditorStore.getState();
    setOriginalCode(code);
    setCurrentLanguage('javascript');
    formatCode();
    const state = useEditorStore.getState();
    expect(state.isFormatted).toBe(true);
    expect(state.formattedCode).not.toBe(code);
  });
});
