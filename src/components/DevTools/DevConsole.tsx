import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  X, 
  Minimize2, 
  Maximize2, 
  Trash2, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface ConsoleMessage {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  source: string;
  message: string;
}

interface DevConsoleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function DevConsole({ isOpen, onToggle }: DevConsoleProps) {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');

  // Mock initial messages
  useEffect(() => {
    const initialMessages: ConsoleMessage[] = [
      {
        id: '1',
        timestamp: new Date(),
        level: 'info',
        source: 'System',
        message: 'Console Dev Tools initialisée'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000),
        level: 'success',
        source: 'Editor',
        message: 'Code formaté avec succès'
      }
    ];
    
    setMessages(initialMessages);
  }, []);

  // Fonction publique pour ajouter des messages
  const addMessage = (level: ConsoleMessage['level'], source: string, message: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      source,
      message
    };
    
    setMessages(prev => [newMessage, ...prev].slice(0, 100)); // Garder seulement les 100 derniers messages
  };

  // Exposer la fonction globalement pour les autres composants
  useEffect(() => {
    (window as any).devConsole = { addMessage };
    
    return () => {
      delete (window as any).devConsole;
    };
  }, []);

  const clearMessages = () => {
    setMessages([]);
  };

  const getFilteredMessages = () => {
    if (filter === 'all') return messages;
    return messages.filter(msg => msg.level === filter);
  };

  const getMessageIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="w-3 h-3 text-destructive" />;
      case 'warning':
        return <AlertCircle className="w-3 h-3 text-warning" />;
      case 'success':
        return <CheckCircle className="w-3 h-3 text-success" />;
      default:
        return <Info className="w-3 h-3 text-primary" />;
    }
  };

  const getMessageCount = (level: string) => {
    return messages.filter(msg => msg.level === level).length;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour12: false,
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 z-50 animate-fade-in">
      <Card className="neumorph-floating max-h-80 flex flex-col">
        <CardHeader className="p-3 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold">Console de Développement</h3>
              
              <div className="flex items-center gap-1 ml-4">
                {(['error', 'warning', 'success', 'info'] as const).map(level => {
                  const count = getMessageCount(level);
                  if (count === 0) return null;
                  
                  return (
                    <Badge 
                      key={level}
                      variant="secondary" 
                      className={`text-xs neumorph-flat cursor-pointer transition-colors ${
                        filter === level ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => setFilter(filter === level ? 'all' : level)}
                    >
                      {getMessageIcon(level)}
                      <span className="ml-1">{count}</span>
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="neumorph-button h-7 w-7 p-0"
                title={isMinimized ? "Agrandir" : "Réduire"}
              >
                {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={clearMessages}
                className="neumorph-button h-7 w-7 p-0"
                title="Vider la console"
                disabled={messages.length === 0}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="neumorph-button h-7 w-7 p-0"
                title="Fermer la console"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex-1 overflow-hidden">
            <div className="h-60 overflow-y-auto custom-scrollbar">
              {getFilteredMessages().length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">
                      {filter === 'all' ? 'Aucun message' : `Aucun message de type "${filter}"`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {getFilteredMessages().map((message) => (
                    <div
                      key={message.id}
                      className="neumorph-flat p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {getMessageIcon(message.level)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              {formatTime(message.timestamp)}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.source}
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// Hook pour utiliser la console de développement
export function useDevConsole() {
  const addMessage = (level: ConsoleMessage['level'], source: string, message: string) => {
    if ((window as any).devConsole) {
      (window as any).devConsole.addMessage(level, source, message);
    }
  };

  return { addMessage };
}