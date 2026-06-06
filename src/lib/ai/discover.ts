import type {
  BrandContext,
  BrandDiscovery,
  DiscoveryResponse,
  ProductDiscovery,
} from "@/lib/ai/types";

async function postJson<T>(url: string, body: unknown): Promise<DiscoveryResponse<T>> {
  console.log("Calling API...", url, body);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await response.text();
  let data: DiscoveryResponse<T>;

  try {
    data = JSON.parse(raw) as DiscoveryResponse<T>;
  } catch {
    const preview = raw.trim().slice(0, 80);
    if (preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")) {
      throw new Error(
        `Server returned an HTML error page (${response.status}). Please refresh and try again.`,
      );
    }
    throw new Error(`Server returned invalid JSON (${response.status})`);
  }

  if (!response.ok && !data.incomplete) {
    throw new Error(data.error ?? `Request failed (${response.status})`);
  }

  return data;
}

export async function discoverBrand(url: string): Promise<DiscoveryResponse<BrandDiscovery>> {
  return postJson<BrandDiscovery>("/api/discover/brand", { url });
}

export async function discoverProduct(
  url: string,
  brandContext: BrandContext,
  brandUrl = "",
): Promise<DiscoveryResponse<ProductDiscovery>> {
  return postJson<ProductDiscovery>("/api/discover/product", {
    url,
    brandContext,
    brandUrl,
  });
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
