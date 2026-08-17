import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-8 mt-12 bg-muted/20">
      <div className="container mx-auto px-6 flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row">
        <div className="flex flex-col items-center md:items-start">
          <p className="font-display font-bold text-foreground text-lg">PromptVault</p>
          <p className="text-sm text-muted-foreground mt-1">
            © 2026 PromptVault. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
        </div>
      </div>
    </footer>
  );
}
