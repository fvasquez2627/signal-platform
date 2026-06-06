import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/ai/json-response";

export async function requireApiUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: jsonError("Unauthorized", 401) };
  }

  return { user };
}
