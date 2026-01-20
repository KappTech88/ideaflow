import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { idea, projectType } = await request.json();

    if (!idea) {
      return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
    }

    const systemPrompt = projectType === 'personal'
      ? `You are an expert at converting app ideas into structured concepts for personal tools.
         Focus on simplicity, minimal dependencies, no authentication, and quick implementation.
         Recommend SQLite for storage. Keep features practical and achievable.`
      : `You are an expert at converting app ideas into structured concepts for public applications.
         Consider user authentication, database scalability, potential monetization, and analytics.
         Recommend PostgreSQL for storage. Include features for user management and growth.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Convert this app idea into a structured concept with the following JSON format:
{
  "appName": "CamelCase name for the app",
  "tagline": "Short catchy tagline (under 10 words)",
  "description": "2-3 sentence description of what the app does",
  "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
}

App idea: ${idea}

Return ONLY valid JSON, no markdown or explanation.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    const optimizedData = JSON.parse(content.text);
    return NextResponse.json(optimizedData);
  } catch (error) {
    console.error('Error optimizing idea:', error);
    return NextResponse.json(
      { error: 'Failed to optimize idea' },
      { status: 500 }
    );
  }
}
