"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, AtSign, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useMe } from "@/hooks/useProfile";
import { profilesApi } from "@/lib/api/profiles";
import { ApiError } from "@/lib/api/client";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, error } = useMe();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/app");
    }
  }, [authLoading, user, router]);

  const needsOnboarding =
    !profileLoading &&
    (!profile || !!error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const clean = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
    if (clean.length < 3) {
      setFormError("Username must be at least 3 characters (letters, numbers, underscores).");
      return;
    }

    setSubmitting(true);
    try {
      await profilesApi.completeOnboarding(clean, displayName.trim() || clean);
      router.replace("/app");
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (user && needsOnboarding) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md p-8 sm:p-10 shadow-xl border-border/50">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold mb-2">Complete your profile</h1>
            <p className="text-muted-foreground text-sm">Pick a unique username to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {formError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
                {formError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="onboard-username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Username <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="onboard-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="arivers"
                  className="pl-10 h-12 bg-muted/20 font-mono text-sm"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">3-20 characters: lowercase letters, numbers, underscores.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onboard-display" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Display Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="onboard-display"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Rivers"
                  className="pl-10 h-12 bg-muted/20"
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-12 text-base font-semibold shadow-md mt-2">
              {submitting ? "Setting up..." : "Start building"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
