"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { supabase } from "@/lib/supabase/client";

export interface UseAuthResult {
  user: { id: string; email?: string } | null;
  loading: boolean;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = authApi.onAuthStateChange((_event, session) => {
      if (!active) return;
      const s = session as { user?: { id: string; email?: string } } | null;
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
