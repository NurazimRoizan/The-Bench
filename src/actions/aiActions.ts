'use server';

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

export async function generateIdeaFromText(prompt: string) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const { object } = await generateObject({
    model: google('gemini-2.5-flash'),
    schema: z.object({
      name: z.string().describe('The name of the project. Invent a cool one if not provided.'),
      category: z.string().describe('The category of the project e.g. SaaS, App, Tool, etc.'),
      concept: z.string().describe('A clear 1-3 sentence concept of what the idea is.'),
      targetAudience: z.string().describe('The target audience or ideal user.'),
      status: z.enum(['Idea', 'In Progress', 'Shipped', 'Paused']).describe('The current status of the project, default to Idea.'),
      techStack: z.array(z.string()).describe('The technologies to be used. Max 5.'),
      features: z.array(z.string()).describe('Core features to be built. Max 5.'),
      monetization: z.string().describe('How the project plans to make money. Keep it short.'),
      competitors: z.array(z.string()).describe('Known or similar competitors in the market. Max 3.'),
      tasks: z.array(z.string()).describe('A list of immediate tasks or todos. Max 5.'),
    }),
    prompt: `Analyze the following brain dump of an app idea and extract or infer the structured details required to populate a project tracker database:\n\n${prompt}`,
  });

  // We convert arrays to comma separated strings to match the ProjectModal local state
  return {
    ...object,
    techStack: object.techStack.join(', '),
    features: object.features.join(', '),
    competitors: object.competitors.join(', '),
    tasks: object.tasks.join(', '),
  };
}
