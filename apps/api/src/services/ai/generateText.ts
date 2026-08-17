import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

/**
 * Swappable text-generation abstraction (PRD Section 3.5).
 * Callers (generation.service.ts) never know or care which provider
 * is behind this — switching TEXT_AI_PROVIDER in .env is enough.
 */
export async function generateText(prompt: string): Promise<string> {
  switch (env.textAiProvider) {
    case 'openai':
      return generateWithOpenAI(prompt);
    case 'gemini':
      return generateWithGemini(prompt);
    case 'anthropic':
      return generateWithAnthropic(prompt);
    default:
      throw AppError.badRequest(`Unsupported TEXT_AI_PROVIDER: ${env.textAiProvider}`);
  }
}

async function generateWithOpenAI(prompt: string): Promise<string> {
  if (!env.openaiApiKey) throw AppError.badRequest('OPENAI_API_KEY is not configured');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    throw AppError.badRequest(`OpenAI generation failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content?.trim() ?? '';
}

async function generateWithGemini(prompt: string): Promise<string> {
  if (!env.geminiApiKey) throw AppError.badRequest('GEMINI_API_KEY is not configured');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${env.geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    throw AppError.badRequest(`Gemini generation failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
  };
  return data.candidates[0]?.content?.parts[0]?.text?.trim() ?? '';
}

async function generateWithAnthropic(prompt: string): Promise<string> {
  if (!env.anthropicApiKey) throw AppError.badRequest('ANTHROPIC_API_KEY is not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.anthropicApiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    throw AppError.badRequest(`Anthropic generation failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as { content: { type: string; text?: string }[] };
  return data.content.find((b) => b.type === 'text')?.text?.trim() ?? '';
}
