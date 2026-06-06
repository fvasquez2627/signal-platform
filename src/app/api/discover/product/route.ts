import { requireApiUser } from "@/lib/ai/auth-api";
import { callClaudeWebResearch, getAnthropicApiKey } from "@/lib/ai/claude-server";
import {
  isProductDiscoveryIncomplete,
  partialProductDiscovery,
  withDiscoveryMeta,
} from "@/lib/ai/discovery-result";
import { jsonError, jsonResponse } from "@/lib/ai/json-response";
import type { BrandContext, ProductDiscovery } from "@/lib/ai/types";

export const runtime = "nodejs";

function buildProductResearchPrompt(
  url: string,
  brandContext: BrandContext,
  brandUrl: string,
): string {
  return `Search the web for this product and return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation text.
Just the raw JSON starting with { and ending with }.

Product URL: ${url}
Brand context: ${brandContext.name} - ${brandContext.category}
Brand URL: ${brandUrl || "unknown"}

Required fields to populate with real researched values:
- name: exact product name
- primary_benefit: main health benefit in one sentence
- key_ingredients: array of main ingredients
- target_demographic: who this is for
- keywords: 10 search terms people use to find this product
- competitors: 5-8 competing products (product-level, not just brands)
- content_angles: 5 marketing angles
- seasonal_peaks: peak demand months (e.g. January, September)
- primary_platforms: best ad platforms for this product
- price_tier: budget, mid, or premium
- certifications: product certifications if any
- approved_claims: safe marketing claims
- restricted_claims: claims to avoid
- product_url: "${url}"
- brand_url: "${brandUrl}"

Do not return empty strings or empty arrays unless truly unknown after searching.`;
}

export async function POST(request: Request) {
  console.log("[discover/product] route hit");

  try {
    let body: { url?: string; brandContext?: BrandContext; brandUrl?: string };
    try {
      body = (await request.json()) as {
        url?: string;
        brandContext?: BrandContext;
        brandUrl?: string;
      };
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const productUrl = body.url?.trim() ?? "";
    console.log("[discover/product] called with:", productUrl);

    const auth = await requireApiUser();
    if ("error" in auth && auth.error) return auth.error;

    if (!productUrl) {
      return jsonError("URL is required", 400);
    }
    const brandContext = body.brandContext ?? { name: "Unknown", category: "General" };
    const brandUrl = body.brandUrl?.trim() ?? "";
    const fallback = partialProductDiscovery(productUrl, brandUrl, "");

    try {
      try {
        getAnthropicApiKey();
      } catch {
        return jsonError(
          "ANTHROPIC_API_KEY is not configured. Add ANTHROPIC_API_KEY=sk-ant-... to .env.local and restart npm run dev.",
          500,
        );
      }

      const result = await callClaudeWebResearch<ProductDiscovery>(
        buildProductResearchPrompt(productUrl, brandContext, brandUrl),
        undefined,
        { url: productUrl },
      );

      console.log("[discover/product] Parsed JSON result:", JSON.stringify(result, null, 2));

      const pickArray = (value: string[] | undefined, fallbackValue: string[] | undefined) =>
        value && value.length > 0 ? value : (fallbackValue ?? []);

      const pickString = (value: string | undefined, fallbackValue: string | undefined) =>
        value?.trim() ? value : (fallbackValue ?? "");

      const merged = {
        ...fallback,
        ...result,
        name: pickString(result.name, fallback.name),
        primary_benefit: pickString(result.primary_benefit, fallback.primary_benefit),
        target_demographic: pickString(result.target_demographic, fallback.target_demographic),
        price_tier: pickString(result.price_tier, fallback.price_tier),
        product_url: result.product_url || productUrl,
        brand_url: result.brand_url || brandUrl,
        keywords: pickArray(result.keywords, fallback.keywords),
        competitors: pickArray(result.competitors, fallback.competitors),
        content_angles: pickArray(result.content_angles, fallback.content_angles),
        seasonal_peaks: pickArray(result.seasonal_peaks, fallback.seasonal_peaks),
        primary_platforms: pickArray(result.primary_platforms, fallback.primary_platforms),
        key_ingredients: pickArray(result.key_ingredients, fallback.key_ingredients),
        certifications: pickArray(result.certifications, fallback.certifications),
        approved_claims: pickArray(result.approved_claims, fallback.approved_claims),
        restricted_claims: pickArray(result.restricted_claims, fallback.restricted_claims),
      };

      return jsonResponse(
        withDiscoveryMeta(merged, isProductDiscoveryIncomplete(merged)),
      );
    } catch (claudeError) {
      const message =
        claudeError instanceof Error ? claudeError.message : "Product discovery failed";

      console.error("[discover/product] Discovery failed:", message);

      return jsonResponse(
        withDiscoveryMeta(
          {
            ...fallback,
            product_url: productUrl,
            brand_url: brandUrl,
            keywords: [],
            competitors: [],
            content_angles: [],
            seasonal_peaks: [],
            primary_platforms: [],
            key_ingredients: [],
            certifications: [],
            approved_claims: [],
            restricted_claims: [],
            error: message,
          },
          true,
        ),
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product discovery failed";
    return jsonError(message, 500);
  }
}
