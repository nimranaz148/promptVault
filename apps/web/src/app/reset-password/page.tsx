"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, Boxes, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/app");
      }, 2000);
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
          {success ? (
            <div className="text-center space-y-6">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold mb-2">Password Updated!</h1>
                <p className="text-muted-foreground text-sm">
                  Your password has been changed successfully. Redirecting you to your library...
                </p>
              </div>
              <Button asChild className="w-full h-12 font-semibold">
                <Link href="/app">Go to Workspace</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-display font-bold mb-2">Create new password</h1>
                <p className="text-muted-foreground text-sm">
                  Enter your new password below to regain access to your account.
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      minLength={6}
                      className="pl-10 h-12 bg-muted/20"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      minLength={6}
                      className="pl-10 h-12 bg-muted/20"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 text-base font-semibold shadow-md mt-2">
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
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
