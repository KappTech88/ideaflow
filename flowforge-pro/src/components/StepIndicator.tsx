'use client';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Type' },
  { number: 2, label: 'Idea' },
  { number: 3, label: 'Refine' },
  { number: 4, label: 'Workflow' },
  { number: 5, label: 'Database' },
  { number: 6, label: 'Schema' },
  { number: 7, label: 'Dev Setup' },
  { number: 8, label: 'Export' },
];

export function StepIndicator() {
  const currentStep = useAppStore((state) => state.currentStep);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300',
                  currentStep > step.number
                    ? 'border-primary bg-primary text-primary-foreground'
                    : currentStep === step.number
                    ? 'border-primary bg-primary/20 text-primary animate-pulse-glow'
                    : 'border-muted bg-muted/50 text-muted-foreground'
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
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
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
