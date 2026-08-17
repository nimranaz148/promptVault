"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Boxes } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push(next);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/app`,
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center gap-3 mb-10">
          <div className="w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-md">
            <Boxes className="w-7 h-7" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">PromptVault</span>
        </Link>

        {/* Login Card */}
        <Card className="w-full max-w-md p-8 sm:p-10 shadow-xl border-border/50">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Log in to your creative workspace</p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-5">
            {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="pl-10 h-12 bg-muted/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********" 
                  className="pl-10 h-12 bg-muted/20"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold shadow-md mt-2">
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <div className="h-px flex-1 bg-border/60"></div>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-border/60"></div>
          </div>

          <Button onClick={handleGoogleLogin} variant="outline" className="w-full h-12 mt-6 font-medium border-border/60 shadow-sm">
            {/* simple Google SVG icon */}
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="mt-8 flex flex-col items-center gap-3 text-sm">
            <Link href="/forgot-password" className="text-primary font-medium hover:underline">
              Forgot password?
            </Link>
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up.
              </Link>
            </p>
          </div>
        </Card>
      </div>

      <footer className="py-6 text-center text-xs text-muted-foreground font-medium">
        © 2026 PromptVault. Built for high-efficiency prompt engineering.
      </footer>
    </div>
  );
}



