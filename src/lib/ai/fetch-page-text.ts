const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; SignalBot/1.0; +https://signal.app)",
  Accept: "text/html,application/xhtml+xml",
};

export function stripHtmlToText(html: string, maxLength = 8000): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function extractPageTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match?.[1]) return "";
  return match[1].replace(/\s+/g, " ").trim();
}

export function guessNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const segment = pathname.split("/").filter(Boolean).pop() ?? "";
    if (!segment) return "";
    return segment
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "";
  }
}

export async function fetchPageContent(url: string): Promise<{
  html: string;
  text: string;
  fetchError?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: FETCH_HEADERS,
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      return {
        html: "",
        text: "",
        fetchError: `Failed to fetch URL (${response.status})`,
      };
    }

    const html = await response.text();
    return {
      html,
      text: stripHtmlToText(html),
    };
  } catch (error) {
    return {
      html: "",
      text: "",
      fetchError: error instanceof Error ? error.message : "Failed to fetch URL",
    };
  }
}
