export type SignalType = "opportunity" | "threat" | "awareness" | "competitor";

export type SignalFilter = "all" | "opportunity" | "threat" | "competitor";

export type Signal = {
  id: string;
  type: SignalType;
  source: string;
  timestamp: string;
  title: string;
  body: string;
  tags: string[];
  score?: number;
};

export type AgentStatus = {
  id: string;
  name: string;
  progress: number;
  status: "idle" | "running" | "complete";
};

export type Competitor = {
  id: string;
  name: string;
  move: string;
  threat: "low" | "medium" | "high" | "critical";
};

export type PlatformMetric = {
  id: string;
  name: string;
  metric: string;
  value: string;
  change: string;
  chart: number[];
  accent: "cyan" | "green" | "purple" | "yellow";
  integrationKey:
    | "tiktok_shop"
    | "meta_business"
    | "google_ads"
    | null;
};

export const URGENT_ALERT = {
  title: "Competitor launch detected — Vital Proteins shipped Collagen+ Energy",
  subtitle: "High-priority threat · Score impact +14 · Action recommended within 24h",
};

export const STAT_CARDS = {
  signalScore: 82,
  tiktokVelocity: "+34%",
  competitorMoves: 7,
  draftsReady: 12,
  gmv7Day: "$48,200",
  gmvSparkline: [4200, 5800, 6100, 7400, 8200, 9100, 7400],
};

export const SIGNALS: Signal[] = [
  {
    id: "1",
    type: "competitor",
    source: "Meta Ad Library",
    timestamp: "12m ago",
    title: "Vital Proteins scaled 47 new UGC creatives in 72h",
    body: "Meta Ad Library shows Vital Proteins launched 47 new video creatives across US/CA. Primary hooks use problem-agitate-solution with creator-style UGC. Estimated weekly spend up 220% vs prior period.",
    tags: ["competitor", "paid-social", "ugc", "high-priority"],
    score: 94,
  },
  {
    id: "2",
    type: "opportunity",
    source: "TikTok Trends",
    timestamp: "38m ago",
    title: "Hashtag #CollagenCoffee trending +340% WoW",
    body: "Velocity spike in wellness category. 12 creators in top 50 use coffee-ritual demo format matching your draft templates. Sound pairing opportunity detected.",
    tags: ["tiktok", "trend", "content"],
    score: 88,
  },
  {
    id: "3",
    type: "threat",
    source: "Google News",
    timestamp: "1h ago",
    title: "Category report flags rising CAC on paid social",
    body: "Industry benchmark shows Meta CPC up 18% QoQ for DTC supplements. May compress ROAS on current creative rotation without hook refresh.",
    tags: ["meta", "paid", "market"],
    score: 83,
  },
  {
    id: "4",
    type: "awareness",
    source: "PubMed",
    timestamp: "2h ago",
    title: "New RCT on collagen peptides for joint markers",
    body: "PubMed indexed 12-week RCT (n=186) showing statistically significant joint comfort improvements. Study not yet widely cited in consumer content.",
    tags: ["clinical", "ingredient", "credibility"],
    score: 78,
  },
  {
    id: "5",
    type: "opportunity",
    source: "Reddit",
    timestamp: "3h ago",
    title: "r/Supplements thread on mixability goes viral",
    body: "1.2k upvotes discussing powder texture. Your SKU praised in top comments — insertion opportunity for educational comment strategy.",
    tags: ["reddit", "community", "sentiment"],
    score: 74,
  },
];

export const AGENTS: AgentStatus[] = [
  { id: "1", name: "Signal Scraper", progress: 100, status: "complete" },
  { id: "2", name: "Trend Analyzer", progress: 78, status: "running" },
  { id: "3", name: "Competitor Watcher", progress: 100, status: "complete" },
  { id: "4", name: "Content Drafter", progress: 45, status: "running" },
  { id: "5", name: "SEO Monitor", progress: 92, status: "running" },
];

export const COMPETITORS: Competitor[] = [
  { id: "1", name: "Vital Proteins", move: "Collagen+ Energy SKU launch", threat: "critical" },
  { id: "2", name: "Garden of Life", move: "TikTok creator push — 8 signed", threat: "high" },
  { id: "3", name: "NeoCell", move: "Amazon reviews declining on taste", threat: "medium" },
  { id: "4", name: "Sports Research", move: "Google Shopping bids +22%", threat: "medium" },
  { id: "5", name: "Ancient Nutrition", move: "Quiet period — no launches", threat: "low" },
];

export const DRAFT_CREATIVE = {
  platform: "TikTok",
  hook: "POV: you found out your morning coffee was missing one ingredient this whole time 👀",
  body: "Collagen peptides dissolve instantly — you won't taste a thing. But your skin, joints, and hair will feel it in 30 days.",
  cta: "Shop the link → 20% off today only. Comment COFFEE for the link.",
};

export const PLATFORMS: PlatformMetric[] = [
  {
    id: "tiktok",
    name: "TikTok Shop",
    metric: "GMV (7d)",
    value: "$22,400",
    change: "+18%",
    chart: [40, 55, 48, 62, 58, 71, 68],
    accent: "cyan",
    integrationKey: "tiktok_shop",
  },
  {
    id: "meta",
    name: "Meta",
    metric: "ROAS",
    value: "3.8×",
    change: "-0.4×",
    chart: [72, 68, 65, 60, 58, 55, 52],
    accent: "purple",
    integrationKey: "meta_business",
  },
  {
    id: "instagram",
    name: "Instagram",
    metric: "Reach",
    value: "184K",
    change: "+32%",
    chart: [30, 35, 38, 42, 45, 48, 50],
    accent: "green",
    integrationKey: "meta_business",
  },
  {
    id: "google",
    name: "Google",
    metric: "Impressions",
    value: "91K",
    change: "+9%",
    chart: [50, 52, 54, 56, 58, 60, 62],
    accent: "yellow",
    integrationKey: "google_ads",
  },
];

export const SIGNAL_BORDER: Record<SignalType, string> = {
  opportunity: "border-l-[var(--green)]",
  threat: "border-l-[var(--red)]",
  awareness: "border-l-[var(--cyan)]",
  competitor: "border-l-[#FF8C42]",
};

export const THREAT_STYLES: Record<Competitor["threat"], string> = {
  low: "bg-white/10 text-white/60",
  medium: "bg-[var(--yellow)]/15 text-[var(--yellow)]",
  high: "bg-[var(--red)]/15 text-[var(--red)]",
  critical: "bg-[var(--red)]/25 text-[var(--red)] ring-1 ring-[var(--red)]/40",
};

export const PLATFORM_ACCENT: Record<PlatformMetric["accent"], string> = {
  cyan: "text-[var(--cyan)]",
  green: "text-[var(--green)]",
  purple: "text-[var(--purple)]",
  yellow: "text-[var(--yellow)]",
};
