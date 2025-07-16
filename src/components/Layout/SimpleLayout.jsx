import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const SimpleLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Ultimate Beautifier
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Professional code formatting at your fingertips
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Original Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-96 p-4 font-mono text-sm bg-muted rounded-md border border-border"
                placeholder="Paste your code here..."
                defaultValue={`// Welcome to Ultimate Beautifier!
function example(){
console.log("Hello World");
const data={name:"test",value:123};
return data;
}`}
              />
            </CardContent>
          </Card>

          {/* Output Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Formatted Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-96 p-4 font-mono text-sm bg-muted rounded-md border border-border"
                placeholder="Formatted code will appear here..."
                readOnly
                value={`// Welcome to Ultimate Beautifier!
function example() {
  console.log("Hello World");
  const data = {
    name: "test",
    value: 123
  };
  return data;
}`}
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button className="px-8 py-3 text-lg">
            <Sparkles className="h-5 w-5 mr-2" />
            Format Code
          </Button>
          <Button variant="outline" className="px-8 py-3 text-lg">
            Clear All
          </Button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🌐</div>
              <h3 className="font-semibold mb-2">Multi-Language</h3>
              <p className="text-sm text-muted-foreground">
                Support for HTML, CSS, JavaScript, JSON, YAML, and more
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Instant formatting with real-time preview
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">Beautiful Interface</h3>
              <p className="text-sm text-muted-foreground">
                Professional IDE-like experience in your browser
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimpleLayout;