import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6 mx-auto">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-display font-bold text-xl text-primary">PromptVault</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            <Link href="/community" className="transition-colors hover:text-foreground">Explore</Link>
            <Link href="/about" className="transition-colors hover:text-foreground">About</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="hidden md:block text-sm font-medium transition-colors hover:text-foreground">
            Log in
          </Link>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
