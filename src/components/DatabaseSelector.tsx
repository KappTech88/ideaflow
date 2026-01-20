'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import type { DatabaseType } from '@/types';
import { ArrowRight, ArrowLeft, Database, Zap, Server, Cloud } from 'lucide-react';

const databases: {
  type: DatabaseType;
  title: string;
  description: string;
  icon: typeof Database;
  features: string[];
  recommended: 'personal' | 'public' | null;
}[] = [
  {
    type: 'sqlite',
    title: 'SQLite',
    description: 'Lightweight, file-based database',
    icon: Database,
    features: ['Zero configuration', 'Single file storage', 'Perfect for local tools', 'Fastest setup'],
    recommended: 'personal',
  },
  {
    type: 'postgresql',
    title: 'PostgreSQL',
    description: 'Powerful, enterprise-grade database',
    icon: Server,
    features: ['Advanced features', 'Excellent for scaling', 'Strong data integrity', 'Best for production'],
    recommended: 'public',
  },
  {
    type: 'mysql',
    title: 'MySQL',
    description: 'Popular, widely supported database',
    icon: Cloud,
    features: ['Wide hosting support', 'Good performance', 'Large community', 'Easy to deploy'],
    recommended: null,
  },
];

export function DatabaseSelector() {
  const { databaseType, setDatabaseType, nextStep, prevStep, projectType } = useAppStore();

  const handleSelect = (type: DatabaseType) => {
    setDatabaseType(type);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Choose Your Database
        </h2>
        <p className="mt-2 text-muted-foreground">
          Select the database that best fits your needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {databases.map(({ type, title, description, icon: Icon, features, recommended }) => (
          <Card
            key={type}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:scale-[1.02] relative',
              databaseType === type
                ? 'border-primary glow-cyan'
                : 'hover:border-muted-foreground/50'
            )}
            onClick={() => handleSelect(type)}
          >
            {recommended === projectType && (
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white">
                Recommended
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription className="text-xs">{description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-3 w-3 text-cyan-400" />
                    {feature}
                  </li>
                ))}
              </ul>
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
          disabled={!databaseType}
          className="gap-2"
        >
          Generate Schema
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
