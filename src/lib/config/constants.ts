export const PLATFORM_OPTIONS = [
  "TikTok",
  "Meta",
  "Instagram",
  "Google",
  "Amazon",
  "YouTube",
  "Pinterest",
  "Facebook",
] as const;

export const MONTH_OPTIONS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function normalizePlatform(value: string): string {
  const lower = value.toLowerCase();
  const map: Record<string, string> = {
    tiktok: "TikTok",
    meta: "Meta",
    instagram: "Instagram",
    google: "Google",
    amazon: "Amazon",
    youtube: "YouTube",
    pinterest: "Pinterest",
    facebook: "Facebook",
  };
  return map[lower] ?? value;
}

export function normalizePlatforms(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const v of values) {
    const n = normalizePlatform(v);
    const key = n.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(n);
    }
  }
  return result;
}

export function platformsToStorage(values: string[]): string[] {
  return values.map((v) => v.toLowerCase());
}
