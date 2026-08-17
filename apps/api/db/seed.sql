-- PromptVault seed data — PRD Section 3.7
-- Creates a reserved "system" auth user + profile, then inserts one public
-- starter card per category so the library/community feed is never empty
-- on first launch.
--
-- IMPORTANT: run schema.sql first. This script assumes a system user has
-- already been created via Supabase Auth (e.g. through the dashboard or
-- `supabase.auth.admin.createUser`) — replace SYSTEM_USER_ID below with
-- that user's real UUID before running.

-- 1. System profile (id must match an existing auth.users row)
insert into profiles (id, username, display_name, bio)
values (
  'REPLACE_WITH_SYSTEM_USER_UUID',
  'promptvault',
  'PromptVault',
  'Official starter prompts — save one to your library to get started!'
)
on conflict (id) do nothing;

-- 2. Thirteen starter cards, one per category (PRD Section 3.7 table)
insert into prompt_cards
  (owner_id, type, category, title, prompt_body, variables, mode, ai_provider, tags, is_public)
values
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'image', 'text_to_image', 'Cinematic Portrait',
    'A cinematic portrait of {{subject}}, {{lighting}} lighting, shot on {{camera}}, ultra-detailed, 8k',
    '[{"key":"subject","label":"Subject","default":"a young woman"},{"key":"lighting","label":"Lighting","default":"golden hour"},{"key":"camera","label":"Camera","default":"85mm lens"}]',
    'run_in_app', 'pollinations', array['portrait','cinematic'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'image', 'bg_remove_change', 'Studio Background Swap',
    'Remove the background from this image and replace it with a {{background_style}} background, keep lighting on {{subject}} consistent',
    '[{"key":"background_style","label":"Background Style","default":"white studio"},{"key":"subject","label":"Subject","default":"the product"}]',
    'save_only', null, array['background','editing'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'image', 'upscale_enhance', '4K Upscale & Sharpen',
    'Upscale this image to {{resolution}}, enhance sharpness and detail, remove noise/blur, preserve original colors',
    '[{"key":"resolution","label":"Target Resolution","default":"4K"}]',
    'save_only', null, array['upscale','quality'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'image', 'style_transfer', 'Style Convert',
    'Convert this photo into {{art_style}} style artwork, keep facial features recognizable',
    '[{"key":"art_style","label":"Art Style","default":"anime"}]',
    'run_in_app', 'pollinations', array['style','art'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'image', 'thumbnail', 'YouTube Thumbnail',
    'Create a bold YouTube thumbnail for a video about {{topic}}, bright colors, large readable text saying ''{{text_overlay}}'', high-CTR style',
    '[{"key":"topic","label":"Video Topic","default":"5 productivity tips"},{"key":"text_overlay","label":"Overlay Text","default":"DO THIS NOW"}]',
    'run_in_app', 'pollinations', array['youtube','thumbnail'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'video', 'text_to_video_script', 'Product Demo Script',
    'Write a 30-second video script promoting {{product}} for {{platform}}, strong hook in the first 3 seconds, end with a call to action',
    '[{"key":"product","label":"Product","default":"a productivity app"},{"key":"platform","label":"Platform","default":"Instagram Reels"}]',
    'run_in_app', 'openai', array['video','marketing'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'video', 'reel_script', 'Viral Hook Reel Script',
    'Write a short-form video script about {{topic}} in a {{tone}} tone, strong opening hook, under 30 seconds runtime',
    '[{"key":"topic","label":"Topic","default":"morning routines"},{"key":"tone","label":"Tone","default":"energetic"}]',
    'run_in_app', 'openai', array['reels','tiktok'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'video', 'voiceover_script', 'Calm Narration Script',
    'Write a calm narration voiceover script explaining {{topic}} for a {{duration}}-second video, simple everyday language',
    '[{"key":"topic","label":"Topic","default":"how compound interest works"},{"key":"duration","label":"Duration (seconds)","default":"60"}]',
    'run_in_app', 'openai', array['voiceover','narration'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'text', 'blog_post', 'SEO Blog Post',
    'Write a {{word_count}}-word blog post about {{topic}} targeting the keyword ''{{keyword}}'', with an intro, 3 subheadings, and a conclusion',
    '[{"key":"word_count","label":"Word Count","default":"800"},{"key":"topic","label":"Topic","default":"remote work productivity"},{"key":"keyword","label":"Target Keyword","default":"remote work tips"}]',
    'run_in_app', 'openai', array['blog','seo'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'text', 'social_caption', 'Instagram Caption Generator',
    'Write 3 Instagram captions for a post about {{topic}} in a {{tone}} tone, include relevant hashtags',
    '[{"key":"topic","label":"Post Topic","default":"a coffee shop opening"},{"key":"tone","label":"Tone","default":"fun and casual"}]',
    'run_in_app', 'openai', array['instagram','captions'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'text', 'ad_copy', 'Facebook Ad Copy',
    'Write a short Facebook ad for {{product}} targeting {{audience}}, highlight the main benefit, end with a clear CTA',
    '[{"key":"product","label":"Product","default":"an online course"},{"key":"audience","label":"Target Audience","default":"working professionals"}]',
    'run_in_app', 'openai', array['ads','marketing'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'text', 'code_explain', 'Code Explainer',
    'Explain what this code does in simple terms and point out potential bugs: {{code_snippet}}',
    '[{"key":"code_snippet","label":"Code Snippet","default":"function add(a, b) { return a + b }"}]',
    'run_in_app', 'openai', array['code','developer'], true
  ),
  (
    'REPLACE_WITH_SYSTEM_USER_UUID', 'text', 'seo_content', 'Meta Description Writer',
    'Write an SEO meta description (max 155 characters) for a page about {{topic}} targeting the keyword ''{{keyword}}''',
    '[{"key":"topic","label":"Page Topic","default":"a bakery''s homepage"},{"key":"keyword","label":"Target Keyword","default":"fresh sourdough bread"}]',
    'run_in_app', 'openai', array['seo','meta'], true
  );
