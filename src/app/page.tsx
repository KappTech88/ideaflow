'use client';

import { useAppStore } from '@/store/useAppStore';
import { StepIndicator } from '@/components/StepIndicator';
import { TypeSelector } from '@/components/TypeSelector';
import { IdeaInput } from '@/components/IdeaInput';
import { RefinedConcept } from '@/components/RefinedConcept';
import { WorkflowCanvas } from '@/components/WorkflowCanvas';
import { DatabaseSelector } from '@/components/DatabaseSelector';
import { SchemaEditor } from '@/components/SchemaEditor';
import { DevEnvSelector } from '@/components/DevEnvSelector';
import { ExportPanel } from '@/components/ExportPanel';
import { Zap } from 'lucide-react';

export default function Home() {
  const currentStep = useAppStore((state) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <TypeSelector />;
      case 2:
        return <IdeaInput />;
      case 3:
        return <RefinedConcept />;
      case 4:
        return <WorkflowCanvas />;
      case 5:
        return <DatabaseSelector />;
      case 6:
        return <SchemaEditor />;
      case 7:
        return <DevEnvSelector />;
      case 8:
        return <ExportPanel />;
      default:
        return <TypeSelector />;
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-magenta-500 shadow-lg shadow-cyan-500/20">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-magenta-400 bg-clip-text text-transparent">
            FlowForge Pro
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          AI-Powered Workflow Generator for Developers
        </p>
      </header>

      <StepIndicator />

      <div className="mt-8">
        {renderStep()}
      </div>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Built with Next.js, Tailwind CSS, and Claude AI</p>
      </footer>
    </main>
  );
}
