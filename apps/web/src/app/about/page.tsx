import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Boxes, Sparkles, Zap, Share2, Image as ImageIcon, Video, FileText, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 px-6 text-center bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-6">
            <Badge variant="outline" className="px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-primary border-primary/30 bg-primary/5">
              About PromptVault
            </Badge>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-foreground leading-[1.15]">
              The Central Intelligence Hub for Your AI Workflows
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              PromptVault is a card-based prompt workspace built for developers, designers, and creators who want to organize, parameterize, and run AI prompts seamlessly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8 font-semibold shadow-lg gap-2">
                <Link href="/signup">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold">
                <Link href="/community">Explore Community</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-display font-bold">Engineered for High Performance</h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              Stop scattering prompts in notes apps and messy doc files. Treat your prompts as reusable code components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4 border-border/60 bg-card/60 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Dynamic Placeholders</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Define prompt templates with <code className="bg-muted px-1.5 py-0.5 rounded text-xs text-foreground font-mono">{"{{placeholders}}"}</code>. PromptVault automatically renders fill-in forms before execution.
              </p>
            </Card>

            <Card className="p-8 space-y-4 border-border/60 bg-card/60 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Dual Execution Modes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose between <strong className="text-foreground">Save-only</strong> for fast clipboard copying or <strong className="text-foreground">Run-in-App</strong> to trigger live AI models inline.
              </p>
            </Card>

            <Card className="p-8 space-y-4 border-border/60 bg-card/60 backdrop-blur shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold">Community Library</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Publish your finest cards to the public community feed. Fork and save cards created by top creators directly into your library.
              </p>
            </Card>
          </div>
        </section>

        {/* Supported Media Types */}
        <section className="py-16 px-6 bg-muted/20 border-y border-border/40">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-display font-bold">13 Built-in Prompt Categories</h2>
              <p className="text-muted-foreground text-base max-w-xl mx-auto">
                Categorized prompt cards optimized across text, image, and video workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border/60 space-y-3">
                <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400 font-semibold">
                  <ImageIcon className="w-5 h-5" /> Image Prompts
                </div>
                <p className="text-xs text-muted-foreground">
                  Text-to-Image, Background Swap, Quality Upscale, Style Transfer, YouTube Thumbnails.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border/60 space-y-3">
                <div className="flex items-center gap-3 text-red-600 dark:text-red-400 font-semibold">
                  <Video className="w-5 h-5" /> Video Scripts
                </div>
                <p className="text-xs text-muted-foreground">
                  Text-to-Video Prompts, TikTok/Reel Scripts, Voiceover & Narration Outlines.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border/60 space-y-3">
                <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-semibold">
                  <FileText className="w-5 h-5" /> Text & Code
                </div>
                <p className="text-xs text-muted-foreground">
                  SEO Blog Posts, Social Captions, Ad Copy Generator, Code Explainer, Meta Descriptions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-8">
          <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Boxes className="w-9 h-9" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold">Ready to organize your AI workspace?</h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Join PromptVault today. Save your best prompts, run them with dynamic variables, and supercharge your production pipeline.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="rounded-full px-10 font-semibold shadow-md">
              <Link href="/signup">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
