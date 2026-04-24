import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { rateLimit } from '@/lib/rate-limit';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Basic IP extraction (works for local and typical Vercel deployments)
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success, limit, remaining, reset } = rateLimit(ip, 5, 60000); // 5 requests per minute

    if (!success) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute before trying again.' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      });
    }

    const { messages } = await req.json();

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system:
        "You are a neutral, expert election assistant. Your goal is to provide accurate, non-partisan information about voting processes, timelines, and registration based on official data. If you are unsure, direct the user to their local Secretary of State website.",
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[API Chat] Error processing chat request', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat response. Ensure OPENAI_API_KEY is configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

