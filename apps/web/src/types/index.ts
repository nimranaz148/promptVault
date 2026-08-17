// Shared frontend types — mirror apps/api/src/types/index.ts (PRD Sections 3.6 & 8).

export type CardType = "image" | "video" | "text";

export type CardMode = "save_only" | "run_in_app";

export type ResultType = "image_url" | "text" | "video_script";

export const CARD_CATEGORIES = [
  "text_to_image",
  "bg_remove_change",
  "upscale_enhance",
  "style_transfer",
  "thumbnail",
  "text_to_video_script",
  "reel_script",
  "voiceover_script",
  "blog_post",
  "social_caption",
  "ad_copy",
  "code_explain",
  "seo_content",
] as const;

export type CardCategory = (typeof CARD_CATEGORIES)[number];

/** Display metadata for each category (PRD Section 3.6). */
export const CATEGORY_META: Record<
  string,
  { label: string; type: CardType }
> = {
  text_to_image: { label: "Text-to-Image Generation", type: "image" },
  bg_remove_change: { label: "Background Remove/Change", type: "image" },
  upscale_enhance: { label: "Quality Enhance / Upscale", type: "image" },
  style_transfer: { label: "Style Transfer", type: "image" },
  thumbnail: { label: "Thumbnail Generator", type: "image" },
  text_to_video_script: { label: "Text-to-Video Script", type: "video" },
  reel_script: { label: "Short-form Reel/TikTok Script", type: "video" },
  voiceover_script: { label: "Voiceover/Narration Script", type: "video" },
  blog_post: { label: "Blog Post Writing", type: "text" },
  social_caption: { label: "Social Media Captions", type: "text" },
  ad_copy: { label: "Ad/Marketing Copy", type: "text" },
  code_explain: { label: "Code Generation / Explain Code", type: "text" },
  seo_content: { label: "SEO Content Writing", type: "text" },
};

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

export interface Paginated<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface CreateCardInput {
  type: CardType;
  category: string;
  title: string;
  prompt_body: string;
  variables?: PromptVariable[];
  mode?: CardMode;
  ai_provider?: string | null;
  tags?: string[];
  is_public?: boolean;
  folder_id?: string | null;
}

export type UpdateCardInput = Partial<CreateCardInput>;

export interface RunCardInput {
  values: Record<string, string>;
}
