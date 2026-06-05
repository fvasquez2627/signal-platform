import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/ai/auth-api";
import { callClaudeJson } from "@/lib/ai/claude-server";
import type { BrandContext, ProductDiscovery } from "@/lib/ai/types";

const PRODUCT_SYSTEM = `You are a product intelligence analyst.
Analyze this product page URL and the brand context provided. Return a JSON object with:
{
  name: string (product name),
  primary_benefit: string (main benefit claim),
  key_ingredients: string[] (active ingredients),
  target_demographic: string,
  keywords: string[] (10-15 SEO/search keywords for this specific product),
  competitors: string[] (5-8 PRODUCT-LEVEL competitors — specific products not brands.
    These should compete directly with THIS product, not just the brand category),
  content_angles: string[] (5-6 content angles that would work for this product),
  seasonal_peaks: string[] (months when search interest typically peaks for this product),
  primary_platforms: string[] (best platforms for this product based on demographic),
  price_tier: string (budget/mid/premium),
  certifications: string[] (product-specific),
  approved_claims: string[] (claims safe to make),
  restricted_claims: string[] (claims to avoid),
  product_url: string,
  brand_url: string (parent brand URL)
}
Return ONLY valid JSON, no other text.`;

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const body = (await request.json()) as {
      url?: string;
      brandContext?: BrandContext;
    };

    if (!body.url?.trim()) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const productUrl = body.url.trim();
    const brandContext = body.brandContext ?? { name: "Unknown", category: "General" };

    const result = await callClaudeJson<ProductDiscovery>({
      system: PRODUCT_SYSTEM,
      user: `Analyze this product page URL: ${productUrl}\nBrand context: ${brandContext.name} (${brandContext.category})`,
      url: productUrl,
    });

    return NextResponse.json({
      ...result,
      product_url: result.product_url || productUrl,
      keywords: result.keywords ?? [],
      competitors: result.competitors ?? [],
      content_angles: result.content_angles ?? [],
      seasonal_peaks: result.seasonal_peaks ?? [],
      primary_platforms: result.primary_platforms ?? [],
      key_ingredients: result.key_ingredients ?? [],
      certifications: result.certifications ?? [],
      approved_claims: result.approved_claims ?? [],
      restricted_claims: result.restricted_claims ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Product discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
