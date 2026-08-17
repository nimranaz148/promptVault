import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6 shadow-inner">
        {icon || <FileQuestion className="h-10 w-10 opacity-80" />}
      </div>
      <h3 className="text-2xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-8 text-balance">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild className="rounded-full px-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
