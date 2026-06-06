import { createClient } from "@/lib/supabase/client";
import { normalizePlatforms, platformsToStorage } from "@/lib/config/constants";
import type { Client, Product } from "@/types/database";

export type ClientConfigInput = {
  name: string;
  brand_voice: string;
  compliance_notes: string;
  brand_url?: string;
  primary_category?: string;
  target_demographic?: string;
  primary_platforms?: string[];
  certifications?: string[];
  key_brand_claims?: string[];
  competitors?: string[];
  internal_notes?: string;
};

export type ProductConfigInput = {
  name: string;
  primary_benefit?: string;
  target_demographic?: string;
  keywords?: string[];
  competitors?: string[];
  content_angles?: string[];
  seasonal_peaks?: string[];
  primary_platforms?: string[];
  product_url?: string;
  brand_url?: string;
  key_ingredients?: string[];
  approved_claims?: string[];
  restricted_claims?: string[];
  price_tier?: string;
  internal_notes?: string;
  compliance_notes?: string;
  tags?: string[];
  certifications?: string[];
  /** UI-only — not persisted to products table */
  competitor_sources?: Record<string, "auto" | "manual">;
};

/** Columns that exist on public.products — update payload must match exactly. */
export function buildProductUpdatePayload(input: ProductConfigInput) {
  return {
    name: input.name,
    primary_benefit: input.primary_benefit ?? null,
    target_demographic: input.target_demographic ?? null,
    keywords: input.keywords ?? [],
    competitors: input.competitors ?? [],
    content_angles: input.content_angles ?? [],
    seasonal_peaks: input.seasonal_peaks ?? [],
    primary_platforms: platformsToStorage(normalizePlatforms(input.primary_platforms ?? [])),
    product_url: input.product_url ?? null,
    brand_url: input.brand_url ?? null,
    approved_claims: input.approved_claims ?? [],
    restricted_claims: input.restricted_claims ?? [],
    key_ingredients: input.key_ingredients ?? [],
    certifications: input.certifications ?? [],
    compliance_notes: input.compliance_notes ?? null,
    tags: input.tags ?? [],
    internal_notes: input.internal_notes ?? null,
    price_tier: input.price_tier ?? null,
  };
}

function assertUpdated(count: number | null, label: string) {
  if (count === 0) {
    throw new Error(
      `No rows updated — check that you have permission to update this ${label}`,
    );
  }
}

export async function insertClientWithAccess(
  input: ClientConfigInput,
  userId: string,
  userRole: string,
): Promise<Client> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: input.name,
      brand_voice: input.brand_voice,
      compliance_notes: input.compliance_notes,
      brand_url: input.brand_url ?? null,
      primary_category: input.primary_category ?? null,
      target_demographic: input.target_demographic ?? null,
      primary_platforms: platformsToStorage(normalizePlatforms(input.primary_platforms ?? [])),
      certifications: input.certifications ?? [],
      key_brand_claims: input.key_brand_claims ?? [],
      suggested_competitors: input.competitors ?? [],
      internal_notes: input.internal_notes ?? null,
    } as never)
    .select("id, name, brand_voice, compliance_notes, brand_url, primary_category, target_demographic, primary_platforms, certifications, key_brand_claims, suggested_competitors, internal_notes")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create client");

  const client = data as Client;

  await supabase.from("client_users").insert({
    client_id: client.id,
    user_id: userId,
    role: userRole === "admin" ? "admin" : "manager",
  } as never);

  return client;
}

export async function insertProduct(
  clientId: string,
  input: ProductConfigInput,
): Promise<Product> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      client_id: clientId,
      ...buildProductUpdatePayload(input),
    } as never)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to create product");
  return data as Product;
}

export async function insertAllProductsRow(
  clientId: string,
  brand: ClientConfigInput,
): Promise<Product> {
  return insertProduct(clientId, {
    name: "All Products",
    primary_benefit: brand.key_brand_claims?.[0] ?? "Complete wellness from within",
    target_demographic: brand.target_demographic,
    keywords: brand.key_brand_claims ?? [],
    competitors: brand.competitors ?? [],
    content_angles: ["brand story", "product education", "lifestyle integration"],
    seasonal_peaks: ["January", "May", "September"],
    primary_platforms: brand.primary_platforms ?? [],
    brand_url: brand.brand_url,
    competitor_sources: Object.fromEntries(
      (brand.competitors ?? []).map((c) => [c, "auto" as const]),
    ),
  });
}

export async function updateClientConfig(
  clientId: string,
  input: ClientConfigInput,
): Promise<void> {
  const supabase = createClient();

  const payload = {
    name: input.name,
    brand_voice: input.brand_voice,
    compliance_notes: input.compliance_notes,
    brand_url: input.brand_url ?? null,
    primary_category: input.primary_category ?? null,
    target_demographic: input.target_demographic ?? null,
    primary_platforms: platformsToStorage(normalizePlatforms(input.primary_platforms ?? [])),
    certifications: input.certifications ?? [],
    key_brand_claims: input.key_brand_claims ?? [],
    suggested_competitors: input.competitors ?? [],
    internal_notes: input.internal_notes ?? null,
  };

  const { data, error } = await supabase
    .from("clients")
    .update(payload as never)
    .eq("id", clientId)
    .select("id");

  if (error) throw new Error(error.message);
  assertUpdated(data?.length ?? null, "client");
}

export async function updateProductConfig(
  productId: string,
  input: ProductConfigInput,
): Promise<void> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .update(buildProductUpdatePayload(input) as never)
    .eq("id", productId)
    .select("id");

  if (error) throw new Error(error.message);
  assertUpdated(data?.length ?? null, "product");
}
