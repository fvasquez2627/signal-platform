import { requireApiUser } from "@/lib/ai/auth-api";
import { callClaudeWebResearch } from "@/lib/ai/claude-server";
import {
  isBrandDiscoveryIncomplete,
  partialBrandDiscovery,
  withDiscoveryMeta,
} from "@/lib/ai/discovery-result";
import { jsonError, jsonResponse } from "@/lib/ai/json-response";
import type { BrandDiscovery } from "@/lib/ai/types";

export const runtime = "nodejs";

function buildBrandResearchPrompt(url: string): string {
  return `Research this brand website URL and return a complete JSON analysis:
URL: ${url}

Use web search to find information about this brand including:
- Brand name and positioning
- Brand voice and tone
- Health/legal compliance notes or disclaimers
- Primary product category
- Target demographic
- Social platforms where they are active
- Direct brand competitors in their category
- Certifications (NSF, GMP, organic, etc.)
- Key brand value propositions and claims

Return ONLY this JSON structure, no other text:
{
  "name": "",
  "brand_voice": "",
  "compliance_notes": "",
  "primary_category": "",
  "target_demographic": "",
  "primary_platforms": [],
  "suggested_competitors": [],
  "certifications": [],
  "key_brand_claims": [],
  "brand_url": "${url}"
}`;
}

export async function POST(request: Request) {
  console.log("[discover/brand] route hit");

  try {
    const auth = await requireApiUser();
    if ("error" in auth && auth.error) return auth.error;

    let body: { url?: string };
    try {
      body = (await request.json()) as { url?: string };
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    if (!body.url?.trim()) {
      return jsonError("URL is required", 400);
    }

    const brandUrl = body.url.trim();
    const fallback = partialBrandDiscovery(brandUrl, "");

    try {
      const result = await callClaudeWebResearch<BrandDiscovery>(
        buildBrandResearchPrompt(brandUrl),
      );

      const merged = {
        ...fallback,
        ...result,
        brand_url: result.brand_url || brandUrl,
        suggested_competitors: result.suggested_competitors ?? [],
        certifications: result.certifications ?? [],
        key_brand_claims: result.key_brand_claims ?? [],
        primary_platforms: result.primary_platforms ?? [],
      };

      return jsonResponse(
        withDiscoveryMeta(merged, isBrandDiscoveryIncomplete(merged)),
      );
    } catch (claudeError) {
      const message =
        claudeError instanceof Error ? claudeError.message : "Brand discovery failed";

      return jsonResponse(
        withDiscoveryMeta(
          {
            ...fallback,
            brand_url: brandUrl,
            suggested_competitors: [],
            certifications: [],
            key_brand_claims: [],
            primary_platforms: [],
            error: message,
          },
          true,
        ),
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Brand discovery failed";
    return jsonError(message, 500);
  }
}
