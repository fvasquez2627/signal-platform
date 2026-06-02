import { createClient } from "@/lib/supabase/server";
import type { Client, Product } from "@/types/database";

export type WorkspaceData = {
  clients: Client[];
  products: Product[];
};

export async function getWorkspaceData(): Promise<WorkspaceData> {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, brand_voice, compliance_notes")
    .order("name");

  const { data: products } = await supabase
    .from("products")
    .select("id, client_id, name, keywords, competitors")
    .order("name");

  return {
    clients: clients ?? [],
    products: products ?? [],
  };
}
