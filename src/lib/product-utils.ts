import type { Product } from "@/types/database";

export const CLIENT_COLORS = [
  "#00D4FF",
  "#00FF88",
  "#A78BFA",
  "#FACC15",
  "#F97316",
  "#F472B6",
];

export const PRODUCT_COLORS: Record<string, string> = {
  "All Products": "#00D4FF",
  "Collagen Peptides": "#00FF88",
  "Hyaluronic Acid": "#A78BFA",
  "Ashwagandha": "#FACC15",
  "Turmeric": "#F97316",
  Biotin: "#F472B6",
};

export const PRODUCT_SIGNAL_COUNTS: Record<string, number> = {
  "All Products": 16,
  "Collagen Peptides": 7,
  "Hyaluronic Acid": 4,
  Ashwagandha: 6,
  Turmeric: 3,
  Biotin: 5,
};

export const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  meta: "Meta",
  google: "Google",
  instagram: "Instagram",
  amazon: "Amazon",
  youtube: "YouTube",
  facebook: "Facebook",
  pinterest: "Pinterest",
};

export function getClientColor(index: number): string {
  return CLIENT_COLORS[index % CLIENT_COLORS.length];
}

export function getProductColor(name: string): string {
  return PRODUCT_COLORS[name] ?? "#00D4FF";
}

export function getProductSignalCount(name: string): number {
  return PRODUCT_SIGNAL_COUNTS[name] ?? 0;
}

export function formatPlatformLabel(platform: string): string {
  return PLATFORM_LABELS[platform.toLowerCase()] ?? platform;
}

export function sortClientProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    if (a.name === "All Products") return -1;
    if (b.name === "All Products") return 1;
    return a.name.localeCompare(b.name);
  });
}

export function findAllProductsProduct(products: Product[], clientId: string): Product | null {
  return (
    products.find((p) => p.client_id === clientId && p.name === "All Products") ??
    products.find((p) => p.client_id === clientId) ??
    null
  );
}

export function matchesCompetitorName(mockName: string, contextNames: string[]): boolean {
  const lower = mockName.toLowerCase();
  return contextNames.some(
    (name) => lower.includes(name.toLowerCase()) || name.toLowerCase().includes(lower),
  );
}

export function matchesKeyword(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}
