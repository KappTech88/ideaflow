# FlowForge Pro

AI-powered workflow generator for developers. Transform your app ideas into structured development plans, visual workflows, and database schemas.

## Features

- **8-Step Wizard** - Guided process from idea to exportable project plan
- **Project Types** - Choose between Personal Tool (simple, local) or Public App (production-ready)
- **AI-Powered Refinement** - Claude AI optimizes your idea into a structured concept
- **Visual Workflow Editor** - Interactive pipeline visualization with React Flow
- **Database Schema Generator** - Auto-generate schemas for SQLite, PostgreSQL, or MySQL
- **Multiple Export Formats** - Download as Markdown, N8N, ComfyUI, or SQL
- **Project History** - Save and revisit previous projects locally

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** SQLite via better-sqlite3
- **State Management:** Zustand
- **Workflow Visualization:** React Flow
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Anthropic API key

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Anthropic API key to .env.local
# ANTHROPIC_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Type** - Select Personal Tool or Public App
2. **Idea** - Describe your app idea in plain text
3. **Refine** - Review AI-optimized concept (name, tagline, features)
4. **Workflow** - Visualize and edit generated workflow pipelines
5. **Database** - Choose your database type
6. **Schema** - Review and customize generated database schema
7. **Dev Setup** - Select your preferred AI coding environment
8. **Export** - Download project files in multiple formats

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/optimize` | POST | Optimize idea into structured concept |
| `/api/ai/workflow` | POST | Generate workflow pipelines |
| `/api/ai/schema` | POST | Generate database schema |
| `/api/projects` | GET | Retrieve saved projects |
| `/api/projects` | POST | Save a new project |

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Main page
│   ├── components/
│   │   ├── ui/            # shadcn/ui components
│   │   ├── TypeSelector.tsx
│   │   ├── IdeaInput.tsx
│   │   ├── RefinedConcept.tsx
│   │   ├── WorkflowCanvas.tsx
│   │   ├── DatabaseSelector.tsx
│   │   ├── SchemaEditor.tsx
│   │   ├── DevEnvSelector.tsx
│   │   └── ExportPanel.tsx
│   ├── lib/
│   │   ├── db.ts          # SQLite database
│   │   └── utils.ts       # Utility functions
│   ├── store/
│   │   └── useAppStore.ts # Zustand store
│   └── types/
│       └── index.ts       # TypeScript types
├── data/                  # SQLite database storage
├── public/                # Static assets
└── package.json
```

## Export Formats

- **Markdown** - Complete dev plan with quick-start prompts
- **N8N JSON** - Import into N8N automation platform
- **ComfyUI JSON** - Node-based workflow format
- **SQL** - CREATE TABLE statements for your schema

## License

MIT
