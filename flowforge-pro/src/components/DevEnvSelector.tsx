'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/components/ui/use-toast';
import type { DevEnvironment } from '@/types';
import { ArrowRight, ArrowLeft, Terminal, Zap, Code2, Monitor, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';

const devEnvironments: {
  type: DevEnvironment;
  title: string;
  emoji: string;
  description: string;
  command: string;
  icon: typeof Terminal;
  color: string;
  copyable: boolean;
  link?: string;
}[] = [
  {
    type: 'opencode',
    title: 'Open Code',
    emoji: '⚡',
    description: 'Fast terminal AI coding',
    command: 'npm i -g opencode',
    icon: Terminal,
    color: 'cyan',
    copyable: true,
  },
  {
    type: 'claude-terminal',
    title: 'Claude Code Terminal',
    emoji: '🔥',
    description: 'Official Anthropic CLI',
    command: 'npm i -g @anthropic-ai/claude-code',
    icon: Terminal,
    color: 'orange',
    copyable: true,
  },
  {
    type: 'claude-vscode',
    title: 'Claude Code VS Code',
    emoji: '💎',
    description: 'IDE integration',
    command: 'Install VS Code extension',
    icon: Code2,
    color: 'blue',
    copyable: false,
    link: 'https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code',
  },
  {
    type: 'claude-desktop',
    title: 'Claude Desktop',
    emoji: '🖥️',
    description: 'Desktop app with MCP',
    command: 'Download from anthropic.com',
    icon: Monitor,
    color: 'purple',
    copyable: false,
    link: 'https://anthropic.com/claude',
  },
  {
    type: 'gemini-antigraphity',
    title: 'Gemini Antigraphity',
    emoji: '🌀',
    description: 'Visual canvas for coding',
    command: 'Visit antigraphity.com',
    icon: Sparkles,
    color: 'green',
    copyable: false,
    link: 'https://antigraphity.com',
  },
];

export function DevEnvSelector() {
  const { devEnvironment, setDevEnvironment, nextStep, prevStep } = useAppStore();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const handleSelect = (env: DevEnvironment) => {
    setDevEnvironment(env);
  };

  const handleCopyCommand = async (e: React.MouseEvent, command: string, title: string) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    toast({
      title: 'Copied!',
      description: `${title} command copied to clipboard`,
      variant: 'success',
    });
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const handleOpenLink = (e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
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
        {devEnvironments.map(({ type, title, emoji, description, command, icon: Icon, color, copyable, link }) => (
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
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    {title}
                    {devEnvironment === type && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        Selected
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1.5 rounded flex-1 overflow-x-auto">
                  {command}
                </code>
                {copyable ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => handleCopyCommand(e, command, title)}
                    aria-label={`Copy ${title} command`}
                  >
                    {copiedCommand === command ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                ) : link ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => handleOpenLink(e, link)}
                    aria-label={`Open ${title} website`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
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
