import { NextResponse } from 'next/server';
import { getProjects, createProject, deleteProject } from '@/lib/db';

export async function GET() {
  try {
    const projects = getProjects();

    // Transform to frontend format
    const formattedProjects = projects.map((p) => ({
      id: p.id,
      name: p.name,
      projectType: p.project_type,
      status: p.status,
      originalIdea: p.original_idea,
      optimizedData: p.optimized_data ? JSON.parse(p.optimized_data) : null,
      workflowData: p.workflow_data ? JSON.parse(p.workflow_data) : null,
      schemaData: p.schema_data ? JSON.parse(p.schema_data) : null,
      devEnvironment: p.dev_environment,
      databaseType: p.database_type,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.id || !data.name || !data.originalIdea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    createProject({
      id: data.id,
      name: data.name,
      projectType: data.projectType || 'personal',
      originalIdea: data.originalIdea,
      optimizedData: data.optimizedData ? JSON.stringify(data.optimizedData) : undefined,
      workflowData: data.workflowData ? JSON.stringify(data.workflowData) : undefined,
      schemaData: data.schemaData ? JSON.stringify(data.schemaData) : undefined,
      devEnvironment: data.devEnvironment,
      databaseType: data.databaseType,
      status: data.status || 'draft',
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    deleteProject(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
