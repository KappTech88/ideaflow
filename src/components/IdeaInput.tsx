'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, ArrowLeft, Sparkles, Lightbulb } from 'lucide-react';

const exampleIdeas = [
  'A habit tracker with streaks and reminders',
  'Personal finance dashboard with budgets',
  'Recipe manager with meal planning',
  'Bookmark organizer with tags and search',
  'Time tracker for freelancers with invoicing',
  'Reading list with progress tracking',
];

export function IdeaInput() {
  const { originalIdea, setOriginalIdea, nextStep, prevStep, projectType, setLoading, setOptimizedData } = useAppStore();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleExampleClick = (idea: string) => {
    setOriginalIdea(idea);
  };

  const handleContinue = async () => {
    if (!originalIdea.trim()) return;

    setIsOptimizing(true);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: originalIdea, projectType }),
      });

      if (!response.ok) throw new Error('Failed to optimize idea');

      const data = await response.json();
      setOptimizedData(data);
      nextStep();
    } catch (error) {
      console.error('Error optimizing idea:', error);
    } finally {
      setIsOptimizing(false);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Describe your app idea
        </h2>
        <p className="mt-2 text-muted-foreground">
          Tell us what you want to build in plain language
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
            Your Idea
          </CardTitle>
          <CardDescription>
            Be as detailed as you like - our AI will help structure it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: I want to build a personal finance tracker that helps me categorize expenses, set budgets, and visualize my spending patterns over time..."
            value={originalIdea}
            onChange={(e) => setOriginalIdea(e.target.value)}
            className="min-h-[150px] resize-none"
          />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              {exampleIdeas.map((idea) => (
                <Badge
                  key={idea}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/20 hover:border-primary transition-colors"
                  onClick={() => handleExampleClick(idea)}
                >
                  {idea}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!originalIdea.trim() || isOptimizing}
          className="gap-2"
        >
          {isOptimizing ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              Optimize with AI
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
