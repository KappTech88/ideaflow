'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle, Edit3 } from 'lucide-react';

export function RefinedConcept() {
  const { optimizedData, nextStep, prevStep, setLoading, setWorkflowData, projectType } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleContinue = async () => {
    if (!optimizedData) return;

    setIsGenerating(true);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optimizedData, projectType }),
      });

      if (!response.ok) throw new Error('Failed to generate workflow');

      const data = await response.json();
      setWorkflowData(data);
      nextStep();
    } catch (error) {
      console.error('Error generating workflow:', error);
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  if (!optimizedData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No optimized data available. Please go back and enter your idea.</p>
        <Button variant="outline" onClick={prevStep} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
          Your Refined Concept
        </h2>
        <p className="mt-2 text-muted-foreground">
          AI has structured your idea into an actionable concept
        </p>
      </div>

      <Card className="gradient-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-cyan-400">{optimizedData.appName}</CardTitle>
              <CardDescription className="text-lg mt-1">{optimizedData.tagline}</CardDescription>
            </div>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <CheckCircle className="h-3 w-3 mr-1" />
              AI Optimized
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">Description</h4>
            <p className="text-foreground">{optimizedData.description}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Core Features</h4>
            <div className="grid gap-3">
              {optimizedData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
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
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Generating Workflow...
            </>
          ) : (
            <>
              Generate Workflow
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
