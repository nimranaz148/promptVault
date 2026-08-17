"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PromptCard, CardType } from "@/components/PromptCard";
import { Card } from "@/components/ui/card";
import { useCards, useDeleteCard, useDuplicateCard } from "@/hooks/useCards";
import { useSearchParams, useRouter } from "next/navigation";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

import { PromptCardSkeleton } from "@/components/PromptCardSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { LibraryBig } from "lucide-react";

const TABS = [
  { label: "All", value: "" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Text", value: "text" },
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get("type") || "";

  const { data: response, isLoading, error } = useCards(
    activeType ? { type: activeType } : {}
  );
  const cards = response?.data || [];

  const deleteMutation = useDeleteCard();
  const duplicateMutation = useDuplicateCard();
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);

  const setFilter = (type: string) => {
    if (type) {
      router.push(`/app?type=${type}`);
    } else {
      router.push("/app");
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteCardId) {
      try {
        await deleteMutation.mutateAsync(deleteCardId);
      } catch (err) {
        console.error("Failed to delete card:", err);
      } finally {
        setDeleteCardId(null);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    await duplicateMutation.mutateAsync(id);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Library</h1>
        <p className="text-muted-foreground mt-2">Organize and manage your creative prompt architecture.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-8 border-b border-border/60">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
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

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <PromptCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-destructive">Failed to load cards.</div>
      ) : cards.length === 0 ? (
        <EmptyState
          title={`No ${activeType || ""} prompts yet`}
          description="Your vault is looking a bit empty. Extract a prompt from the community or create your own."
          actionLabel="Create New Prompt"
          actionHref="/app/cards/new"
          icon={<LibraryBig className="w-10 h-10 opacity-80" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <Link 
              key={card.id} 
              href={`/app/cards/${card.id}`} 
              className="block h-full animate-in fade-in slide-in-from-bottom-4"
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
                cardId={card.id}
                onDelete={() => setDeleteCardId(card.id)}
                onDuplicate={() => handleDuplicate(card.id)}
              />
            </Link>
          ))}

          {/* Create New Prompt */}
          <Link href="/app/cards/new" className="block h-full">
            <Card className="h-full min-h-[280px] flex flex-col items-center justify-center border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-muted/30 transition-colors group cursor-pointer bg-transparent">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Create New Prompt
              </span>
            </Card>
          </Link>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteCardId}
        onClose={() => setDeleteCardId(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
