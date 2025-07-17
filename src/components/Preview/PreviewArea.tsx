import React, { useState } from 'react';
import { Eye, GitCompare, Terminal, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function PreviewArea() {
  const [activeTab, setActiveTab] = useState('preview');
  const [previewContent, setPreviewContent] = useState('');

  const handleRefresh = () => {
    // Refresh preview logic
    console.log('Refreshing preview...');
  };

  const handleOpenExternal = () => {
    // Open in new tab logic
    window.open('data:text/html,' + encodeURIComponent(previewContent), '_blank');
  };

  const diffData = [
    { type: 'added', content: '+   margin: 0 auto;' },
    { type: 'removed', content: '-   margin:0auto;' },
    { type: 'unchanged', content: '    padding: 20px;' },
    { type: 'added', content: '+   background-color: #f5f5f5;' },
  ];

  const consoleLogs = [
    { time: '14:30:15', level: 'info', message: 'Code formaté avec succès' },
    { time: '14:30:16', level: 'warn', message: 'Attention: indentation détectée automatiquement' },
    { time: '14:30:17', level: 'success', message: 'Aperçu mis à jour' },
  ];

  return (
    <Card className="col-span-2">
      <CardHeader className="p-3 bg-muted/50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-auto grid-cols-3 bg-background">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger value="diff" className="flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                Différence
              </TabsTrigger>
              <TabsTrigger value="console" className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Console
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button 
  variant="ghost" 
  size="sm" 
  onClick={handleRefresh}
  aria-label="Rafraîchir l’aperçu"
>
  <RefreshCw className="w-4 h-4" />
</Button>

              <Button 
  variant="ghost" 
  size="sm" 
  onClick={handleOpenExternal}
  aria-label="Ouvrir dans un nouvel onglet"
>
  <ExternalLink className="w-4 h-4" />
</Button>

            </div>
          </div>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs value={activeTab} className="w-full h-full">
          <TabsContent value="preview" className="h-[200px] m-0">
            <iframe 
              className="w-full h-full border-none bg-white rounded-b-lg"
              title="Aperçu du code"
              srcDoc={previewContent || '<html><body><div style="padding: 20px; text-align: center; color: #666;">Aucun contenu HTML à prévisualiser</div></body></html>'}
            />
          </TabsContent>
          
          <TabsContent value="diff" className="h-[200px] m-0 overflow-auto custom-scrollbar p-4">
            <div className="space-y-1 font-mono text-sm">
              {diffData.map((line, index) => (
                <div key={index} className={`px-2 py-1 ${
                  line.type === 'added' ? 'bg-green-500/20 text-green-400' :
                  line.type === 'removed' ? 'bg-red-500/20 text-red-400 line-through' :
                  'text-muted-foreground'
                }`}>
                  {line.content}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="console" className="h-[200px] m-0 overflow-auto custom-scrollbar p-4">
            <div className="space-y-2 font-mono text-sm">
              {consoleLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    log.level === 'info' ? 'bg-blue-500/20 text-blue-400' :
                    log.level === 'warn' ? 'bg-yellow-500/20 text-yellow-400' :
                    log.level === 'success' ? 'bg-green-500/20 text-green-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}