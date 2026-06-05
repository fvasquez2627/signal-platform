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
};

export const MOCK_ACCOUNT_CONNECTED = false;

export const URGENT_ALERT = {
  title: "Competitor launch detected — RivalCo shipped AI briefs",
  subtitle: "High-priority threat · Score impact +14 · Action recommended within 24h",
};

export const STAT_CARDS = {
  signalScore: 82,
  tiktokVelocity: "+34%",
  competitorMoves: 7,
  draftsReady: 5,
  gmv7Day: "$48.2K",
};

export const SIGNALS: Signal[] = [
  {
    id: "1",
    type: "competitor",
    source: "Competitive Intel",
    timestamp: "12m ago",
    title: "RivalCo launched AI content brief generator",
    body: "New landing page positions against your core workflow. Pricing unchanged but feature parity gap widening on brief automation.",
    tags: ["competitor", "product", "high-priority"],
  },
  {
    id: "2",
    type: "opportunity",
    source: "TikTok Trends",
    timestamp: "38m ago",
    title: "Hashtag #ShopWithAI trending +340% WoW",
    body: "Velocity spike in your category. 12 creators in top 50 use product-demo format matching your draft templates.",
    tags: ["tiktok", "trend", "content"],
  },
  {
    id: "3",
    type: "threat",
    source: "News Monitor",
    timestamp: "1h ago",
    title: "Category report flags rising CAC on paid social",
    body: "Industry benchmark shows Meta CPC up 18% QoQ for DTC supplements. May compress ROAS on current creative rotation.",
    tags: ["meta", "paid", "market"],
  },
  {
    id: "4",
    type: "awareness",
    source: "SEO Pulse",
    timestamp: "2h ago",
    title: "New SERP feature: AI overview for brand queries",
    body: "Google testing expanded AI summaries on 3 of your top 10 keywords. Monitor impression share this week.",
    tags: ["seo", "google", "serp"],
  },
  {
    id: "5",
    type: "opportunity",
    source: "Instagram Signals",
    timestamp: "3h ago",
    title: "Reel format outperforming carousel 2.1× on engagement",
    body: "Your connected account shows reels driving 41% more saves. Agent queued 2 reel variants from top-performing hook.",
    tags: ["instagram", "format", "content"],
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
  { id: "1", name: "RivalCo", move: "AI briefs launch", threat: "critical" },
  { id: "2", name: "NovaBrand", move: "TikTok Shop promo", threat: "high" },
  { id: "3", name: "PeakLabs", move: "Pricing page update", threat: "medium" },
  { id: "4", name: "Zenith Co", move: "New influencer cohort", threat: "medium" },
  { id: "5", name: "BaseLine", move: "Blog SEO push", threat: "low" },
];

export const DRAFT_CREATIVE = {
  platform: "TikTok",
  hook: "POV: your competitor just dropped AI briefs and you're still writing hooks manually",
  body: "We tested 47 hooks in 72 hours. This format won — problem → twist → product proof in under 8 seconds.",
  cta: "Link in bio · Shop the bundle · Limited drop ends Sunday",
};

export const PLATFORMS: PlatformMetric[] = [
  {
    id: "tiktok",
    name: "TikTok Shop",
    metric: "GMV (7d)",
    value: "$48.2K",
    change: "+12.4%",
    chart: [40, 55, 48, 62, 58, 71, 68],
    accent: "cyan",
  },
  {
    id: "meta",
    name: "Meta",
    metric: "ROAS",
    value: "3.2×",
    change: "-0.4×",
    chart: [72, 68, 65, 60, 58, 55, 52],
    accent: "purple",
  },
  {
    id: "instagram",
    name: "Instagram",
    metric: "Engagement rate",
    value: "4.8%",
    change: "+0.6%",
    chart: [30, 35, 38, 42, 45, 48, 50],
    accent: "green",
  },
  {
    id: "google",
    name: "Google",
    metric: "Organic clicks",
    value: "12.4K",
    change: "+8.1%",
    chart: [50, 52, 54, 56, 58, 60, 62],
    accent: "yellow",
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
