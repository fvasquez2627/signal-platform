import Anthropic from "@anthropic-ai/sdk";
import { extractJsonObject } from "@/lib/ai/parse-json";

const MODEL = "claude-sonnet-4-5";
const MAX_TOKENS = 4096;
const MAX_ROUNDS = 10;

const DEFAULT_RESEARCH_SYSTEM =
  "You are a research analyst. Use web search to find accurate, up-to-date information. Return ONLY valid JSON as requested — no markdown, no backticks, no explanation.";

const WEB_SEARCH_TOOLS: Anthropic.Messages.ToolUnion[] = [
  {
    type: "web_search_20250305",
    name: "web_search",
    max_uses: 5,
  },
];

export function getAnthropicApiKey(): string {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  return apiKey;
}

function getAnthropicClient() {
  return new Anthropic({
    apiKey: getAnthropicApiKey(),
  });
}

function extractTextFromContent(content: Anthropic.Messages.ContentBlock[]): string {
  return content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

function extractTextFromResponses(responses: Anthropic.Message[]): string {
  return responses
    .flatMap((response) => response.content)
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

function extractTextFromLastResponse(responses: Anthropic.Message[]): string {
  const last = responses[responses.length - 1];
  if (!last) return "";
  return extractTextFromContent(last.content);
}

function buildToolResults(
  content: Anthropic.Messages.ContentBlock[],
): Anthropic.Messages.ToolResultBlockParam[] {
  return content
    .filter((block): block is Anthropic.Messages.ToolUseBlock => block.type === "tool_use")
    .map((block) => ({
      type: "tool_result" as const,
      tool_use_id: block.id,
      content:
        typeof block.input === "object" && block.input !== null
          ? JSON.stringify(block.input)
          : String(block.input ?? ""),
    }));
}

async function runWebSearchConversation(
  user: string,
  system?: string,
): Promise<{ text: string; fullText: string; responses: Anthropic.Message[] }> {
  const client = getAnthropicClient();
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: user }];
  const responses: Anthropic.Message[] = [];

  const createMessage = async () => {
    try {
      return await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: system ?? DEFAULT_RESEARCH_SYSTEM,
        tools: WEB_SEARCH_TOOLS,
        messages,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("invalid x-api-key") || message.includes("authentication")) {
        throw new Error(
          "Invalid ANTHROPIC_API_KEY — check that .env.local sets ANTHROPIC_API_KEY=sk-ant-... and restart the dev server",
        );
      }
      throw error;
    }
  };

  let response = await createMessage();
  responses.push(response);

  let rounds = 0;
  while (
    (response.stop_reason === "pause_turn" || response.stop_reason === "tool_use") &&
    rounds < MAX_ROUNDS
  ) {
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason === "tool_use") {
      const toolResults = buildToolResults(response.content);
      if (toolResults.length > 0) {
        messages.push({ role: "user", content: toolResults });
      }
    }

    response = await createMessage();
    responses.push(response);
    rounds++;
  }

  const fullText = extractTextFromResponses(responses);
  const text = extractTextFromLastResponse(responses) || fullText;

  return { text, fullText, responses };
}

/** Research via Claude web search with multi-turn handling for pause_turn / tool_use. */
export async function callClaudeWebResearchText(
  user: string,
  system?: string,
): Promise<{ text: string; fullText: string; responses: Anthropic.Message[] }> {
  return runWebSearchConversation(user, system);
}

/** Research a URL via Claude web search — no direct page scraping. */
export async function callClaudeWebResearch<T>(
  user: string,
  system?: string,
  options?: { url?: string },
): Promise<T> {
  const { text } = await runWebSearchConversation(user, system);

  if (!text.trim()) {
    throw new Error("Empty response from Claude");
  }

  return extractJsonObject<T>(text, { url: options?.url, logPrefix: "[claude]" });
}

export async function callClaudeJson<T>({
  system,
  user,
  pageText,
  url,
}: {
  system: string;
  user: string;
  pageText?: string;
  url?: string;
}): Promise<T> {
  const enrichedUser = pageText?.trim()
    ? `${user}\n\nPage content:\n${pageText}`
    : user;

  const { text } = await runWebSearchConversation(enrichedUser, system);

  if (!text.trim()) {
    throw new Error("Empty response from Claude");
  }

  return extractJsonObject<T>(text, { url, logPrefix: "[claude]" });
}
