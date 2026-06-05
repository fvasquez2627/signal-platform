import Anthropic from "@anthropic-ai/sdk";
import { extractJsonObject } from "@/lib/ai/parse-json";

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 2000;

async function fetchPageSnippet(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SignalBot/1.0; +https://signal.app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return "";
    const html = await response.text();
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.slice(0, 12_000);
  } catch {
    return "";
  }
}

export async function callClaudeJson<T>({
  system,
  user,
  url,
}: {
  system: string;
  user: string;
  url?: string;
}): Promise<T> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const pageSnippet = url ? await fetchPageSnippet(url) : "";
  const enrichedUser = pageSnippet
    ? `${user}\n\nPage content excerpt from ${url}:\n${pageSnippet}`
    : user;

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 3,
      },
    ],
    messages: [{ role: "user", content: enrichedUser }],
  });

  const textBlocks = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  if (!textBlocks.trim()) {
    throw new Error("Empty response from Claude");
  }

  return extractJsonObject<T>(textBlocks);
}
