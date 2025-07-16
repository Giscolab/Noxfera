import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Command, Settings, Moon, Sun, Monitor } from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';

const Header = () => {
  const { 
    currentTheme, 
    setCurrentTheme, 
    setSidebarOpen, 
    sidebarOpen,
    formatCode,
    currentLanguage 
  } = useEditorStore();
  
  const { projectName, files } = useFileStore();

  const themes = [
    { value: 'default', label: 'Default', icon: Monitor },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dracula', label: 'Dracula', icon: Moon },
    { value: 'tokyo-night', label: 'Tokyo Night', icon: Moon },
    { value: 'solarized', label: 'Solarized', icon: Sun },
  ];

  const handleFormatCode = () => {
    formatCode();
  };

  return (
    <header className="col-span-full bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-primary">Ultimate Beautifier</h1>
            <span className="text-xs text-muted-foreground hidden md:block">
              Professional Code Formatter
            </span>
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-8" />
        
        {/* Project Info */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Project:</span>
          <span className="text-sm font-medium">{projectName}</span>
          <span className="text-xs text-muted-foreground">
            ({files.length} file{files.length !== 1 ? 's' : ''})
          </span>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-3">
        {/* Format Button */}
        <Button 
          onClick={handleFormatCode}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 
                     text-primary-foreground font-medium px-6 py-2 rounded-lg
                     shadow-lg hover:shadow-xl transition-all duration-200
                     flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Format Code</span>
          <span className="sm:hidden">Format</span>
        </Button>
        
        {/* Command Palette */}
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 bg-background/50 hover:bg-accent"
        >
          <Command className="h-4 w-4" />
          <span className="hidden md:inline">Commands</span>
          <kbd className="hidden md:inline text-xs bg-muted px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Language Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/50">
          <div className={`w-2 h-2 rounded-full ${getLanguageColor(currentLanguage)}`}></div>
          <span className="text-xs font-medium capitalize">
            {currentLanguage}
          </span>
        </div>
        
        {/* Theme Selector */}
        <Select value={currentTheme} onValueChange={setCurrentTheme}>
          <SelectTrigger className="w-[140px] bg-background/50">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <SelectItem key={theme.value} value={theme.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3" />
                    {theme.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {/* Settings */}
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-accent"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        {/* Sidebar Toggle */}
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden hover:bg-accent"
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
        </Button>
      </div>
    </header>
  );
};

function getLanguageColor(language) {
  const colors = {
    html: 'bg-orange-500',
    css: 'bg-blue-500',
    javascript: 'bg-yellow-500',
    typescript: 'bg-blue-600',
    json: 'bg-green-500',
    yaml: 'bg-purple-500',
    markdown: 'bg-gray-500',
    xml: 'bg-red-500',
    python: 'bg-green-600',
    vue: 'bg-emerald-500',
    sql: 'bg-cyan-500',
    shell: 'bg-gray-600',
    text: 'bg-muted',
  };
  
  return colors[language] || 'bg-muted';
}

export default Header;