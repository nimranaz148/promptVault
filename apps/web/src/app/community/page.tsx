"use client";

import Link from "next/link";
import { Search, Bell, Settings, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptCard, CardType } from "@/components/PromptCard";
import { useCommunityFeed } from "@/hooks/useCommunity";
import { useState, useMemo } from "react";
import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";

const TYPE_TABS = [
  { label: "All", value: "" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Text", value: "text" },
];

const CATEGORY_CHIPS = [
  { label: "All Categories", value: "" },
  { label: "Text-to-Image", value: "text_to_image" },
  { label: "Thumbnail Generator", value: "thumbnail" },
  { label: "Style Transfer", value: "style_transfer" },
  { label: "Background Swap", value: "bg_remove_change" },
  { label: "Quality Upscale", value: "upscale_enhance" },
  { label: "Video Script", value: "text_to_video_script" },
  { label: "Reel Script", value: "reel_script" },
  { label: "Voiceover Script", value: "voiceover_script" },
  { label: "Blog Post", value: "blog_post" },
  { label: "Social Caption", value: "social_caption" },
  { label: "Ad Copy", value: "ad_copy" },
  { label: "Code Explain", value: "code_explain" },
  { label: "SEO Content", value: "seo_content" },
];

const TYPE_CATEGORIES: Record<string, string[]> = {
  image: ["text_to_image", "thumbnail", "style_transfer", "bg_remove_change", "upscale_enhance"],
  video: ["text_to_video_script", "reel_script", "voiceover_script"],
  text: ["blog_post", "social_caption", "ad_copy", "code_explain", "seo_content"],
};

export default function CommunityFeedPage() {
  const [activeType, setActiveType] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data: response, isLoading, error } = useCommunityFeed({
    type: activeType || undefined,
    category: activeCategory || undefined,
    search: search || undefined,
  });

  const cards = response?.data || [];

  const handleTypeChange = (val: string) => {
    setActiveType(val);
    setActiveCategory(""); // reset category when type changes
  };

  const visibleCategories = useMemo(() => {
    if (!activeType) return CATEGORY_CHIPS;
    const allowed = TYPE_CATEGORIES[activeType] || [];
    return CATEGORY_CHIPS.filter((c) => c.value === "" || allowed.includes(c.value));
  }, [activeType]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setSearch(searchInput);
  };

  const hasActiveFilters = activeType || activeCategory || search;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="w-48 shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-primary">PromptVault</span>
          </Link>
        </div>

        <div className="flex-1 max-w-2xl px-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search community prompts... (press Enter)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="pl-9 bg-muted/30 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-border rounded-full"
            />
          </div>
        </div>

        <div className="w-48 shrink-0 flex justify-end items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => toast.info("No new notifications yet.")}
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </Button>
          <Link href="/app">
            <div className="w-8 h-8 rounded-full bg-primary/20 overflow-hidden cursor-pointer border border-border">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Filters */}
          <div className="space-y-4 border-b border-border/50 pb-4">

            {/* Type Tabs - All / Image / Video / Text */}
            <div className="flex items-center space-x-8">
              {TYPE_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTypeChange(tab.value)}
                  className={`pb-3 text-sm font-medium border-b-2 px-1 transition-colors ${
                    activeType === tab.value
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setActiveCategory(chip.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === chip.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border/60 hover:bg-muted"
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span>Filtering by:</span>
              {activeType && <Badge variant="secondary" className="capitalize">{activeType}</Badge>}
              {activeCategory && (
                <Badge variant="secondary">
                  {CATEGORY_CHIPS.find((c) => c.value === activeCategory)?.label}
                </Badge>
              )}
              {search && <Badge variant="secondary">&quot;{search}&quot;</Badge>}
              <button
                onClick={() => {
                  setActiveType("");
                  setActiveCategory("");
                  setSearch("");
                  setSearchInput("");
                }}
                className="text-primary hover:underline text-xs ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 pb-20">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <PromptCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-destructive">Failed to load community feed.</div>
          ) : cards.length === 0 ? (
            <EmptyState
              title="No prompts found"
              description="Try adjusting your filters or search query to find what you are looking for."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 pb-20">
              {cards.map((card, idx) => (
                <Link 
                  key={card.id} 
                  href={`/community/${card.id}`} 
                  className="block hover:no-underline animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: "both" }}
                >
                  <PromptCard
                    type={card.type as CardType}
                    title={card.title}
                    preview={card.prompt_body}
                    tags={card.tags || []}
                    likes={card.like_count || 0}
                    runs={0}
                    isRunInApp={card.mode === "run_in_app"}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* FAB */}
      <Link href="/app/cards/new">
        <Button size="icon" className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform z-50">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}





