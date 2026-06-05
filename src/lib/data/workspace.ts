import { createClient } from "@/lib/supabase/server";
import {
  FALLBACK_CLIENT,
  FALLBACK_PRODUCTS,
} from "@/lib/data/workspace-fallback";
import {
  CLIENT_SELECT,
  normalizeClient,
  normalizeProduct,
  PRODUCT_SELECT,
} from "@/lib/data/workspace-utils";
import type { Client, Product } from "@/types/database";

export type WorkspaceData = {
  clients: Client[];
  products: Product[];
};

export async function getWorkspaceData(): Promise<WorkspaceData> {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select(CLIENT_SELECT)
    .order("name");

  const { data: products } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("name");

  const normalizedClients = (clients ?? []).map((row) =>
    normalizeClient(row as Record<string, unknown>),
  );
  const normalizedProducts = (products ?? []).map((row) =>
    normalizeProduct(row as Record<string, unknown>),
  );

  if (normalizedClients.length === 0 || normalizedProducts.length === 0) {
    return {
      clients: [FALLBACK_CLIENT],
      products: FALLBACK_PRODUCTS,
    };
  }

  return {
    clients: normalizedClients,
    products: normalizedProducts,
  };
}
