import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { optimizedData, workflowData, projectType, databaseType } = await request.json();

    if (!optimizedData || !databaseType) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }

    const typeMapping: Record<string, Record<string, string>> = {
      sqlite: {
        id: 'INTEGER',
        text: 'TEXT',
        datetime: 'TEXT',
        boolean: 'INTEGER',
        json: 'TEXT',
      },
      postgresql: {
        id: 'SERIAL',
        text: 'VARCHAR(255)',
        datetime: 'TIMESTAMP',
        boolean: 'BOOLEAN',
        json: 'JSONB',
      },
      mysql: {
        id: 'INT AUTO_INCREMENT',
        text: 'VARCHAR(255)',
        datetime: 'DATETIME',
        boolean: 'TINYINT(1)',
        json: 'JSON',
      },
    };

    const types = typeMapping[databaseType] || typeMapping.postgresql;

    const systemPrompt = projectType === 'personal'
      ? `You are a database architect designing schemas for personal tools.
         Keep it simple with minimal tables. No user authentication tables needed.
         Use ${databaseType.toUpperCase()} syntax.`
      : `You are a database architect designing schemas for production apps.
         Include user management, audit trails, and consider relationships.
         Use ${databaseType.toUpperCase()} syntax.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Design a database schema for this app in the following JSON format:
{
  "tables": [
    {
      "name": "table_name",
      "columns": [
        {
          "name": "column_name",
          "type": "${types.id}|${types.text}|${types.datetime}|${types.boolean}|${types.json}|etc",
          "constraints": ["PRIMARY KEY", "NOT NULL", "UNIQUE", "REFERENCES other_table(id)", etc.]
        }
      ]
    }
  ]
}

App: ${optimizedData.appName}
Description: ${optimizedData.description}
Features: ${optimizedData.features.join(', ')}
Database Type: ${databaseType.toUpperCase()}

${workflowData ? `Workflow Pipelines: ${JSON.stringify(workflowData.pipelines.map((p: { name: string }) => p.name))}` : ''}

Create appropriate tables with proper relationships. Use ${databaseType.toUpperCase()} data types.
Return ONLY valid JSON, no markdown or explanation.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const schemaData = JSON.parse(content.text);
    return NextResponse.json(schemaData);
  } catch (error) {
    console.error('Error generating schema:', error);
    return NextResponse.json(
      { error: 'Failed to generate schema' },
      { status: 500 }
    );
  }
}
