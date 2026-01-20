import { create } from 'zustand';
import type { AppState, StepNumber, ProjectType, DatabaseType, DevEnvironment, OptimizedData, WorkflowData, SchemaData } from '@/types';

const initialState = {
  currentStep: 1 as StepNumber,
  projectType: null as ProjectType | null,
  originalIdea: '',
  optimizedData: null as OptimizedData | null,
  workflowData: null as WorkflowData | null,
  databaseType: null as DatabaseType | null,
  schemaData: null as SchemaData | null,
  devEnvironment: null as DevEnvironment | null,
  isLoading: false,
  error: null as string | null,
};

export const useAppStore = create<AppState>((set, get) => ({
  ...initialState,

  setStep: (step: StepNumber) => set({ currentStep: step }),

  setProjectType: (type: ProjectType) => set({ projectType: type }),

  setOriginalIdea: (idea: string) => set({ originalIdea: idea }),

  setOptimizedData: (data: OptimizedData) => set({ optimizedData: data }),

  setWorkflowData: (data: WorkflowData) => set({ workflowData: data }),

  setDatabaseType: (type: DatabaseType) => set({ databaseType: type }),

  setSchemaData: (data: SchemaData) => set({ schemaData: data }),

  setDevEnvironment: (env: DevEnvironment) => set({ devEnvironment: env }),

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  reset: () => set(initialState),

  nextStep: () => {
    const current = get().currentStep;
    if (current < 8) {
      set({ currentStep: (current + 1) as StepNumber });
    }
  },

  prevStep: () => {
    const current = get().currentStep;
    if (current > 1) {
      set({ currentStep: (current - 1) as StepNumber });
    }
  },
}));
