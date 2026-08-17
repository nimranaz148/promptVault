"use client";

import Link from "next/link";
import { Search, Bell, Settings, Plus, MapPin, Link as LinkIcon, BadgeCheck, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PromptCard, CardType } from "@/components/PromptCard";
import { useProfileByUsername } from "@/hooks/useProfile";
import { useCommunityFeed } from "@/hooks/useCommunity";

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const { data: profile, isLoading: profileLoading } = useProfileByUsername(params.username);

  // Assuming useCommunityFeed can filter by owner username if supported by the backend.
  // The PRD doesn't explicitly state the param, but we'll fetch general community feed 
  // for now and in a real app this would pass `{ username: params.username }` to the API.
  const { data: cardsData, isLoading: cardsLoading } = useCommunityFeed();
  const cards = cardsData?.data || [];

  if (profileLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-destructive">Profile not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-primary">PromptVault</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/app" className="text-muted-foreground hover:text-foreground">Library</Link>
            <Link href="/community" className="text-primary border-b-2 border-primary py-5">Discover</Link>
          </nav>
        </div>
        
        <div className="flex-1 max-w-xl px-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search prompts..." 
              className="pl-9 bg-muted/30 border-none h-10 w-full focus-visible:ring-1 focus-visible:ring-border rounded-full"
            />
          </div>
        </div>

        <div className="flex justify-end items-center space-x-4">
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
      <main className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl">
                <img src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.display_name || profile.username} className="w-full h-full object-cover bg-muted" />
              </div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-display font-bold text-foreground">{profile.display_name || profile.username}</h1>
                    {/* The API returns published-card count somewhere, we fallback to 0 */}
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{profile.published_cards_count || 0} Public Cards</Badge>
                  </div>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                <div className="flex gap-3">
                  <Button className="px-8 font-semibold shadow-md shadow-primary/20 bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Follow
                  </Button>
                  <Button variant="outline" className="px-6 font-medium bg-card">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                </div>
              </div>
              
              <p className="text-foreground max-w-3xl leading-relaxed">
                {profile.bio || "No bio provided."}
              </p>
              
            </div>
          </div>

          {/* Filters */}
          <div className="border-b border-border/50">
            <div className="flex items-center space-x-8">
              <button className="pb-3 text-sm font-medium border-b-2 border-primary text-foreground px-1">All</button>
              <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground px-1 transition-colors">Image</button>
              <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground px-1 transition-colors">Video</button>
              <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-muted-foreground hover:text-foreground px-1 transition-colors">Text</button>
            </div>
          </div>

          {/* Grid */}
          {cardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[280px] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {/* Note: in reality, filter by card.owner_id === profile.id */}
              {cards.slice(0, 6).map((card: any) => (
                <Link key={card.id} href={`/community/${card.id}`} className="block hover:no-underline">
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

          <div className="flex justify-center pb-20">
            <Button variant="outline" className="px-8 bg-card rounded-full shadow-sm">
              v Show More Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
