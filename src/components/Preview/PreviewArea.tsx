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
    <Card className="col-span-2 neumorph-panel">
      <CardHeader className="p-4 bg-muted/30 rounded-t-xl">
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
            <div className="neumorph-inset rounded-b-xl h-full">
              <iframe 
                className="w-full h-full border-none bg-white rounded-b-xl"
                title="Aperçu du code"
                srcDoc={previewContent || '<html><body><div style="padding: 20px; text-align: center; color: #666; font-family: Inter, sans-serif;">Aucun contenu HTML à prévisualiser</div></body></html>'}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="diff" className="h-[200px] m-0 overflow-auto custom-scrollbar p-4">
            <div className="space-y-2 font-mono text-sm neumorph-inset rounded-b-xl p-4">
              {diffData.map((line, index) => (
                <div key={index} className={`px-3 py-2 rounded-lg ${
                  line.type === 'added' ? 'bg-green-500/20 text-green-700 border-l-4 border-green-500' :
                  line.type === 'removed' ? 'bg-red-500/20 text-red-700 line-through border-l-4 border-red-500' :
                  'text-muted-foreground border-l-4 border-muted'
                }`}>
                  {line.content}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="console" className="h-[200px] m-0 overflow-auto custom-scrollbar p-4">
            <div className="space-y-3 font-mono text-sm neumorph-inset rounded-b-xl p-4">
              {consoleLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-card/50">
                  <span className="text-xs text-muted-foreground font-semibold">{log.time}</span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    log.level === 'info' ? 'bg-blue-500/20 text-blue-600' :
                    log.level === 'warn' ? 'bg-yellow-500/20 text-yellow-600' :
                    log.level === 'success' ? 'bg-green-500/20 text-green-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-foreground">{log.message}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}