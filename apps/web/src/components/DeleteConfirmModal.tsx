"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title?: string;
  description?: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
  title = "Delete Prompt Card",
  description = "Are you sure you want to delete this card? This action cannot be undone."
}: DeleteConfirmModalProps) {
  // Close on Escape press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 dark:bg-black/65 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <Card className="relative w-full max-w-md p-6 shadow-2xl border border-border/80 bg-card z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground font-display">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-10 px-4 font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="h-10 px-4 font-medium min-w-[80px]"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
