export type GscFilter = "all" | "top10" | "opportunities" | "declining";

export type PositionChange = "up" | "down" | "flat" | "new";

export type SearchPresenceRow = {
  id: string;
  keyword: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
  change: PositionChange;
  changeAmount: number;
  category: "top10" | "opportunity" | "declining" | "stable";
};

export type KeywordIntelRow = {
  id: string;
  keyword: string;
  volume: number;
  difficulty: number;
  intent: "informational" | "commercial" | "transactional";
  yourPosition: number | null;
  topCompetitor: string;
  competitorPosition: number;
};

export type AeoQuery = {
  id: string;
  query: string;
  aiOverview: boolean;
  perplexity: boolean;
  chatgpt: boolean;
  recommendation: string;
};

export type PaaQuestion = {
  id: string;
  question: string;
  volume: number;
  contentExists: boolean;
  opportunityScore: number;
};

export type ShoppingRow = {
  id: string;
  product: string;
  competitor: string;
  theirPrice: number;
  yourPrice: number;
  trend: "up" | "down" | "flat";
};

export type ContentGap = {
  id: string;
  topic: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export const SEO_HEALTH_SCORE = {
  score: 74,
  trend: "up" as const,
  change: "+3",
  label: "Solid visibility with AEO gaps to close",
};

export const AI_PRESENCE = {
  appearing: 3,
  tracked: 5,
  label: "Appearing in 3 of 5 tracked queries",
};

export const RECOMMENDED_ACTION =
  "Publish a marine vs bovine collagen comparison guide — rising query (+67% WoW), weak AI Overview coverage, and no authoritative brand-owned answer in top citations.";

export const TOP_KEYWORD_OPPORTUNITIES = [
  {
    keyword: "best adaptogen morning stack",
    detail: "Pos 18 · 4,200/mo · breakout query, low competition",
  },
  {
    keyword: "marine vs bovine collagen",
    detail: "Pos 14 · 2,800/mo · AI Overview gap, +67% trend",
  },
  {
    keyword: "collagen peptides dosage",
    detail: "Pos 22 · 3,400/mo · PAA cluster, no owned content",
  },
];

export const SEARCH_PRESENCE: SearchPresenceRow[] = [
  {
    id: "gsc-1",
    keyword: "collagen peptides",
    position: 4,
    impressions: 8400,
    clicks: 412,
    ctr: 4.9,
    change: "up",
    changeAmount: 2,
    category: "top10",
  },
  {
    id: "gsc-2",
    keyword: "best collagen supplement",
    position: 7,
    impressions: 5200,
    clicks: 198,
    ctr: 3.8,
    change: "flat",
    changeAmount: 0,
    category: "top10",
  },
  {
    id: "gsc-3",
    keyword: "collagen for skin",
    position: 11,
    impressions: 3800,
    clicks: 91,
    ctr: 2.4,
    change: "down",
    changeAmount: 3,
    category: "opportunity",
  },
  {
    id: "gsc-4",
    keyword: "collagen powder benefits",
    position: 6,
    impressions: 6100,
    clicks: 287,
    ctr: 4.7,
    change: "up",
    changeAmount: 1,
    category: "top10",
  },
  {
    id: "gsc-5",
    keyword: "marine vs bovine collagen",
    position: 14,
    impressions: 2800,
    clicks: 42,
    ctr: 1.5,
    change: "up",
    changeAmount: 4,
    category: "opportunity",
  },
  {
    id: "gsc-6",
    keyword: "collagen for joints",
    position: 9,
    impressions: 4400,
    clicks: 156,
    ctr: 3.5,
    change: "down",
    changeAmount: 2,
    category: "top10",
  },
  {
    id: "gsc-7",
    keyword: "best adaptogen morning stack",
    position: 18,
    impressions: 4200,
    clicks: 38,
    ctr: 0.9,
    change: "new",
    changeAmount: 0,
    category: "opportunity",
  },
  {
    id: "gsc-8",
    keyword: "collagen peptides dosage",
    position: 22,
    impressions: 3400,
    clicks: 29,
    ctr: 0.9,
    change: "down",
    changeAmount: 5,
    category: "declining",
  },
  {
    id: "gsc-9",
    keyword: "grass fed collagen",
    position: 8,
    impressions: 2900,
    clicks: 118,
    ctr: 4.1,
    change: "up",
    changeAmount: 1,
    category: "top10",
  },
  {
    id: "gsc-10",
    keyword: "collagen coffee recipe",
    position: 15,
    impressions: 5100,
    clicks: 67,
    ctr: 1.3,
    change: "down",
    changeAmount: 4,
    category: "declining",
  },
];

export const GSC_FILTERS: { id: GscFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "top10", label: "Top 10" },
  { id: "opportunities", label: "Opportunities" },
  { id: "declining", label: "Declining" },
];

export const KEYWORD_INTELLIGENCE: KeywordIntelRow[] = [
  {
    id: "ki-1",
    keyword: "collagen peptides",
    volume: 33100,
    difficulty: 62,
    intent: "commercial",
    yourPosition: 4,
    topCompetitor: "Vital Proteins",
    competitorPosition: 2,
  },
  {
    id: "ki-2",
    keyword: "best collagen supplement",
    volume: 22200,
    difficulty: 71,
    intent: "commercial",
    yourPosition: 7,
    topCompetitor: "Sports Research",
    competitorPosition: 3,
  },
  {
    id: "ki-3",
    keyword: "marine vs bovine collagen",
    volume: 2800,
    difficulty: 38,
    intent: "informational",
    yourPosition: 14,
    topCompetitor: "Healthline",
    competitorPosition: 1,
  },
  {
    id: "ki-4",
    keyword: "collagen for skin",
    volume: 14800,
    difficulty: 58,
    intent: "informational",
    yourPosition: 11,
    topCompetitor: "NeoCell",
    competitorPosition: 5,
  },
  {
    id: "ki-5",
    keyword: "collagen coffee",
    volume: 12100,
    difficulty: 44,
    intent: "transactional",
    yourPosition: null,
    topCompetitor: "Vital Proteins",
    competitorPosition: 4,
  },
];

export const RISING_QUERIES = [
  { query: "best adaptogen morning stack", change: "+340%" },
  { query: "marine vs bovine collagen", change: "+67%" },
  { query: "collagen coffee recipe", change: "+52%" },
  { query: "grass fed collagen benefits", change: "+41%" },
  { query: "collagen peptides dosage", change: "+28%" },
];

export const COMPETITOR_KEYWORD_GAPS = [
  {
    keyword: "collagen for hair growth",
    competitor: "Vital Proteins",
    theirPosition: 3,
    volume: 8900,
  },
  {
    keyword: "unflavored collagen powder",
    competitor: "Sports Research",
    theirPosition: 2,
    volume: 6400,
  },
  {
    keyword: "collagen type 1 and 3",
    competitor: "NeoCell",
    theirPosition: 4,
    volume: 4200,
  },
];

export const AEO_QUERIES: AeoQuery[] = [
  {
    id: "aeo-1",
    query: "collagen peptides",
    aiOverview: true,
    perplexity: true,
    chatgpt: true,
    recommendation: "Maintain FAQ schema on product page; add clinical citation block",
  },
  {
    id: "aeo-2",
    query: "best collagen for joints",
    aiOverview: false,
    perplexity: false,
    chatgpt: true,
    recommendation: "Publish joint-benefits guide with RCT citations — high AEO opportunity",
  },
  {
    id: "aeo-3",
    query: "marine vs bovine collagen",
    aiOverview: true,
    perplexity: true,
    chatgpt: false,
    recommendation: "Expand comparison table; target ChatGPT citations with structured data",
  },
  {
    id: "aeo-4",
    query: "how much collagen per day",
    aiOverview: false,
    perplexity: true,
    chatgpt: false,
    recommendation: "Create dosage calculator + expert-reviewed FAQ",
  },
  {
    id: "aeo-5",
    query: "collagen side effects",
    aiOverview: true,
    perplexity: false,
    chatgpt: true,
    recommendation: "Add compliance-reviewed safety content; legal review recommended",
  },
];

export const PAA_QUESTIONS: PaaQuestion[] = [
  {
    id: "paa-1",
    question: "What is the best time to take collagen?",
    volume: 4400,
    contentExists: false,
    opportunityScore: 92,
  },
  {
    id: "paa-2",
    question: "Is marine collagen better than bovine?",
    volume: 2800,
    contentExists: false,
    opportunityScore: 88,
  },
  {
    id: "paa-3",
    question: "How long does it take for collagen to work?",
    volume: 6200,
    contentExists: true,
    opportunityScore: 54,
  },
  {
    id: "paa-4",
    question: "Can you take collagen while breastfeeding?",
    volume: 3100,
    contentExists: false,
    opportunityScore: 76,
  },
  {
    id: "paa-5",
    question: "Does collagen help with joint pain?",
    volume: 5100,
    contentExists: true,
    opportunityScore: 48,
  },
  {
    id: "paa-6",
    question: "What collagen type is best for skin?",
    volume: 3900,
    contentExists: false,
    opportunityScore: 81,
  },
];

export const SHOPPING_ROWS: ShoppingRow[] = [
  {
    id: "shop-1",
    product: "Collagen Peptides 290g",
    competitor: "Vital Proteins",
    theirPrice: 43.99,
    yourPrice: 39.99,
    trend: "up",
  },
  {
    id: "shop-2",
    product: "Collagen Peptides 290g",
    competitor: "Sports Research",
    theirPrice: 32.95,
    yourPrice: 39.99,
    trend: "down",
  },
  {
    id: "shop-3",
    product: "Collagen Beauty 20oz",
    competitor: "Garden of Life",
    theirPrice: 36.99,
    yourPrice: 39.99,
    trend: "flat",
  },
  {
    id: "shop-4",
    product: "Super Collagen 7oz",
    competitor: "NeoCell",
    theirPrice: 24.99,
    yourPrice: 39.99,
    trend: "down",
  },
  {
    id: "shop-5",
    product: "Multi Collagen 16oz",
    competitor: "Ancient Nutrition",
    theirPrice: 44.95,
    yourPrice: 39.99,
    trend: "up",
  },
];

export const DOMAIN_AUTHORITY = {
  score: 48,
  backlinks: 12400,
  referringDomains: 847,
  trend: [42, 43, 44, 44, 45, 46, 47, 48, 48, 47, 48, 48],
  change: "+6 YoY",
};

export const GOOGLE_TRENDS = {
  months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  values: [62, 58, 64, 71, 68, 74, 78, 72, 69, 76, 82, 88],
  risingQueries: [
    { query: "collagen coffee", change: "+120%" },
    { query: "adaptogen morning stack", change: "+340%" },
    { query: "grass fed collagen", change: "+41%" },
    { query: "collagen gummies vs powder", change: "+28%" },
  ],
  seasonalCallout:
    "Collagen search interest typically peaks in January (+34% vs baseline). Prep content and Shopping bids 3 weeks ahead of New Year resolution traffic.",
};

export const SIDEBAR_INSIGHTS = {
  topOpportunity: {
    keyword: "marine vs bovine collagen",
    detail: "Rising +67% WoW · AI Overview gap · low difficulty (38)",
  },
  biggestThreat: {
    keyword: "collagen peptides",
    detail: "Vital Proteins moved to pos 2 — you dropped from 2 to 4 in 14 days",
  },
  contentGaps: [
    {
      id: "gap-1",
      topic: "Marine vs bovine comparison",
      reason: "No owned content · AI Overview cites Healthline only",
      priority: "high" as const,
    },
    {
      id: "gap-2",
      topic: "Collagen dosage guide",
      reason: "PAA cluster with 6 questions · zero brand answers",
      priority: "high" as const,
    },
    {
      id: "gap-3",
      topic: "Adaptogen morning stack",
      reason: "Breakout query · editorial SERP · 10–14 day window",
      priority: "medium" as const,
    },
    {
      id: "gap-4",
      topic: "Collagen coffee recipes",
      reason: "Trending +52% · competitors publishing UGC-led content",
      priority: "medium" as const,
    },
  ] satisfies ContentGap[],
};

export const INTENT_STYLES: Record<
  KeywordIntelRow["intent"],
  { label: string; className: string }
> = {
  informational: {
    label: "Info",
    className: "bg-[var(--cyan)]/15 text-[var(--cyan)]",
  },
  commercial: {
    label: "Commercial",
    className: "bg-[var(--purple)]/15 text-[var(--purple)]",
  },
  transactional: {
    label: "Transactional",
    className: "bg-[var(--green)]/15 text-[var(--green)]",
  },
};

export function filterSearchPresence(
  rows: SearchPresenceRow[],
  filter: GscFilter,
): SearchPresenceRow[] {
  if (filter === "all") return rows;
  if (filter === "top10") return rows.filter((r) => r.position <= 10);
  if (filter === "opportunities") return rows.filter((r) => r.category === "opportunity");
  return rows.filter((r) => r.category === "declining");
}

export function getShoppingDiff(their: number, yours: number) {
  const diff = yours - their;
  const pct = ((diff / their) * 100).toFixed(1);
  return { diff, pct };
}

export function formatImpressions(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}
