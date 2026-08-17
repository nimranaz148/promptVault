"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Edit2, UploadCloud, Trash2, Copy, Zap,
  Image as ImageIcon, Video, FileText, Loader2, AlertCircle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useCard, useDeleteCard, usePublishCard, useRunCard } from "@/hooks/useCards";
import { useRouter } from "next/navigation";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";

export default function CardDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: card, isLoading, error } = useCard(params.id);
  const deleteMutation = useDeleteCard();
  const publishMutation = usePublishCard();
  const runMutation = useRunCard(params.id);

  // Collect variable values from inputs
  const varRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [runResult, setRunResult] = useState<{ type: string; value: string } | null>(null);
  const [runError, setRunError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-HTTPS
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [resultCopied, setResultCopied] = useState(false);

  const copyResultToClipboard = (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
    } else {
      // Fallback for non-HTTPS
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setResultCopied(true);
    setTimeout(() => setResultCopied(false), 2000);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(params.id);
      router.push("/app");
    } catch (err) {
      console.error("Failed to delete card:", err);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleTogglePublish = async () => {
    if (card) {
      await publishMutation.mutateAsync({ id: card.id, publish: !card.is_public });
    }
  };

  const handleRun = async () => {
    setRunError(null);
    setRunResult(null);

    // Collect values from variable input refs
    const values: Record<string, string> = {};
    if (card?.variables) {
      for (const v of card.variables as any[]) {
        const el = varRefs.current[v.key];
        values[v.key] = el?.value ?? v.default ?? "";
      }
    }

    try {
      const result = await runMutation.mutateAsync(values);
      setRunResult({ type: result.result_type, value: result.result_value ?? "" });
    } catch (err: any) {
      setRunError(err?.message ?? "Something went wrong. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading card details...</div>;
  }

  if (error || !card) {
    return <div className="p-8 text-center text-destructive">Failed to load card.</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 pb-20">

        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-muted">
              <Link href="/app"><ArrowLeft className="w-5 h-5" /></Link>
            </Button>
            <h1 className="text-2xl font-display font-bold text-foreground truncate max-w-[200px] sm:max-w-md">{card.title}</h1>
            <Badge
              variant="outline"
              className={`border-transparent gap-1 ${
                card.type === "image" ? "bg-orange-500/10 text-orange-600" :
                card.type === "video" ? "bg-red-500/10 text-red-600" :
                "bg-blue-500/10 text-blue-600"
              }`}
            >
              {card.type === "image" && <ImageIcon className="w-3 h-3" />}
              {card.type === "video" && <Video className="w-3 h-3" />}
              {card.type === "text" && <FileText className="w-3 h-3" />}
              <span className="capitalize">{card.type}</span>
            </Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Button asChild variant="outline" className="gap-2 bg-card font-medium">
              <Link href={`/app/cards/${card.id}/edit`}><Edit2 className="w-4 h-4" /> Edit</Link>
            </Button>
            <Button
              variant="outline"
              className="gap-2 bg-card font-medium"
              onClick={handleTogglePublish}
              disabled={publishMutation.isPending}
            >
              <UploadCloud className="w-4 h-4" /> {card.is_public ? "Unpublish" : "Publish"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Prompt Template */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt Template</h2>
          <Card className="bg-muted/30 border-border/60 p-6 relative group">
            <Button
              variant="ghost" size="icon"
              className={`absolute top-4 right-4 h-8 w-8 transition-opacity ${
                copied
                  ? "text-green-500 opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
              onClick={() => copyToClipboard(card.prompt_body)}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
            <p className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {card.prompt_body}
            </p>
          </Card>
        </div>

        {/* Variables */}
        {card.variables && Array.isArray(card.variables) && card.variables.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fill Variables</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(card.variables as any[]).map((v: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  <Label htmlFor={`var-${v.key}`} className="text-xs font-medium text-foreground">
                    {v.label || v.key}
                  </Label>
                  <Input
                    id={`var-${v.key}`}
                    defaultValue={v.default || ""}
                    className="bg-card shadow-sm"
                    ref={(el) => { varRefs.current[v.key] = el; }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Run Button */}
        {card.mode === "run_in_app" && (
          <div className="flex justify-center pt-4 pb-2">
            <Button
              size="lg"
              className="w-full max-w-sm rounded-xl h-14 text-base font-bold shadow-lg shadow-primary/20 gap-2 hover:scale-[1.02] transition-transform"
              onClick={handleRun}
              disabled={runMutation.isPending}
            >
              {runMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
              ) : (
                <><Zap className="w-5 h-5 fill-current" /> RUN PROMPT</>
              )}
            </Button>
          </div>
        )}

        {/* Run Error */}
        {runError && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{runError}</span>
          </div>
        )}

        {/* Run Result */}
        {runResult && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Result</h2>
            <Card className="p-4 bg-card border-border/60 relative group">
              {runResult.type === "image_url" ? (
                <img
                  src={runResult.value}
                  alt="Generated"
                  className="w-full rounded-lg object-contain max-h-[600px]"
                />
              ) : (
                <>
                  <Button
                    variant="ghost" size="icon"
                    className={`absolute top-4 right-4 h-8 w-8 transition-opacity ${
                      resultCopied
                        ? "text-green-500 opacity-100"
                        : "text-muted-foreground opacity-0 group-hover:opacity-100"
                    }`}
                    onClick={() => copyResultToClipboard(runResult.value)}
                  >
                    {resultCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-foreground pr-10">
                    {runResult.value}
                  </p>
                </>
              )}
            </Card>
          </div>
        )}

        {/* Copy button for save-only mode */}
        {card.mode === "save_only" && (
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              variant="outline"
              className="w-full max-w-sm rounded-xl h-14 text-base font-semibold gap-2"
              onClick={() => navigator.clipboard.writeText(card.prompt_body)}
            >
              <Copy className="w-5 h-5" /> Copy Prompt
            </Button>
          </div>
        )}
        {/* Custom Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          isPending={deleteMutation.isPending}
        />

      </div>
    </div>
  );
}
