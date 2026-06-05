import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/ai/auth-api";
import { callClaudeJson } from "@/lib/ai/claude-server";
import type { BrandContext } from "@/lib/ai/types";

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const { productName, existing, brandContext, productUrl } = (await request.json()) as {
      productName?: string;
      existing?: string[];
      brandContext?: BrandContext;
      productUrl?: string;
    };

    if (!productName?.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const result = await callClaudeJson<{ competitors: string[] }>({
      system:
        "You are a competitive intelligence analyst. Return JSON: { competitors: string[] } with 5-8 PRODUCT-LEVEL competitors (specific products, not just brands). Return ONLY valid JSON.",
      user: `Product: ${productName}\nBrand: ${brandContext?.name ?? "Unknown"} (${brandContext?.category ?? "General"})\nProduct URL: ${productUrl ?? "not provided"}\nExisting competitors: ${(existing ?? []).join(", ") || "none"}`,
      url: productUrl,
    });

    const existingSet = new Set((existing ?? []).map((c) => c.toLowerCase()));
    const competitors = (result.competitors ?? []).filter(
      (c) => !existingSet.has(c.toLowerCase()),
    );

    return NextResponse.json({ competitors });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Competitor discovery failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
