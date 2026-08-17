// Profiles API (PRD Section 9).

import { api } from "./client";
import type { Profile } from "@/types";

export interface UpdateProfileInput {
  display_name?: string | null;
  bio?: string | null;
}

export const profilesApi = {
  me: () => api.get<Profile>("/profiles/me"),

  updateMe: (input: UpdateProfileInput) =>
    api.patch<Profile>("/profiles/me", input),

  uploadAvatar: async (file: File) => {
    const { supabase } = await import("@/lib/supabase/client");
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const form = new FormData();
    form.append("avatar", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/profiles/me/avatar`,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
        credentials: "include",
      }
    );
    const body = res.status === 204 ? null : await res.json();
    if (!res.ok) {
      throw new Error((body && (body.error ?? body.message)) || "Avatar upload failed");
    }
    return body as Profile;
  },

  completeOnboarding: (username: string, displayName?: string) =>
    api.post<Profile>("/profiles/complete-onboarding", { username, display_name: displayName }),

  getByUsername: (username: string) =>
    api.get<Profile>(`/profiles/${username}`),
};
