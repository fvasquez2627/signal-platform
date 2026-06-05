import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/ai/auth-api";
import { callClaudeJson } from "@/lib/ai/claude-server";
import type { BrandDiscovery } from "@/lib/ai/types";

const BRAND_SYSTEM = `You are a brand intelligence analyst.
Analyze this brand website and return a JSON object with:
{
  name: string (brand name),
  brand_voice: string (tone and style description),
  compliance_notes: string (any health/legal disclaimers you detect on the site),
  primary_category: string (supplement type, e.g. 'Health Supplements'),
  target_demographic: string,
  primary_platforms: string[] (which platforms they appear active on based on site),
  suggested_competitors: string[] (5-8 direct brand competitors in their category),
  certifications: string[] (any certifications mentioned: NSF, GMP, etc),
  key_brand_claims: string[] (main value props),
  brand_url: string (the URL provided)
}
Return ONLY valid JSON, no other text.`;

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const { url } = (await request.json()) as { url?: string };
    if (!url?.trim()) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const brandUrl = url.trim();

    const result = await callClaudeJson<BrandDiscovery>({
      system: BRAND_SYSTEM,
      user: `Analyze this brand website URL: ${brandUrl}`,
      url: brandUrl,
    });

    return NextResponse.json({
      ...result,
      brand_url: result.brand_url || brandUrl,
      suggested_competitors: result.suggested_competitors ?? [],
      certifications: result.certifications ?? [],
      key_brand_claims: result.key_brand_claims ?? [],
      primary_platforms: result.primary_platforms ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Brand discovery failed";
    return NextResponse.json(
      { error: message, partial: { brand_url: "" } },
      { status: 500 },
    );
  }
}
