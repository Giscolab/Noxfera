import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LivePreview } from './LivePreview';
import { DevConsole } from './DevConsole';
import { JSHintPanel } from './JSHintPanel';
import { MinificationPanel } from './MinificationPanel';
import { ObfuscationPanel } from './ObfuscationPanel';
import { ComplexityPanel } from './ComplexityPanel';
import { 
  Code, 
  Eye, 
  Terminal, 
  CheckCircle, 
  Minimize, 
  Zap, 
  BarChart3,
  Settings 
} from 'lucide-react';

interface DevToolsManagerProps {
  isAdvancedMode: boolean;
}

export function DevToolsManager({ isAdvancedMode }: DevToolsManagerProps) {
  const [activeTab, setActiveTab] = useState('preview');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  if (!isAdvancedMode) {
    return null;
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Main DevTools Interface */}
      <Card className="neumorph-panel flex-1 flex flex-col">
        <CardHeader className="p-4 bg-muted/30 rounded-t-2xl border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Developer Tools</h2>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="neumorph-button"
            >
              <Terminal className="w-4 h-4 mr-2" />
              Console
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 bg-background neumorph-flat m-4 mb-0">
              <TabsTrigger 
                value="preview" 
                className="neumorph-tab data-[state=active]:neumorph-pressed flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span>Live Preview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="jshint" 
                className="neumorph-tab data-[state=active]:neumorph-pressed flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>JSHint</span>
              </TabsTrigger>
              <TabsTrigger 
                value="minify" 
                className="neumorph-tab data-[state=active]:neumorph-pressed flex items-center gap-2"
              >
                <Minimize className="w-4 h-4" />
                <span>Minify</span>
              </TabsTrigger>
              <TabsTrigger 
                value="obfuscate" 
                className="neumorph-tab data-[state=active]:neumorph-pressed flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Obfuscate</span>
              </TabsTrigger>
              <TabsTrigger 
                value="complexity" 
                className="neumorph-tab data-[state=active]:neumorph-pressed flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Complexity</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 p-4">
              <TabsContent value="preview" className="h-full m-0">
                <LivePreview />
              </TabsContent>
              
              <TabsContent value="jshint" className="h-full m-0">
                <JSHintPanel />
              </TabsContent>
              
              <TabsContent value="minify" className="h-full m-0">
                <MinificationPanel />
              </TabsContent>
              
              <TabsContent value="obfuscate" className="h-full m-0">
                <ObfuscationPanel />
              </TabsContent>
              
              <TabsContent value="complexity" className="h-full m-0">
                <ComplexityPanel />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dev Console */}
      <DevConsole 
        isOpen={isConsoleOpen} 
        onToggle={() => setIsConsoleOpen(!isConsoleOpen)} 
      />
    </div>
  );
}