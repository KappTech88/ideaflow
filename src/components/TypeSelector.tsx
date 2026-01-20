'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { ProjectType } from '@/types';
import { User, Globe, ArrowRight, Database, Lock, Zap } from 'lucide-react';

const projectTypes: {
  type: ProjectType;
  title: string;
  description: string;
  icon: typeof User;
  features: string[];
  color: string;
}[] = [
  {
    type: 'personal',
    title: 'Personal Tool',
    description: 'Simple, fast, no overhead',
    icon: User,
    features: ['SQLite database', 'No authentication', 'Minimal dependencies', 'Quick to build'],
    color: 'cyan',
  },
  {
    type: 'public',
    title: 'Public App',
    description: 'Production-ready, scalable',
    icon: Globe,
    features: ['PostgreSQL database', 'User authentication', 'Stripe payments', 'Analytics ready'],
    color: 'magenta',
  },
];

export function TypeSelector() {
  const { projectType, setProjectType, nextStep } = useAppStore();

  const handleSelect = (type: ProjectType) => {
    setProjectType(type);
  };

  const handleContinue = () => {
    if (projectType) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          What are you building?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Choose your project type to get tailored recommendations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projectTypes.map(({ type, title, description, icon: Icon, features, color }) => (
          <Card
            key={type}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:scale-[1.02]',
              projectType === type
                ? color === 'cyan'
                  ? 'border-cyan-500 glow-cyan'
                  : 'border-magenta-500 glow-magenta'
                : 'hover:border-muted-foreground/50'
            )}
            onClick={() => handleSelect(type)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg',
                    color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-magenta-500/20 text-magenta-400'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {i === 0 && <Database className="h-4 w-4" />}
                    {i === 1 && <Lock className="h-4 w-4" />}
                    {i === 2 && <Zap className="h-4 w-4" />}
                    {i === 3 && <ArrowRight className="h-4 w-4" />}
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!projectType}
          className="gap-2"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
