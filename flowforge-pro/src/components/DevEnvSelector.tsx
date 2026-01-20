'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { DevEnvironment } from '@/types';
import { ArrowRight, ArrowLeft, Terminal, Zap, Code2, Monitor, Sparkles } from 'lucide-react';

const devEnvironments: {
  type: DevEnvironment;
  title: string;
  emoji: string;
  description: string;
  command: string;
  icon: typeof Terminal;
  color: string;
}[] = [
  {
    type: 'opencode',
    title: 'Open Code',
    emoji: '⚡',
    description: 'Fast terminal AI coding',
    command: 'npm i -g opencode',
    icon: Terminal,
    color: 'cyan',
  },
  {
    type: 'claude-terminal',
    title: 'Claude Code Terminal',
    emoji: '🔥',
    description: 'Official Anthropic CLI',
    command: 'npm i -g @anthropic-ai/claude-code',
    icon: Terminal,
    color: 'orange',
  },
  {
    type: 'claude-vscode',
    title: 'Claude Code VS Code',
    emoji: '💎',
    description: 'IDE integration',
    command: 'Install VS Code extension',
    icon: Code2,
    color: 'blue',
  },
  {
    type: 'claude-desktop',
    title: 'Claude Desktop',
    emoji: '🖥️',
    description: 'Desktop app with MCP',
    command: 'Download from anthropic.com',
    icon: Monitor,
    color: 'purple',
  },
  {
    type: 'gemini-antigraphity',
    title: 'Gemini Antigraphity',
    emoji: '🌀',
    description: 'Visual canvas for coding',
    command: 'Visit antigraphity.com',
    icon: Sparkles,
    color: 'green',
  },
];

export function DevEnvSelector() {
  const { devEnvironment, setDevEnvironment, nextStep, prevStep } = useAppStore();

  const handleSelect = (env: DevEnvironment) => {
    setDevEnvironment(env);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Choose Dev Environment
        </h2>
        <p className="mt-2 text-muted-foreground">
          Select your preferred AI coding environment
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devEnvironments.map(({ type, title, emoji, description, command, icon: Icon, color }) => (
          <Card
            key={type}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:scale-[1.02]',
              devEnvironment === type
                ? 'border-primary glow-cyan'
                : 'hover:border-muted-foreground/50'
            )}
            onClick={() => handleSelect(type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{emoji}</div>
                <div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription className="text-xs">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <code className="text-xs bg-muted px-2 py-1 rounded block overflow-x-auto">
                {command}
              </code>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={nextStep}
          disabled={!devEnvironment}
          className="gap-2"
        >
          Export Project
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
