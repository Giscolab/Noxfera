import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code2, FileText } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';

export function LanguageSelector() {
  const { currentLanguage, supportedLanguages, setLanguageManually } = useEditorStore();

  const handleLanguageChange = (language: string) => {
    setLanguageManually(language);
  };

  const getLanguageIcon = (langId: string) => {
    switch (langId) {
      case 'javascript':
      case 'typescript':
        return '🟨';
      case 'html':
        return '🟧';
      case 'css':
        return '🟦';
      case 'python':
        return '🐍';
      case 'java':
        return '☕';
      case 'cpp':
        return '⚙️';
      default:
        return '📝';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Code2 className="w-4 h-4 text-muted-foreground" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-40 h-8 neumorph-flat text-xs">
          <SelectValue placeholder="Langage">
            <div className="flex items-center gap-2">
              <span>{getLanguageIcon(currentLanguage)}</span>
              <span className="capitalize">
                {supportedLanguages.find(lang => lang.id === currentLanguage)?.name || currentLanguage}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="neumorph-floating border-0">
          {supportedLanguages.map((language) => (
            <SelectItem 
              key={language.id} 
              value={language.id}
              className="text-xs hover:neumorph-inset"
            >
              <div className="flex items-center gap-2">
                <span>{getLanguageIcon(language.id)}</span>
                <span>{language.name}</span>
                <span className="text-muted-foreground text-xs">
                  {language.extensions.join(', ')}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}