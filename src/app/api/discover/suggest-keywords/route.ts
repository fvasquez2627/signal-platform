import { requireApiUser } from "@/lib/ai/auth-api";
import { callClaudeJson } from "@/lib/ai/claude-server";
import { jsonError, jsonResponse } from "@/lib/ai/json-response";
import type { BrandContext } from "@/lib/ai/types";

export async function POST(request: Request) {
  const auth = await requireApiUser();
  if ("error" in auth && auth.error) return auth.error;

  try {
    const { productName, existing, brandContext } = (await request.json()) as {
      productName?: string;
      existing?: string[];
      brandContext?: BrandContext;
    };

    if (!productName?.trim()) {
      return jsonError("Product name is required", 400);
    }

    const result = await callClaudeJson<{ keywords: string[] }>({
      system:
        "You are an SEO keyword analyst. Return JSON: { keywords: string[] } with 8-12 new keyword suggestions not already in the existing list. Return ONLY valid JSON.",
      user: `Product: ${productName}\nBrand: ${brandContext?.name ?? "Unknown"} (${brandContext?.category ?? "General"})\nExisting keywords: ${(existing ?? []).join(", ") || "none"}`,
    });

    const existingSet = new Set((existing ?? []).map((k) => k.toLowerCase()));
    const keywords = (result.keywords ?? []).filter(
      (k) => !existingSet.has(k.toLowerCase()),
    );

    return jsonResponse({ keywords });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Keyword suggestion failed";
    return jsonError(message, 500);
  }
}
