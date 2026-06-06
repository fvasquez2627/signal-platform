import { guessNameFromUrl } from "@/lib/ai/fetch-page-text";

function findBalancedJsonObjects(text: string): string[] {
  const results: string[] = [];
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0 && start >= 0) {
        results.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return results;
}

function countPopulatedFields(value: unknown): number {
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;

  return Object.values(value as Record<string, unknown>).filter((field) => {
    if (Array.isArray(field)) return field.length > 0;
    if (typeof field === "string") return field.trim().length > 0;
    return field != null;
  }).length;
}

export function extractJsonObject<T>(
  text: string,
  options?: { url?: string; logPrefix?: string },
): T {
  const logPrefix = options?.logPrefix ?? "[claude]";
  const trimmed = text.trim();

  console.log(`${logPrefix} full text response:`, trimmed);
  console.log(`${logPrefix} attempting JSON parse`);

  // Method 1: direct parse
  try {
    const parsed = JSON.parse(trimmed) as T;
    console.log(`${logPrefix} parsed via direct JSON.parse`);
    return parsed;
  } catch {
    // continue
  }

  // Method 2: extract from code block
  const fenceMatch = trimmed.match(/```json\n?([\s\S]*?)\n?```/i);
  if (fenceMatch?.[1]) {
    try {
      const parsed = JSON.parse(fenceMatch[1].trim()) as T;
      console.log(`${logPrefix} parsed via json code fence`);
      return parsed;
    } catch {
      // continue
    }
  }

  const genericFence = trimmed.match(/```\n?([\s\S]*?)\n?```/);
  if (genericFence?.[1]) {
    try {
      const parsed = JSON.parse(genericFence[1].trim()) as T;
      console.log(`${logPrefix} parsed via generic code fence`);
      return parsed;
    } catch {
      // continue
    }
  }

  // Method 3: find JSON objects (prefer the most populated valid object)
  const candidates = findBalancedJsonObjects(trimmed);
  let best: T | null = null;
  let bestScore = -1;

  for (const candidate of candidates.reverse()) {
    try {
      const parsed = JSON.parse(candidate) as T;
      const score = countPopulatedFields(parsed);
      if (score > bestScore) {
        best = parsed;
        bestScore = score;
      }
    } catch {
      // try next candidate
    }
  }

  if (best && bestScore > 0) {
    console.log(`${logPrefix} parsed via balanced JSON object (score ${bestScore})`);
    return best;
  }

  if (best) {
    console.log(`${logPrefix} parsed sparse JSON object (score 0)`);
    return best;
  }

  // Method 4: partial fallback
  console.log(`${logPrefix} could not parse JSON from:`, trimmed.slice(0, 500));

  if (options?.url) {
    return { name: guessNameFromUrl(options.url) } as T;
  }

  throw new Error("Could not parse JSON from model response");
}
