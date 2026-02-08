'use client';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Type', description: 'Choose project type' },
  { number: 2, label: 'Idea', description: 'Describe your app idea' },
  { number: 3, label: 'Refine', description: 'Review AI optimization' },
  { number: 4, label: 'Workflow', description: 'View workflow diagram' },
  { number: 5, label: 'Database', description: 'Select database type' },
  { number: 6, label: 'Schema', description: 'Edit database schema' },
  { number: 7, label: 'Dev Setup', description: 'Choose dev environment' },
  { number: 8, label: 'Export', description: 'Download your project' },
];

export function StepIndicator() {
  const currentStep = useAppStore((state) => state.currentStep);
  const setStep = useAppStore((state) => state.setStep);

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigating to completed steps
    if (stepNumber < currentStep) {
      setStep(stepNumber);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, stepNumber: number) => {
    if ((e.key === 'Enter' || e.key === ' ') && stepNumber < currentStep) {
      e.preventDefault();
      setStep(stepNumber);
    }
  };

  return (
    <nav aria-label="Progress steps" className="w-full py-6">
      <ol className="flex items-center justify-between" role="list">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = step.number < currentStep;

          return (
            <li key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.number)}
                  onKeyDown={(e) => handleKeyDown(e, step.number)}
                  disabled={!isClickable}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                    isCompleted
                      ? 'border-primary bg-primary text-primary-foreground cursor-pointer hover:bg-primary/80'
                      : isCurrent
                      ? 'border-primary bg-primary/20 text-primary animate-pulse-glow cursor-default'
                      : 'border-muted bg-muted/50 text-muted-foreground cursor-default',
                    isClickable && 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'
                  )}
                  aria-label={`Step ${step.number}: ${step.label} - ${step.description}${isCompleted ? ' (Completed)' : isCurrent ? ' (Current)' : ''}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  tabIndex={isClickable ? 0 : -1}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{step.number}</span>
                  )}
                </button>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium transition-colors',
                    currentStep >= step.number
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-12 transition-colors duration-300 lg:w-20',
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="sr-only">
        Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
      </p>
    </nav>
  );
}
