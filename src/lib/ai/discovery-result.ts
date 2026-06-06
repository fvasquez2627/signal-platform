import type { BrandDiscovery, ProductDiscovery } from "@/lib/ai/types";
import { extractPageTitle, guessNameFromUrl } from "@/lib/ai/fetch-page-text";

export const PARTIAL_ANALYSIS_WARNING =
  "Could not fully analyze this URL. Fields have been pre-filled where possible — please review and complete manually.";

export type DiscoveryMeta = {
  incomplete?: boolean;
  warning?: string;
};

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value != null;
}

export function isProductDiscoveryIncomplete(data: Partial<ProductDiscovery>): boolean {
  const coreFields = [
    data.name,
    data.primary_benefit,
    data.target_demographic,
    data.keywords,
    data.competitors,
  ];
  const filled = coreFields.filter(hasValue).length;
  return filled < 2;
}

export function isBrandDiscoveryIncomplete(data: Partial<BrandDiscovery>): boolean {
  const coreFields = [
    data.name,
    data.brand_voice,
    data.primary_category,
    data.target_demographic,
    data.suggested_competitors,
  ];
  const filled = coreFields.filter(hasValue).length;
  return filled < 2;
}

export function partialProductDiscovery(
  url: string,
  brandUrl: string,
  html: string,
): ProductDiscovery {
  const title = extractPageTitle(html);
  return {
    name: title || guessNameFromUrl(url),
    primary_benefit: "",
    key_ingredients: [],
    target_demographic: "",
    keywords: [],
    competitors: [],
    content_angles: [],
    seasonal_peaks: [],
    primary_platforms: [],
    price_tier: "",
    certifications: [],
    approved_claims: [],
    restricted_claims: [],
    product_url: url,
    brand_url: brandUrl,
  };
}

export function partialBrandDiscovery(url: string, html: string): BrandDiscovery {
  const title = extractPageTitle(html);
  return {
    name: title || guessNameFromUrl(url),
    brand_voice: "",
    compliance_notes: "",
    primary_category: "",
    target_demographic: "",
    primary_platforms: [],
    suggested_competitors: [],
    certifications: [],
    key_brand_claims: [],
    brand_url: url,
  };
}

export function withDiscoveryMeta<T extends Record<string, unknown>>(
  data: T,
  incomplete: boolean,
): T & DiscoveryMeta {
  if (!incomplete) return data;
  return {
    ...data,
    incomplete: true,
    warning: PARTIAL_ANALYSIS_WARNING,
  };
}
