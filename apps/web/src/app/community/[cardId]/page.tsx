"use client";

import Link from "next/link";
import { ArrowLeft, Bookmark, Share2, Heart, Search, Bell, Settings, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useCommunityCard, useLikeCard, useUnlikeCard } from "@/hooks/useCommunity";
import { useSaveToLibrary } from "@/hooks/useCards";
import { useAuth } from "@/hooks/useAuth";

export default function CommunityCardDetailPage({ params }: { params: { cardId: string } }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { data: card, isLoading, error } = useCommunityCard(params.cardId);

  const likeMutation = useLikeCard(card);
  const unlikeMutation = useUnlikeCard(card);
  const saveMutation = useSaveToLibrary();

  const requireLogin = () => {
    if (!user) {
      router.push(`/login?next=/community/${params.cardId}`);
      return false;
    }
    return true;
  };

  const handleLikeToggle = async () => {
    if (!card || !requireLogin()) return;
    await likeMutation.mutateAsync(card.id);
  };

  const handleSaveToLibrary = async () => {
    if (!card || !requireLogin()) return;
    await saveMutation.mutateAsync(card.id);
    alert("Saved to your library!");
  };

  if (isLoading) {
    return <div className="min-h-screen p-8 text-center text-muted-foreground flex items-center justify-center">Loading community card...</div>;
  }

  if (error || !card) {
    return <div className="min-h-screen p-8 text-center text-destructive flex items-center justify-center">Failed to load card.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="w-48 shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-primary">PromptVault</span>
          </Link>
        </div>
        
        <div className="flex-1 max-w-2xl px-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search community prompts..." 
              className="pl-9 bg-muted/30 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-border rounded-full"
            />
          </div>
        </div>

        <div className="w-48 shrink-0 flex justify-end items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-muted">
                <Link href="/community">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <Link href={`/profile/${card.owner_id}`} className="flex items-center space-x-3 group">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 bg-muted">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${card.owner_id}`} alt="Creator" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:underline">Creator Profile</p>
                  <p className="text-xs text-muted-foreground">Published recently</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                className="gap-2 bg-card font-medium text-red-500 border-red-500/20 hover:bg-red-500/10"
                onClick={handleLikeToggle}
                disabled={loading || likeMutation.isPending || unlikeMutation.isPending}
              >
                <Heart className="w-4 h-4 fill-current" /> {card.like_count || 0}
              </Button>
              <Button 
                variant="default" 
                className="gap-2 font-medium"
                onClick={handleSaveToLibrary}
                disabled={loading || saveMutation.isPending}
              >
                <Bookmark className="w-4 h-4" /> Save to Library
              </Button>
              <Button variant="outline" size="icon" className="bg-card">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card className="p-8 shadow-md border-border/50 space-y-8 bg-card relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${card.type === 'image' ? 'bg-orange-500' : card.type === 'video' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-3">{card.title}</h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`border-transparent gap-1 uppercase tracking-wider text-[10px] ${
                  card.type === "image" ? "bg-orange-500/10 text-orange-600" : 
                  card.type === "video" ? "bg-red-500/10 text-red-600" : 
                  "bg-blue-500/10 text-blue-600"
                }`}>
                  {card.type === "image" && <ImageIcon className="w-3 h-3" />}
                  {card.type === "video" && <Video className="w-3 h-3" />}
                  {card.type === "text" && <FileText className="w-3 h-3" />}
                  {card.category}
                </Badge>
              </div>
            </div>

            {/* Prompt Template */}
            <div className="bg-muted/30 border border-border/60 rounded-xl p-6">
              <p className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {card.prompt_body}
              </p>
            </div>

            <div className="bg-primary/10 text-primary rounded-lg p-4 flex items-center justify-between border border-primary/20 mt-4">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                <span className="text-sm font-medium">Save this prompt to your library to edit variables and run it.</span>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
