import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',

  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceRoleKey: required('SUPABASE_SERVICE_ROLE_KEY'),
  supabaseJwtSecret: required('SUPABASE_JWT_SECRET'),

  corsAllowedOrigins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim()),

  textAiProvider: process.env.TEXT_AI_PROVIDER || 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,

  imageGenProvider: process.env.IMAGE_GEN_PROVIDER || 'pollinations',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY,

  avatarsBucket: process.env.AVATARS_BUCKET || 'avatars',
  generatedImagesBucket: process.env.GENERATED_IMAGES_BUCKET || 'generated-images',
};
