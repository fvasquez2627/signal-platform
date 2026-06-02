"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded-lg border border-[var(--red)]/30 px-4 py-2 text-sm font-medium text-[var(--red)] transition-colors hover:bg-[var(--red)]/10"
    >
      Sign out
    </button>
  );
}
