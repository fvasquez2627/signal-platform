import { normalizePlatform } from "@/lib/config/constants";
import type { Client, Product } from "@/types/database";

export const CLIENT_SELECT =
  "id, name, brand_voice, compliance_notes, brand_url, primary_category, target_demographic, primary_platforms, certifications, key_brand_claims, suggested_competitors, internal_notes";

export const PRODUCT_SELECT =
  "id, client_id, name, keywords, competitors, target_demographic, primary_benefit, content_angles, seasonal_peaks, primary_platforms, product_url, brand_url, key_ingredients, approved_claims, restricted_claims, price_tier, internal_notes, compliance_notes, tags, certifications";

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export function normalizeClient(row: Record<string, unknown>): Client {
  return {
    id: row.id as string,
    name: row.name as string,
    brand_voice: (row.brand_voice as string | null) ?? null,
    compliance_notes: (row.compliance_notes as string | null) ?? null,
    brand_url: (row.brand_url as string | null) ?? null,
    primary_category: (row.primary_category as string | null) ?? null,
    target_demographic: (row.target_demographic as string | null) ?? null,
    primary_platforms: asStringArray(row.primary_platforms).map(normalizePlatform),
    certifications: asStringArray(row.certifications),
    key_brand_claims: asStringArray(row.key_brand_claims),
    suggested_competitors: asStringArray(row.suggested_competitors),
    internal_notes: (row.internal_notes as string | null) ?? null,
    created_at: row.created_at as string | undefined,
  };
}

export function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    client_id: row.client_id as string,
    name: row.name as string,
    keywords: asStringArray(row.keywords),
    competitors: asStringArray(row.competitors),
    target_demographic: (row.target_demographic as string | null) ?? null,
    primary_benefit: (row.primary_benefit as string | null) ?? null,
    content_angles: asStringArray(row.content_angles),
    seasonal_peaks: asStringArray(row.seasonal_peaks),
    primary_platforms: asStringArray(row.primary_platforms).map(normalizePlatform),
    product_url: (row.product_url as string | null) ?? null,
    brand_url: (row.brand_url as string | null) ?? null,
    key_ingredients: asStringArray(row.key_ingredients),
    approved_claims: asStringArray(row.approved_claims),
    restricted_claims: asStringArray(row.restricted_claims),
    price_tier: (row.price_tier as string | null) ?? null,
    internal_notes: (row.internal_notes as string | null) ?? null,
    tags: asStringArray(row.tags),
    compliance_notes: (row.compliance_notes as string | null) ?? null,
    certifications: asStringArray(row.certifications),
    created_at: row.created_at as string | undefined,
  };
}
