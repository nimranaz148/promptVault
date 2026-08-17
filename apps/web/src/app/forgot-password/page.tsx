"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Boxes, ArrowLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
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

        {/* Card */}
        <Card className="w-full max-w-md p-8 sm:p-10 shadow-xl border-border/50">
          {submitted ? (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold mb-2">Check your email</h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We sent a password reset link to <strong className="text-foreground">{email}</strong>. Please check your inbox and follow the instructions.
                </p>
              </div>
              <Button asChild variant="outline" className="w-full h-12 font-semibold">
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Return to Log in
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-display font-bold mb-2">Reset your password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your registered email address and we&apos;ll send you a recovery link.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                    {error}
                  </div>
                )}

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

                <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold shadow-md mt-2">
                  {loading ? "Sending link..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-8 text-center text-sm">
                <Link href="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back to Log in
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>

      <footer className="py-6 text-center text-xs text-muted-foreground font-medium">
        © 2026 PromptVault. Built for high-efficiency prompt engineering.
      </footer>
    </div>
  );
}



