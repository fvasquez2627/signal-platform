import { createClient } from "@/lib/supabase/server";
import type { ClientIntegrationRow } from "@/lib/integrations/resolve";

export async function getIntegrationsForClient(
  clientId: string,
): Promise<ClientIntegrationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("integrations")
    .select("platform, encrypted_key, connected")
    .eq("client_id", clientId)
    .returns<
      { platform: string; encrypted_key: string | null; connected: boolean }[]
    >();

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    platform: String(row.platform),
    encrypted_key: row.encrypted_key,
    connected: row.connected,
  }));
}
