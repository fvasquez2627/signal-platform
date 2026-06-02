import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types/database";
import type { User } from "@supabase/supabase-js";

export type SessionUser = {
  user: User;
  role: UserRole;
  email: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: UserRole }>();

  return {
    user,
    role: profile?.role ?? "viewer",
    email: user.email ?? "",
  };
}
