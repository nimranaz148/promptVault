// Shared types - mirrors PRD Section 8 (Database Schema) and Section 3.6 (Categories)

export type CardType = 'image' | 'video' | 'text';

export type CardMode = 'save_only' | 'run_in_app';

export type ResultType = 'image_url' | 'text' | 'video_script';

// PRD Section 3.6 - the 13 fixed MVP categories
export const CARD_CATEGORIES = [
  'text_to_image',
  'bg_remove_change',
  'upscale_enhance',
  'style_transfer',
  'thumbnail',
  'text_to_video_script',
  'reel_script',
  'voiceover_script',
  'blog_post',
  'social_caption',
  'ad_copy',
  'code_explain',
  'seo_content',
] as const;

export type CardCategory = (typeof CARD_CATEGORIES)[number];

export interface PromptVariable {
  key: string;
  label: string;
  default?: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  published_cards_count?: number;
}

export interface Folder {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface PromptCard {
  id: string;
  owner_id: string;
  type: CardType;
  category: CardCategory | string;
  title: string;
  prompt_body: string;
  variables: PromptVariable[];
  mode: CardMode;
  ai_provider: string | null;
  tags: string[];
  is_public: boolean;
  like_count: number;
  forked_from: string | null;
  folder_id?: string | null;
  created_at: string;
  updated_at: string;
  owner?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface CardRun {
  id: string;
  card_id: string;
  user_id: string;
  filled_prompt: string;
  result_type: ResultType;
  result_value: string;
  created_at: string;
}

// Augments Express's Request type with the authenticated user,
// set by middleware/auth.middleware.ts after verifying the Supabase JWT.
export interface AuthUser {
  id: string;
  email?: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}





