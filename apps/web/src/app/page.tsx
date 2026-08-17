import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PromptCard } from "@/components/PromptCard";
import { ArrowRight, Save, FolderTree, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center space-y-8 max-w-5xl">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
            Your AI Prompt Architecture, <span className="text-primary">Organized.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl text-balance">
            Store, organize, and run your best AI prompts for Image, Video, and Text generation in one unified workspace. The execution engine for the prompt era.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 w-full sm:w-auto">
            <Button asChild size="lg" className="rounded-full px-8 text-base h-14">
              <Link href="/signup">Sign up free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 bg-transparent text-base h-14">
              <Link href="/community">Browse Community</Link>
            </Button>
          </div>
        </section>

        {/* Featured Prompts */}
        <section className="container mx-auto px-6 py-20 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-display font-semibold mb-3">Featured Prompts</h2>
              <p className="text-muted-foreground text-lg">Top performing prompt templates from our collections this week.</p>
            </div>
            <Link href="/community" className="text-primary text-sm font-medium flex items-center hover:underline whitespace-nowrap">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <PromptCard 
              type="image"
              title="Cyber-Nebula Architecture"
              preview="A cinematic city floating in a deep nebula, neon geometric shapes, highly detailed, 8k, Unreal Engine 5 render style..."
              tags={["Designing Art", "Cyberpunk"]}
              likes={425}
              runs={850}
              imageUrl="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80"
              isRunInApp={true}
            />
            <PromptCard 
              type="text"
              title="React Component Generator"
              preview="Act as a Senior React Developer. Write a functional component using Tailwind CSS that does the following: {{task_details}}. Make sure to handle loading and error states..."
              tags={["React", "Code", "Frontend"]}
              likes={312}
              runs={1240}
              isRunInApp={false}
            />
            <PromptCard 
              type="video"
              title="Liquid Geometry Flow"
              preview="Slow motion morphing of liquid glass into complex symmetrical structures, cinematic lighting, 4k, fluid dynamics simulation, vibrant colors..."
              tags={["Abstract", "Motion Graphics"]}
              likes={185}
              runs={420}
              imageUrl="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80"
              isRunInApp={true}
            />
            <PromptCard 
              type="image"
              title="Isometric Tech Haven"
              preview="3D isometric render of a minimal desk setup with neon holographic screens, mechanical keyboard, soft ambient lighting..."
              tags={["Isometric", "Workspace"]}
              likes={210}
              runs={530}
              imageUrl="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80"
              isRunInApp={true}
            />
            <PromptCard 
              type="text"
              title="SQL Optimization Guru"
              preview="Take the following query: {{sql_query}} and optimize for PostgreSQL. Explain the performance improvements step-by-step..."
              tags={["Database", "Engineering"]}
              likes={150}
              runs={380}
              isRunInApp={false}
            />
            <PromptCard 
              type="video"
              title="Cinematic Drone Mini-Sense"
              preview="Fast-moving shot through a dense evergreen forest with low-hanging fog, sun rays breaking through canopy, dynamic motion..."
              tags={["Live Action", "Nature"] }
              likes={110}
              runs={220}
              imageUrl="https://images.unsplash.com/photo-1506260408121-e353d10b87c7?w=800&q=80"
              isRunInApp={true}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-24 border-y border-border/40">
          <div className="container mx-auto px-6 text-center max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Engineered for Efficiency</h2>
            <p className="text-muted-foreground text-lg mb-16 max-w-2xl mx-auto">The three pillars of the PromptVault workflow.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left md:text-center">
              <div className="flex flex-col md:items-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-primary shadow-sm">
                  <Save className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold">Save</h3>
                <p className="text-muted-foreground leading-relaxed">Extract prompts from across the web or create your own templates with our powerful markdown editor.</p>
              </div>
              <div className="flex flex-col md:items-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-primary shadow-sm">
                  <FolderTree className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold">Organize</h3>
                <p className="text-muted-foreground leading-relaxed">Categorize by type, tags, and AI model for instant retrieval using our advanced semantic search system.</p>
              </div>
              <div className="flex flex-col md:items-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-primary shadow-sm">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold">Run</h3>
                <p className="text-muted-foreground leading-relaxed">Execute prompts with dynamic variables or copy them to your favorite tools with a single click.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24 max-w-6xl">
          <div className="bg-primary rounded-3xl p-12 md:p-24 text-center text-primary-foreground shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80')] bg-cover bg-center mix-blend-overlay"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">Ready to build your vault?</h2>
              <p className="text-primary-foreground/90 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium">
                Join 10,000+ prompt engineers who have consolidated their creative workflow.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" variant="secondary" className="rounded-full px-10 h-14 text-base font-semibold shadow-lg hover:scale-105 transition-transform">
                  <Link href="/signup">Get Started Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10 h-14 text-base bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground backdrop-blur-sm">
                  <Link href="/contact">Talk to Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
