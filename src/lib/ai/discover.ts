import type { BrandContext, BrandDiscovery, ProductDiscovery } from "@/lib/ai/types";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }
  return data;
}

export async function discoverBrand(url: string): Promise<BrandDiscovery> {
  return postJson<BrandDiscovery>("/api/discover/brand", { url });
}

export async function discoverProduct(
  url: string,
  brandContext: BrandContext,
): Promise<ProductDiscovery> {
  return postJson<ProductDiscovery>("/api/discover/product", { url, brandContext });
}

export async function suggestKeywords(
  productName: string,
  existing: string[],
  brandContext: BrandContext,
): Promise<{ keywords: string[] }> {
  return postJson<{ keywords: string[] }>("/api/discover/suggest-keywords", {
    productName,
    existing,
    brandContext,
  });
}

export async function discoverCompetitors(
  productName: string,
  existing: string[],
  brandContext: BrandContext,
  productUrl?: string,
): Promise<{ competitors: string[] }> {
  return postJson<{ competitors: string[] }>("/api/discover/discover-competitors", {
    productName,
    existing,
    brandContext,
    productUrl,
  });
}
