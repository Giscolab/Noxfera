import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, File, Search, Sparkles, FileText, Code, Braces } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface UltimateBeautifierSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFileCountChange: (count: number) => void;
}

export function UltimateBeautifierSidebar({ collapsed, onToggleCollapse, onFileCountChange }: UltimateBeautifierSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [indentSize, setIndentSize] = useState([4]);
  const [braceStyle, setBraceStyle] = useState('collapse');
  const [endWithNewline, setEndWithNewline] = useState(true);
  const [files] = useState([
    { name: 'script.js', language: 'javascript', active: true },
    { name: 'styles.css', language: 'css', active: false },
    { name: 'index.html', language: 'html', active: false },
  ]);

  React.useEffect(() => {
    onFileCountChange(files.length);
  }, [files.length, onFileCountChange]);

  const getFileIcon = (language: string) => {
    switch (language) {
      case 'html': return <FileText className="w-4 h-4 text-orange-500" />;
      case 'css': return <Code className="w-4 h-4 text-blue-500" />;
      case 'javascript': return <Braces className="w-4 h-4 text-yellow-500" />;
      default: return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside 
      className={`bg-card border-r border-border transition-all duration-300 relative flex flex-col ${
        collapsed ? 'w-15' : 'w-64'
      }`}
      style={{ gridArea: 'sidebar' }}
    >
      {/* Sidebar Toggle */}
      <Button
        variant="default"
        size="sm"
        className="absolute -right-4 top-3 z-10 w-8 h-8 rounded-full shadow-lg"
        onClick={onToggleCollapse}
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
                />
              </div>

              <div className="space-y-1">
                {filteredFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      file.active 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    {getFileIcon(file.language)}
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                ))}
              </div>
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
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Style d'accolades</Label>
                <Select value={braceStyle} onValueChange={setBraceStyle}>
                  <SelectTrigger className="w-full">
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
                />
              </div>
            </Card>

            <Button className="w-full" size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Formater le code
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}