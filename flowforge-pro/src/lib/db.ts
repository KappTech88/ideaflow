import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'flowforge.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    project_type TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    original_idea TEXT NOT NULL,
    optimized_data TEXT,
    workflow_data TEXT,
    schema_data TEXT,
    dev_environment TEXT,
    database_type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;

export interface ProjectRow {
  id: string;
  name: string;
  project_type: string;
  status: string;
  original_idea: string;
  optimized_data: string | null;
  workflow_data: string | null;
  schema_data: string | null;
  dev_environment: string | null;
  database_type: string | null;
  created_at: string;
  updated_at: string;
}

export function getProjects(): ProjectRow[] {
  return db.prepare('SELECT * FROM projects ORDER BY updated_at DESC LIMIT 20').all() as ProjectRow[];
}

export function getProject(id: string): ProjectRow | undefined {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as ProjectRow | undefined;
}

export function createProject(project: {
  id: string;
  name: string;
  projectType: string;
  originalIdea: string;
  optimizedData?: string;
  workflowData?: string;
  schemaData?: string;
  devEnvironment?: string;
  databaseType?: string;
  status?: string;
}): void {
  const stmt = db.prepare(`
    INSERT INTO projects (id, name, project_type, status, original_idea, optimized_data, workflow_data, schema_data, dev_environment, database_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    project.id,
    project.name,
    project.projectType,
    project.status || 'draft',
    project.originalIdea,
    project.optimizedData || null,
    project.workflowData || null,
    project.schemaData || null,
    project.devEnvironment || null,
    project.databaseType || null
  );
}

export function updateProject(id: string, updates: Partial<{
  name: string;
  status: string;
  optimizedData: string;
  workflowData: string;
  schemaData: string;
  devEnvironment: string;
  databaseType: string;
}>): void {
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (updates.name !== undefined) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    values.push(updates.status);
  }
  if (updates.optimizedData !== undefined) {
    fields.push('optimized_data = ?');
    values.push(updates.optimizedData);
  }
  if (updates.workflowData !== undefined) {
    fields.push('workflow_data = ?');
    values.push(updates.workflowData);
  }
  if (updates.schemaData !== undefined) {
    fields.push('schema_data = ?');
    values.push(updates.schemaData);
  }
  if (updates.devEnvironment !== undefined) {
    fields.push('dev_environment = ?');
    values.push(updates.devEnvironment);
  }
  if (updates.databaseType !== undefined) {
    fields.push('database_type = ?');
    values.push(updates.databaseType);
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');

  const stmt = db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values, id);
}
