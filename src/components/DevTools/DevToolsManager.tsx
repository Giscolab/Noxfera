import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Code, 
  Eye, 
  AlertTriangle, 
  Minimize2, 
  Shield, 
  Activity, 
  BarChart3,
  X
} from 'lucide-react';
import useDevToolsStore from '@/stores/useDevToolsStore';
import { LivePreview } from './LivePreview';
import { JSHintPanel } from './JSHintPanel';
import { MinificationPanel } from './MinificationPanel';
import { ObfuscationPanel } from './ObfuscationPanel';
import { ComplexityPanel } from './ComplexityPanel';
import { DashboardPanel } from './DashboardPanel';

export function DevToolsManager() {
  const {
    advancedMode,
    setAdvancedMode,
    showJSHint,
    showMinification,
    showObfuscation,
    showComplexity,
    showDashboard,
    toggleJSHint,
    toggleMinification,
    toggleObfuscation,
    toggleComplexity,
    toggleDashboard,
    resetDevTools
  } = useDevToolsStore();

  const devToolsPanels = [
    {
      id: 'jshint',
      label: 'JSHint',
      icon: AlertTriangle,
      active: showJSHint,
      toggle: toggleJSHint,
      component: JSHintPanel,
      description: 'Détection d\'erreurs JS en temps réel'
    },
    {
      id: 'minification',
      label: 'Minification',
      icon: Minimize2,
      active: showMinification,
      toggle: toggleMinification,
      component: MinificationPanel,
      description: 'Compression du code HTML/CSS/JS'
    },
    {
      id: 'obfuscation',
      label: 'Obfuscation',
      icon: Shield,
      active: showObfuscation,
      toggle: toggleObfuscation,
      component: ObfuscationPanel,
      description: 'Sécurisation du code JavaScript'
    },
    {
      id: 'complexity',
      label: 'Complexité',
      icon: Activity,
      active: showComplexity,
      toggle: toggleComplexity,
      component: ComplexityPanel,
      description: 'Analyse de complexité cyclomatique'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      active: showDashboard,
      toggle: toggleDashboard,
      component: DashboardPanel,
      description: 'Métriques et statistiques du code'
    }
  ];

  const activePanelsCount = devToolsPanels.filter(panel => panel.active).length;

  if (!advancedMode) {
    return (
      <div className="h-full flex flex-col">
        {/* Mode basique - Juste la prévisualisation */}
        <LivePreview />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header avec contrôles */}
      <Card className="neumorph-panel">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Dev Tools</h2>
              <Badge variant="secondary" className="neumorph-flat">
                Mode avancé
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="advanced-mode" className="text-sm">Mode avancé</Label>
                <Switch
                  id="advanced-mode"
                  checked={advancedMode}
                  onCheckedChange={setAdvancedMode}
                />
              </div>
              
              {activePanelsCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetDevTools}
                  className="neumorph-button"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="preview" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-6 bg-background neumorph-flat">
            <TabsTrigger value="preview" className="neumorph-tab data-[state=active]:neumorph-pressed">
              <Eye className="w-4 h-4 mr-2" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="jshint" className="neumorph-tab data-[state=active]:neumorph-pressed">
              <AlertTriangle className="w-4 h-4 mr-2" />
              JSHint
            </TabsTrigger>
            <TabsTrigger value="minify" className="neumorph-tab data-[state=active]:neumorph-pressed">
              <Minimize2 className="w-4 h-4 mr-2" />
              Minifier
            </TabsTrigger>
            <TabsTrigger value="obfuscate" className="neumorph-tab data-[state=active]:neumorph-pressed">
              <Shield className="w-4 h-4 mr-2" />
              Obfusquer
            </TabsTrigger>
            <TabsTrigger value="complexity" className="neumorph-tab data-[state=active]:neumorph-pressed">
              <Activity className="w-4 h-4 mr-2" />
              Complexité
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="neumorph-tab data-[state=active]:neumorph-pressed">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4 overflow-hidden">
            <TabsContent value="preview" className="h-full m-0">
              <LivePreview />
            </TabsContent>

            <TabsContent value="jshint" className="h-full m-0">
              <div className="grid grid-cols-2 gap-6 h-full">
                <LivePreview />
                <JSHintPanel />
              </div>
            </TabsContent>

            <TabsContent value="minify" className="h-full m-0">
              <div className="grid grid-cols-2 gap-6 h-full">
                <LivePreview />
                <MinificationPanel />
              </div>
            </TabsContent>

            <TabsContent value="obfuscate" className="h-full m-0">
              <div className="grid grid-cols-2 gap-6 h-full">
                <LivePreview />
                <ObfuscationPanel />
              </div>
            </TabsContent>

            <TabsContent value="complexity" className="h-full m-0">
              <div className="grid grid-cols-2 gap-6 h-full">
                <LivePreview />
                <ComplexityPanel />
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="h-full m-0">
              <div className="grid grid-cols-2 gap-6 h-full">
                <LivePreview />
                <DashboardPanel />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}