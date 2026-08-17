import { Card } from "@/components/ui/card";

export function PromptCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden h-[320px] bg-card animate-pulse">
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Header: Badge & Menu */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-muted rounded-md" />
          <div className="h-8 w-8 bg-muted rounded-md" />
        </div>

        {/* Title & Preview */}
        <div className="space-y-3 mt-2">
          <div className="h-6 w-3/4 bg-muted rounded-md" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded-md" />
            <div className="h-4 w-5/6 bg-muted rounded-md" />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <div className="h-5 w-16 bg-muted rounded-md" />
          <div className="h-5 w-20 bg-muted rounded-md" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/60 mt-2">
          <div className="flex items-center gap-4">
            <div className="h-4 w-10 bg-muted rounded-md" />
            <div className="h-4 w-10 bg-muted rounded-md" />
          </div>
          <div className="h-8 w-8 bg-muted rounded-full" />
        </div>
      </div>
    </Card>
  );
}
