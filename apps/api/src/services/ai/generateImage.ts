import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';

/**
 * Swappable image-generation abstraction (PRD Section 3.5).
 * Returns raw image bytes — the caller (generation.service.ts) uploads
 * them to Supabase Storage so results don't depend on a provider's
 * temporary URL staying alive.
 */
export async function generateImage(prompt: string): Promise<Buffer> {
  switch (env.imageGenProvider) {
    case 'pollinations':
      return generateWithPollinations(prompt);
    case 'huggingface':
      return generateWithHuggingFace(prompt);
    default:
      throw AppError.badRequest(`Unsupported IMAGE_GEN_PROVIDER: ${env.imageGenProvider}`);
  }
}

/** Pollinations.ai — free, no API key required (PRD default for MVP). */
async function generateWithPollinations(prompt: string): Promise<Buffer> {
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true`;

  const res = await fetch(url);
  if (!res.ok) {
    throw AppError.badRequest(`Pollinations image generation failed: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/** Hugging Face Inference API — free tier, rate-limited fallback. */
async function generateWithHuggingFace(prompt: string): Promise<Buffer> {
  if (!env.huggingfaceApiKey) {
    throw AppError.badRequest('HUGGINGFACE_API_KEY is not configured');
  }

  const res = await fetch(
    'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.huggingfaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!res.ok) {
    throw AppError.badRequest(`HuggingFace image generation failed: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
