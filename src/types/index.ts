export type ProjectType = 'personal' | 'public';
export type DatabaseType = 'sqlite' | 'postgresql' | 'mysql';
export type DevEnvironment = 'opencode' | 'claude-terminal' | 'claude-vscode' | 'claude-desktop' | 'gemini-antigraphity';
export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface OptimizedData {
  appName: string;
  tagline: string;
  description: string;
  features: string[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'database' | 'api' | 'user';
  description: string;
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  steps: WorkflowStep[];
  connections: { from: string; to: string; label?: string }[];
}

export interface WorkflowData {
  pipelines: WorkflowPipeline[];
}

export interface SchemaColumn {
  name: string;
  type: string;
  constraints: string[];
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export interface SchemaData {
  tables: SchemaTable[];
}

export interface Project {
  id: string;
  name: string;
  projectType: ProjectType;
  status: 'draft' | 'completed';
  originalIdea: string;
  optimizedData?: OptimizedData;
  workflowData?: WorkflowData;
  schemaData?: SchemaData;
  devEnvironment?: DevEnvironment;
  databaseType?: DatabaseType;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  currentStep: StepNumber;
  projectType: ProjectType | null;
  originalIdea: string;
  optimizedData: OptimizedData | null;
  workflowData: WorkflowData | null;
  databaseType: DatabaseType | null;
  schemaData: SchemaData | null;
  devEnvironment: DevEnvironment | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStep: (step: StepNumber) => void;
  setProjectType: (type: ProjectType) => void;
  setOriginalIdea: (idea: string) => void;
  setOptimizedData: (data: OptimizedData) => void;
  setWorkflowData: (data: WorkflowData) => void;
  setDatabaseType: (type: DatabaseType) => void;
  setSchemaData: (data: SchemaData) => void;
  setDevEnvironment: (env: DevEnvironment) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
}
