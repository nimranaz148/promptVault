import { Suspense } from "react";
import AppLayoutClient from "./AppLayoutClient";

function AppLayoutFallback() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 border-b border-border/50 bg-card flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="h-6 w-36 rounded bg-muted/50" />
        <div className="h-10 w-full max-w-2xl rounded-md bg-muted/40" />
        <div className="h-9 w-24 rounded bg-muted/50" />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border/50 bg-card hidden md:block" />
        <main className="flex-1 bg-background/50" />
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AppLayoutFallback />}>
      <AppLayoutClient>{children}</AppLayoutClient>
    </Suspense>
  );
}
