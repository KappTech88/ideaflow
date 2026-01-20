# FlowForge Pro - Paste This Into Claude Code

Copy everything below and paste it into Claude Code (Terminal or Open Code):

-----

Build a local Next.js app called “FlowForge Pro” - an AI-powered workflow generator for developers.

## What It Does

Users go through 8 steps:

1. **Type** - Choose “Personal Tool” (simple, SQLite, no auth) or “Public App” (PostgreSQL, auth, scalable)
1. **Idea** - Enter their app idea in plain text
1. **Refine** - AI optimizes into structured concept (app name, tagline, 5 features, description)
1. **Workflow** - AI generates visual workflow pipelines with steps (display with React Flow)
1. **Database** - Choose database type (SQLite, PostgreSQL, or MySQL)
1. **Schema** - AI generates database schema based on the workflow, user can edit, see SQL preview
1. **Dev Setup** - Choose AI coding environment (Open Code, Claude Code Terminal, Claude Code VS Code, Claude Desktop, Gemini Antigraphity)
1. **Export** - Download Markdown dev plan, N8N workflow JSON, ComfyUI workflow JSON, and SQL schema file

## Tech Stack

- Next.js 14+ (App Router)
- Tailwind CSS + shadcn/ui
- SQLite via better-sqlite3 (local file in /data folder)
- Zustand for state
- React Flow for workflow visualization
- Anthropic Claude API (claude-sonnet-4-20250514)
- Lucide React for icons

## Key Requirements

1. **No authentication** - this is a local tool
1. **All data stored in local SQLite** at `data/flowforge.db`
1. **Dark theme** - use gray-950 background, cyan/magenta accents
1. **Single page app** - all steps render on same page based on currentStep state
1. **Save projects** - store completed projects in SQLite for history

## API Routes Needed

```
POST /api/ai/optimize     - Takes { idea, projectType }, returns optimized concept
POST /api/ai/workflow     - Takes { optimizedData, projectType }, returns workflow pipelines
POST /api/ai/schema       - Takes { optimizedData, workflowData, projectType, databaseType }, returns schema
GET  /api/projects        - Get recent projects from SQLite
POST /api/projects        - Save a project to SQLite
```

## AI Prompts Should

- For **Personal Tools**: Recommend SQLite, minimal deps, no auth, simple architecture
- For **Public Apps**: Recommend PostgreSQL, user auth, Stripe payments, analytics

## Database Schema (SQLite)

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  project_type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  original_idea TEXT NOT NULL,
  optimized_data TEXT,  -- JSON string
  workflow_data TEXT,   -- JSON string  
  schema_data TEXT,     -- JSON string
  dev_environment TEXT,
  database_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Dev Environment Options

Each should show setup commands and recommended AI agents:

1. **Open Code** ⚡ - `npm i -g opencode` - Fast terminal AI coding
1. **Claude Code Terminal** 🔥 - `npm i -g @anthropic-ai/claude-code` - Official CLI
1. **Claude Code VS Code** 💎 - Install extension - IDE integration
1. **Claude Desktop** 🖥️ - Download app, configure MCP servers
1. **Gemini Antigraphity** 🌀 - Visit antigraphity.com - Visual canvas

## Export Formats

1. **Markdown** - Complete dev plan with quick-start prompt for the chosen AI environment
1. **N8N JSON** - Workflow nodes that can be imported into N8N
1. **ComfyUI JSON** - Node-based workflow format
1. **SQL** - CREATE TABLE statements for the generated schema

## UI Components Needed

- StepIndicator (shows progress through 8 steps)
- TypeSelector (two cards: Personal Tool / Public App)
- IdeaInput (textarea with example chips)
- RefinedConcept (displays AI-optimized app concept)
- WorkflowCanvas (React Flow visualization of pipelines)
- DatabaseSelector (three cards: SQLite / PostgreSQL / MySQL)
- SchemaEditor (table cards with columns, editable, SQL preview)
- DevEnvSelector (five environment cards)
- ExportPanel (download buttons for each format)

## Get Started

1. Create the Next.js project with all dependencies
1. Set up the folder structure
1. Initialize SQLite database
1. Create the Zustand store
1. Build each step component
1. Create the API routes
1. Wire everything together
1. Test the full flow

My Anthropic API key is in .env.local as ANTHROPIC_API_KEY.

Build this app now. Start by creating the project and installing dependencies, then build each component step by step. Ask me if you need clarification on anything.