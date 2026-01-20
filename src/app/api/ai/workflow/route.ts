import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { optimizedData, projectType } = await request.json();

    if (!optimizedData) {
      return NextResponse.json({ error: 'Optimized data is required' }, { status: 400 });
    }

    const systemPrompt = projectType === 'personal'
      ? `You are an expert at designing workflow pipelines for personal development tools.
         Create simple, direct workflows without complex branching.
         Focus on core functionality without authentication or payment flows.`
      : `You are an expert at designing workflow pipelines for production applications.
         Include user authentication flows, data validation, error handling, and monitoring.
         Consider scalability and security in your pipeline designs.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Create workflow pipelines for this app in the following JSON format:
{
  "pipelines": [
    {
      "id": "pipeline-1",
      "name": "User Flow Name",
      "steps": [
        {
          "id": "step-1",
          "name": "Step Name",
          "type": "start|process|decision|end|database|api|user",
          "description": "What this step does"
        }
      ],
      "connections": [
        { "from": "step-1", "to": "step-2", "label": "optional label" }
      ]
    }
  ]
}

App: ${optimizedData.appName}
Description: ${optimizedData.description}
Features: ${optimizedData.features.join(', ')}

Create 2-3 key workflow pipelines (e.g., main user flow, data management, etc.)
Each pipeline should have 3-6 steps.
Return ONLY valid JSON, no markdown or explanation.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const workflowData = JSON.parse(content.text);
    return NextResponse.json(workflowData);
  } catch (error) {
    console.error('Error generating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to generate workflow' },
      { status: 500 }
    );
  }
}
