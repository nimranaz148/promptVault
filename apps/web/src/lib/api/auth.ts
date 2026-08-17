// Auth — thin wrapper over the Supabase JS client (PRD Section 3.1:
// hooks/lib may use supabase.auth; this keeps auth logic in one place).

import { supabase } from "@/lib/supabase/client";

export const authApi = {
  signInWithPassword: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUp: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),

  signInWithGoogle: () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/app` },
    }),

  resetPasswordForEmail: (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    }),

  updatePassword: (newPassword: string) =>
    supabase.auth.updateUser({ password: newPassword }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback: (event: string, session: unknown) => void) =>
    supabase.auth.onAuthStateChange(callback),
};
