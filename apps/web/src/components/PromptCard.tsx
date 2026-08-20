"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart, Play, Copy, MoreVertical, Image as ImageIcon,
  Video, FileText, Zap, Trash2, CopyPlus, Check
} from "lucide-react";

export type CardType = "image" | "video" | "text";

export interface PromptCardProps {
  type: CardType;
  title: string;
  preview: string;
  tags: string[];
  likes: number;
  runs: number;
  imageUrl?: string;
  isRunInApp?: boolean;
  cardId?: string;
  onCopy?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  creatorUsername?: string;
  creatorAvatarUrl?: string | null;
}

import { toast } from "sonner";

export function PromptCard({
  type, title, preview, tags, likes, runs, imageUrl,
  isRunInApp, cardId, onCopy, onDelete, onDuplicate,
  creatorUsername, creatorAvatarUrl
}: PromptCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleCopyPrompt = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText(preview);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleMenuAction = (e: React.MouseEvent, action: (() => void) | undefined) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(false);
    // Defer to next tick so confirm() doesn't get swallowed by parent Link
    if (action) setTimeout(action, 0);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full bg-card">
      {imageUrl && (
        <div className="h-44 w-full bg-muted overflow-hidden relative border-b border-border/40">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`gap-1.5 rounded-md px-2 py-0.5 border-transparent font-medium ${
              type === "image" ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" :
              type === "video" ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400" :
              "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
            }`}
          >
            {type === "image" && <ImageIcon className="w-3.5 h-3.5" />}
            {type === "video" && <Video className="w-3.5 h-3.5" />}
            {type === "text" && <FileText className="w-3.5 h-3.5" />}
            <span className="capitalize">{type}</span>
          </Badge>

          {/* Three-dot dropdown menu */}
          <div className="relative" ref={menuRef}>
            <Button
              variant="ghost" size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={handleMenuToggle}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-popover border border-border rounded-lg shadow-xl z-50 py-1 animate-in fade-in-0 zoom-in-95">
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={(e) => handleMenuAction(e, handleCopyPrompt)}
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Prompt
                </button>
                {onDuplicate && (
                  <button
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                    onClick={(e) => handleMenuAction(e, onDuplicate)}
                  >
                    <CopyPlus className="w-3.5 h-3.5" /> Duplicate Card
                  </button>
                )}
                {onDelete && (
                  <>
                    <div className="border-t border-border/60 my-1" />
                    <button
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={(e) => handleMenuAction(e, onDelete)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-display font-semibold text-lg line-clamp-1 text-foreground">{title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{preview}</p>
        </div>
        
        {creatorUsername && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full overflow-hidden bg-muted">
              <img src={creatorAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creatorUsername}`} alt={creatorUsername} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">@{creatorUsername}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs tracking-wide bg-muted/80 hover:bg-muted font-medium text-muted-foreground">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-2">
          <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer">
              <Heart className="w-3.5 h-3.5" /> {likes}
            </span>
            <span className="flex items-center gap-1.5 transition-colors hover:text-foreground cursor-pointer">
              <Play className="w-3.5 h-3.5" /> {runs}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={handleCopyPrompt}
          >
            {copied ? <Check className="w-4 h-4" /> : isRunInApp ? <Zap className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
