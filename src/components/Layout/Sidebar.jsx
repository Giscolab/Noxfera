import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  FolderOpen, 
  FileText, 
  Plus, 
  Download, 
  Upload,
  Settings,
  Palette,
  Code2
} from 'lucide-react';
import useEditorStore from '@/stores/useEditorStore';
import useFileStore from '@/stores/useFileStore';
import FileExplorer from '../FileExplorer/FileExplorer';

const Sidebar = () => {
  const { 
    sidebarOpen, 
    beautifyOptions, 
    setBeautifyOptions 
  } = useEditorStore();
  
  const { 
    createNewFile, 
    importFiles, 
    exportAllFiles 
  } = useFileStore();

  const handleFileImport = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      await importFiles(files);
    }
    event.target.value = ''; // Reset input
  };

  const handleNewFile = () => {
    const language = 'javascript'; // Default
    createNewFile(`untitled-${Date.now()}.js`, language);
  };

  if (!sidebarOpen) {
    return (
      <aside className="hidden lg:block w-16 bg-surface border-r border-border">
        <div className="flex flex-col items-center py-4 gap-4">
          <Button variant="ghost" size="sm">
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Palette className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-280 bg-surface border-r border-border overflow-y-auto">
      <div className="p-4 space-y-6">
        
        {/* File Explorer Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              File Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <FileExplorer />
            
            <Separator />
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleNewFile}
                className="flex-1"
              >
                <Plus className="h-3 w-3 mr-1" />
                New
              </Button>
              
              <label className="flex-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <span>
                    <Upload className="h-3 w-3 mr-1" />
                    Import
                  </span>
                </Button>
                <input
                  type="file"
                  multiple
                  accept=".js,.ts,.html,.css,.json,.yaml,.yml,.md,.xml,.vue,.py,.php,.sql,.sh"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportAllFiles}
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Beautify Options Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Formatting Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Indent Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Indent Size</label>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-accent rounded">
                  {beautifyOptions.indent_size}
                </span>
              </div>
              <Slider
                value={[beautifyOptions.indent_size]}
                onValueChange={([value]) => setBeautifyOptions({ indent_size: value })}
                min={2}
                max={8}
                step={1}
                className="w-full"
              />
            </div>
            
            <Separator />
            
            {/* Brace Style */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Brace Style</label>
              <Select 
                value={beautifyOptions.brace_style} 
                onValueChange={(value) => setBeautifyOptions({ brace_style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collapse">Collapse</SelectItem>
                  <SelectItem value="expand">Expand</SelectItem>
                  <SelectItem value="end-expand">End Expand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            {/* Line Length */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Line Length</label>
                <span className="text-xs text-muted-foreground px-2 py-1 bg-accent rounded">
                  {beautifyOptions.wrap_line_length}
                </span>
              </div>
              <Slider
                value={[beautifyOptions.wrap_line_length]}
                onValueChange={([value]) => setBeautifyOptions({ wrap_line_length: value })}
                min={80}
                max={200}
                step={10}
                className="w-full"
              />
            </div>
            
            <Separator />
            
            {/* Toggle Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">End with newline</label>
                <Switch
                  checked={beautifyOptions.end_with_newline}
                  onCheckedChange={(checked) => setBeautifyOptions({ end_with_newline: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Preserve newlines</label>
                <Switch
                  checked={beautifyOptions.preserve_newlines}
                  onCheckedChange={(checked) => setBeautifyOptions({ preserve_newlines: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Space after function</label>
                <Switch
                  checked={beautifyOptions.space_after_anon_function}
                  onCheckedChange={(checked) => setBeautifyOptions({ space_after_anon_function: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
            >
              <Palette className="h-4 w-4 mr-2" />
              Reset to defaults
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Save preferences
            </Button>
          </CardContent>
        </Card>
        
      </div>
    </aside>
  );
};

export default Sidebar;