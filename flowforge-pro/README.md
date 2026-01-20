# FlowForge Pro

An AI-powered workflow generator for developers that helps you design and export complete project specifications.

## Features

- 🎨 **8-Step Workflow Builder**: From idea to export
- 🤖 **AI-Powered Optimization**: Uses Claude Sonnet 4 to refine ideas
- 📊 **Visual Workflow Canvas**: Interactive workflow visualization with React Flow
- 🗄️ **Database Schema Generator**: Auto-generates database schemas for SQLite, PostgreSQL, and MySQL
- 📦 **Multiple Export Formats**: Markdown, N8N JSON, ComfyUI JSON, and SQL
- 💾 **Project History**: Saves completed projects locally with SQLite

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **State Management**: Zustand
- **Database**: SQLite via better-sqlite3
- **AI**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Workflow Visualization**: React Flow (@xyflow/react)
- **Icons**: Lucide React
- **TypeScript**: Full type safety with strict mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flowforge-pro
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:
```
ANTHROPIC_API_KEY=your-api-key-here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
flowforge-pro/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   │   ├── ai/       # AI-powered endpoints
│   │   │   └── projects/ # Project CRUD operations
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Main application page
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── DatabaseSelector.tsx
│   │   ├── DevEnvSelector.tsx
│   │   ├── ExportPanel.tsx
│   │   ├── IdeaInput.tsx
│   │   ├── RefinedConcept.tsx
│   │   ├── SchemaEditor.tsx
│   │   ├── StepIndicator.tsx
│   │   ├── TypeSelector.tsx
│   │   └── WorkflowCanvas.tsx
│   ├── lib/              # Utility functions
│   │   ├── db.ts         # SQLite database operations
│   │   ├── schema-utils.ts # SQL generation utilities
│   │   └── utils.ts      # General utilities
│   ├── store/            # Zustand state management
│   │   └── useAppStore.ts
│   └── types/            # TypeScript type definitions
│       └── index.ts
├── data/                 # SQLite database storage
│   └── flowforge.db      # Auto-created on first run
├── public/               # Static assets
└── package.json
```

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production (with TypeScript checking)
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Code Optimizations (Recent Improvements)

### High Priority ✅
- **Extracted duplicate code**: Created `schema-utils.ts` for shared SQL generation logic
- **Enhanced error handling**: Implemented comprehensive error state management across all components
- **JSON validation**: Added validation for AI API responses to prevent runtime errors
- **Fixed database bug**: Corrected parameter ordering in `updateProject()` function
- **TypeScript integration**: Added type checking to build process
- **Code cleanup**: Removed unused imports and fixed ESLint warnings

### API Security
- Input validation on all endpoints
- Error responses properly structured
- JSON parsing with try-catch blocks

### Error Handling Flow
1. API routes validate input and catch errors
2. Errors are set in Zustand store via `setError()`
3. Main page displays error alert with dismiss button
4. User-friendly error messages throughout

### Database Layer
- Prepared statements for all queries
- Proper type definitions (TypeScript interfaces)
- CRUD operations: Create, Read, Update, Delete

## API Routes

### AI Endpoints

#### `POST /api/ai/optimize`
Optimizes raw app ideas into structured concepts.

**Request:**
```json
{
  "idea": "string",
  "projectType": "personal" | "public"
}
```

**Response:**
```json
{
  "appName": "string",
  "tagline": "string",
  "description": "string",
  "features": ["string"]
}
```

#### `POST /api/ai/workflow`
Generates workflow pipelines from optimized concepts.

**Request:**
```json
{
  "optimizedData": { /* OptimizedData */ },
  "projectType": "personal" | "public"
}
```

**Response:**
```json
{
  "pipelines": [
    {
      "name": "string",
      "steps": [{ "id": "string", "label": "string", "description": "string" }]
    }
  ]
}
```

#### `POST /api/ai/schema`
Generates database schema from workflow.

**Request:**
```json
{
  "optimizedData": { /* OptimizedData */ },
  "workflowData": { /* WorkflowData */ },
  "projectType": "personal" | "public",
  "databaseType": "sqlite" | "postgresql" | "mysql"
}
```

**Response:**
```json
{
  "tables": [
    {
      "name": "string",
      "columns": [
        {
          "name": "string",
          "type": "string",
          "constraints": ["string"]
        }
      ]
    }
  ]
}
```

### Project Endpoints

#### `GET /api/projects`
Retrieves all projects.

#### `POST /api/projects`
Creates a new project.

#### `DELETE /api/projects?id={id}`
Deletes a project by ID.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
ANTHROPIC_API_KEY=your-api-key-here
```

## Contributing

This is a local development tool. Contributions should focus on:
- Bug fixes
- Performance improvements
- New export formats
- Additional AI model support

## Known Limitations

- No authentication (by design - local tool)
- SQLite database stored locally in `/data` folder
- Requires Anthropic API key
- No real-time collaboration features

## Future Improvements

### Planned Features
- Database transaction support for multi-step updates
- Prepared statement reuse for better performance
- Enhanced ESLint rules
- Comprehensive test suite
- Loading states with progress indicators
- Project templates
- Export to additional formats (GitHub Actions, Docker Compose)

### Performance Optimizations
- Implement API response caching
- Add database query optimization
- Lazy loading for large projects

## License

[Add your license here]

## Support

For issues and questions, please open an issue on the GitHub repository.
