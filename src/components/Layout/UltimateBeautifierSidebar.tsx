import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, File, Search, Sparkles, FileText, Code, Braces } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import FileExplorer from '../FileExplorer/FileExplorer';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';
import useDevToolsStore from '@/stores/useDevToolsStore';

interface UltimateBeautifierSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function UltimateBeautifierSidebar({ collapsed, onToggleCollapse }: UltimateBeautifierSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    beautifyOptions, 
    setBeautifyOptions, 
    formatCode 
  } = useEditorStore();
  
  const { files } = useFileStore();
  
  const { 
    advancedMode, 
    setAdvancedMode 
  } = useDevToolsStore();
  
  const [indentSize, setIndentSize] = useState([beautifyOptions.indent_size]);
  const [braceStyle, setBraceStyle] = useState(beautifyOptions.brace_style);
  const [endWithNewline, setEndWithNewline] = useState(beautifyOptions.end_with_newline);

  const handleOptionsChange = () => {
    setBeautifyOptions({
      ...beautifyOptions,
      indent_size: indentSize[0],
      brace_style: braceStyle,
      end_with_newline: endWithNewline,
    });
  };

  React.useEffect(() => {
    handleOptionsChange();
  }, [indentSize, braceStyle, endWithNewline]);

  return (
    <aside 
      className={`bg-card border-r border-border transition-all duration-300 relative flex flex-col ${collapsed ? 'w-15' : 'w-64'}`}
      style={{ gridArea: 'sidebar' }}
    >
      {/* Sidebar Toggle */}
      <Button
        variant="default"
        size="sm"
        type="button"
        className="absolute -right-4 top-3 z-10 w-8 h-8 rounded-full shadow-lg"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Développer la barre latérale" : "Réduire la barre latérale"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {!collapsed && (
        <>
          {/* File Explorer Section */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                Explorateur de fichiers
              </h3>
              
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un fichier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background"
                  aria-label="Rechercher un fichier"
                />
              </div>

              <FileExplorer />
            </div>
          </div>

          {/* Beautify Options Section */}
          <div className="p-4 space-y-4 border-t border-border">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Options de formatage
            </h3>
            
            <Card className="p-3 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm">Taille d'indentation</Label>
                  <span className="text-sm text-muted-foreground">{indentSize[0]}</span>
                </div>
                <Slider
                  value={indentSize}
                  onValueChange={setIndentSize}
                  min={2}
                  max={8}
                  step={1}
                  className="w-full"
                  aria-label="Taille d'indentation"
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Style d'accolades</Label>
                <Select value={braceStyle} onValueChange={setBraceStyle}>
                  <SelectTrigger className="w-full" aria-label="Sélectionner un style d'accolades">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collapse">Collapse</SelectItem>
                    <SelectItem value="expand">Expand</SelectItem>
                    <SelectItem value="end-expand">End Expand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm">Finir avec une nouvelle ligne</Label>
                <Switch
                  checked={endWithNewline}
                  onCheckedChange={setEndWithNewline}
                  aria-label="Finir le fichier par une nouvelle ligne"
                />
              </div>
            </Card>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={formatCode}
              aria-label="Formater le code"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Formater le code
            </Button>
          </div>

          {/* Options Avancées Section */}
          <div className="p-4 space-y-4 border-t border-border">
            <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Options avancées
            </h3>
            
            <Card className="neumorph-panel p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Mode avancé</Label>
                  <p className="text-xs text-muted-foreground">
                    Active les outils de développement
                  </p>
                </div>
                <div className="neumorph-toggle">
                  <Switch
                    checked={advancedMode}
                    onCheckedChange={setAdvancedMode}
                    aria-label="Activer le mode avancé"
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </div>
              
              {advancedMode && (
                <div className="neumorph-inset p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Code className="w-3 h-3" />
                    <span>Dev Tools activés</span>
                  </div>
                  <p className="text-xs mt-1 text-primary">
                    Prévisualisation, JSHint, Minification, Obfuscation, Analyse de complexité
                  </p>
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </aside>
  );
}