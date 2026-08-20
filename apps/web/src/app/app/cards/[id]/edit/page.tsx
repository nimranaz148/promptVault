"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Video, FileText, Info, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCard, useUpdateCard } from "@/hooks/useCards";
import { useFolders } from "@/hooks/useFolders";

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.id as string;

  const { data: card, isLoading, isError } = useCard(cardId);
  const updateMutation = useUpdateCard(cardId);
  const { folders } = useFolders();

  const [type, setType] = useState<"image" | "video" | "text">("image");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("text_to_image");
  const [folderId, setFolderId] = useState<string>("");
  const [promptBody, setPromptBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [runInApp, setRunInApp] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (card) {
      setType(card.type || "image");
      setTitle(card.title || "");
      setCategory(card.category || "text_to_image");
      setFolderId(card.folder_id || "");
      setPromptBody(card.prompt_body || "");
      setTags(card.tags || []);
      setRunInApp(card.mode === "run_in_app");
      setIsPublic(card.is_public || false);
    }
  }, [card]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const formatted = tagInput.trim().toUpperCase();
      if (!tags.includes(formatted)) {
        setTags([...tags, formatted]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async () => {
    if (!title || !promptBody || !category) {
      alert("Please fill in all required fields (Title, Category, Prompt Template)");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        title,
        type,
        category,
        prompt_body: promptBody,
        tags,
        mode: runInApp ? "run_in_app" : "save_only",
        is_public: isPublic,
        folder_id: folderId || null,
      });
      router.push(`/app/cards/${cardId}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update prompt card.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !card) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-destructive">Card Not Found</h2>
        <p className="text-muted-foreground">The prompt card you are trying to edit does not exist or you do not have permission.</p>
        <Button asChild variant="outline">
          <Link href="/app">Back to My Library</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto p-8 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Edit Prompt Card</h1>
              <p className="text-muted-foreground mt-2">Update your prompt template and card settings.</p>
            </div>
            <Button asChild variant="outline" size="sm" className="bg-card">
              <Link href={`/app/cards/${cardId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Card Detail
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Prompt Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType("image")}
                className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                  type === "image" ? "border-orange-500 bg-orange-500/5 ring-4 ring-orange-500/10" : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === "image" ? "bg-orange-500/20 text-orange-600 dark:text-orange-400" : "bg-muted text-muted-foreground"}`}>
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold ${type === "image" ? "text-orange-600 dark:text-orange-400" : ""}`}>Image</h3>
                  <p className="text-xs text-muted-foreground mt-1">Stable Diffusion, Pollinations</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("video")}
                className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                  type === "video" ? "border-red-500 bg-red-500/5 ring-4 ring-red-500/10" : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === "video" ? "bg-red-500/20 text-red-600 dark:text-red-400" : "bg-muted text-muted-foreground"}`}>
                  <Video className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold ${type === "video" ? "text-red-600 dark:text-red-400" : ""}`}>Video</h3>
                  <p className="text-xs text-muted-foreground mt-1">Runway, Kling, Short Scripts</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setType("text")}
                className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                  type === "text" ? "border-blue-500 bg-blue-500/5 ring-4 ring-blue-500/10" : "border-border bg-card hover:border-border/80"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${type === "text" ? "bg-blue-500/20 text-blue-600 dark:text-blue-400" : "bg-muted text-muted-foreground"}`}>
                  <FileText className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold ${type === "text" ? "text-blue-600 dark:text-blue-400" : ""}`}>Text</h3>
                  <p className="text-xs text-muted-foreground mt-1">GPT-4, Claude 3, Llama</p>
                </div>
              </button>
            </div>
          </div>

          <Card className="p-8 space-y-8 bg-card shadow-sm border-border/60">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cinematic Portrait Engine"
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  <option value="text_to_image">Text-to-Image Generation</option>
                  <option value="bg_remove_change">Background Remove/Change</option>
                  <option value="upscale_enhance">Quality Enhance / Upscale</option>
                  <option value="style_transfer">Style Transfer</option>
                  <option value="thumbnail">Thumbnail Generator</option>
                  <option value="text_to_video_script">Text-to-Video Script</option>
                  <option value="reel_script">Short-form Reel/TikTok Script</option>
                  <option value="voiceover_script">Voiceover/Narration Script</option>
                  <option value="blog_post">Blog Post Writing</option>
                  <option value="social_caption">Social Media Captions</option>
                  <option value="ad_copy">Ad/Marketing Copy</option>
                  <option value="code_explain">Code Generation / Explain Code</option>
                  <option value="seo_content">SEO Content Writing</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Folder</Label>
                <select 
                  id="folder" 
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                >
                  <option value="">(No Folder)</option>
                  {folders?.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt Template</Label>
              <div className="rounded-xl border border-border/60 bg-muted/20 p-1 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
                <Textarea
                  id="template"
                  value={promptBody}
                  onChange={(e) => setPromptBody(e.target.value)}
                  placeholder="Enter prompt here... Use {{variable}} for dynamic placeholders."
                  className="min-h-[150px] border-none bg-transparent resize-y focus-visible:ring-0 shadow-none text-base font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search Tags</Label>
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg border border-border/60 bg-muted/30 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent min-h-12">
                {tags.map((tag) => (
                  <Badge key={tag} className="gap-1 bg-primary/90 text-primary-foreground hover:bg-primary py-1 px-2 text-xs font-medium">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-primary-foreground/70">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  id="tags"
                  type="text"
                  placeholder="Add tag... (press Enter)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="flex-1 min-w-[120px] bg-transparent border-none focus:outline-none text-sm px-2 py-1"
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <Save className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">App Mode</h4>
                    <p className="text-sm text-muted-foreground">Switch between &quot;Save only&quot; and &quot;Run in app&quot; workflow.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRunInApp(!runInApp)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${runInApp ? 'bg-primary' : 'bg-muted-foreground'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${runInApp ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Public Sharing</h4>
                    <p className="text-sm text-muted-foreground">Allow other PromptVault users to discover and save this prompt.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isPublic ? 'bg-primary' : 'bg-muted-foreground'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky Bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur-sm p-4 px-8 flex items-center justify-between z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="flex items-center text-sm text-muted-foreground gap-2">
          <Info className="w-4 h-4" />
          <span>Editing Card ID: {cardId}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" className="px-6 font-medium bg-card">
            <Link href={`/app/cards/${cardId}`}>Cancel</Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="px-8 font-semibold shadow-sm gap-2"
          >
            <Save className="w-4 h-4" /> {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

