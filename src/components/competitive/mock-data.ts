export type ThreatLevel = "critical" | "high" | "medium" | "low";

export type Competitor = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  threat: ThreatLevel;
  lastActivity: string;
  activitySummary: string;
  metrics: {
    activeAds: number;
    estSpend: string;
    tiktokPosts: number;
    amazonRating: string;
  };
  recentMoves: string[];
};

export type MetaAd = {
  id: string;
  competitorId: string;
  competitorName: string;
  format: string;
  hook: string;
  spendRange: string;
  daysRunning: number;
  platforms: ("Meta" | "Instagram" | "TikTok")[];
};

export type PricingRow = {
  id: string;
  competitor: string;
  product: string;
  theirPrice: number;
  yourPrice: number;
  lastChanged: string;
  direction: "up" | "down" | "flat";
};

export type ShareOfVoice = {
  name: string;
  tiktok: number;
  meta: number;
  google: number;
  isYou?: boolean;
};

export const PRESSURE_SCORE = {
  score: 74,
  trend: "up" as const,
  change: "+8",
};

export const RECOMMENDED_ACTION =
  "Launch counter-brief for Vital Proteins SKU launch — prioritize TikTok UGC hooks emphasizing your collagen sourcing story before their creator wave peaks.";

export const TOP_MOVES = [
  {
    competitor: "Vital Proteins",
    move: "Launched Collagen+ Energy SKU with 12 new Meta creatives in 48h",
  },
  {
    competitor: "Garden of Life",
    move: "Signed 8 mid-tier TikTok creators for 30-day ritual challenge",
  },
  {
    competitor: "Sports Research",
    move: "Increased Google Shopping bids 22% on top 5 collagen keywords",
  },
];

export const THREAT_STYLES: Record<
  ThreatLevel,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-[var(--red)]/25 text-[var(--red)] ring-1 ring-[var(--red)]/40",
  },
  high: {
    label: "High",
    className: "bg-[var(--red)]/15 text-[var(--red)]",
  },
  medium: {
    label: "Medium",
    className: "bg-[var(--yellow)]/15 text-[var(--yellow)]",
  },
  low: {
    label: "Low",
    className: "bg-white/10 text-white/60",
  },
};

export const COMPETITORS: Competitor[] = [
  {
    id: "vital",
    name: "Vital Proteins",
    initials: "VP",
    avatarColor: "#FF3B5C",
    threat: "critical",
    lastActivity: "2h ago",
    activitySummary: "New SKU launch — Collagen+ Energy with aggressive Meta rollout",
    metrics: {
      activeAds: 47,
      estSpend: "$84K/wk",
      tiktokPosts: 23,
      amazonRating: "4.6★",
    },
    recentMoves: [
      "Launched Collagen+ Energy SKU on Amazon and DTC",
      "Deployed 47 new Meta video ads in 72 hours",
      "Partnered with 3 macro fitness influencers",
    ],
  },
  {
    id: "garden",
    name: "Garden of Life",
    initials: "GL",
    avatarColor: "#00E887",
    threat: "high",
    lastActivity: "5h ago",
    activitySummary: "TikTok creator push — 8 creators signed for ritual challenge",
    metrics: {
      activeAds: 31,
      estSpend: "$52K/wk",
      tiktokPosts: 41,
      amazonRating: "4.5★",
    },
    recentMoves: [
      "Signed 8 mid-tier TikTok creators for 30-day challenge",
      "Posted 12 new reels using #MorningRitualStack sound",
      "Launched bundle promo on TikTok Shop",
    ],
  },
  {
    id: "neocell",
    name: "NeoCell",
    initials: "NC",
    avatarColor: "#B97FFF",
    threat: "medium",
    lastActivity: "1d ago",
    activitySummary: "Review decline — Amazon sentiment slipping on taste complaints",
    metrics: {
      activeAds: 18,
      estSpend: "$28K/wk",
      tiktokPosts: 9,
      amazonRating: "4.2★",
    },
    recentMoves: [
      "Amazon rating dropped 4.4 → 4.2 over 30 days",
      "Negative review cluster around “gritty texture”",
      "Reduced Meta spend 15% week-over-week",
    ],
  },
  {
    id: "sports",
    name: "Sports Research",
    initials: "SR",
    avatarColor: "#00D4FF",
    threat: "medium",
    lastActivity: "8h ago",
    activitySummary: "Google Shopping bid increase on core collagen keywords",
    metrics: {
      activeAds: 24,
      estSpend: "$38K/wk",
      tiktokPosts: 14,
      amazonRating: "4.7★",
    },
    recentMoves: [
      "Increased Google Shopping bids 22% on top 5 keywords",
      "New comparison landing page vs category leaders",
      "Added free-shipping threshold promo",
    ],
  },
  {
    id: "ancient",
    name: "Ancient Nutrition",
    initials: "AN",
    avatarColor: "#FFD426",
    threat: "low",
    lastActivity: "4d ago",
    activitySummary: "Quiet period — no major launches or ad scaling detected",
    metrics: {
      activeAds: 8,
      estSpend: "$11K/wk",
      tiktokPosts: 3,
      amazonRating: "4.4★",
    },
    recentMoves: [
      "Maintained existing ad set rotation — no new creatives",
      "Blog post on bone broth benefits (low traffic)",
      "No TikTok activity in last 7 days",
    ],
  },
];

export const META_ADS: MetaAd[] = [
  {
    id: "ad-1",
    competitorId: "vital",
    competitorName: "Vital Proteins",
    format: "UGC Video",
    hook: "I replaced my morning coffee with this collagen energy blend",
    spendRange: "$12K–$18K",
    daysRunning: 4,
    platforms: ["Meta", "Instagram"],
  },
  {
    id: "ad-2",
    competitorId: "vital",
    competitorName: "Vital Proteins",
    format: "Carousel",
    hook: "New Collagen+ Energy — 3 reasons athletes are switching",
    spendRange: "$8K–$14K",
    daysRunning: 6,
    platforms: ["Meta", "Instagram"],
  },
  {
    id: "ad-3",
    competitorId: "garden",
    competitorName: "Garden of Life",
    format: "Reel",
    hook: "30-day ritual challenge — day 1 morning routine",
    spendRange: "$5K–$9K",
    daysRunning: 12,
    platforms: ["Instagram", "TikTok"],
  },
  {
    id: "ad-4",
    competitorId: "garden",
    competitorName: "Garden of Life",
    format: "UGC Video",
    hook: "POV: your supplement drawer finally makes sense",
    spendRange: "$4K–$7K",
    daysRunning: 9,
    platforms: ["Meta", "TikTok"],
  },
  {
    id: "ad-5",
    competitorId: "sports",
    competitorName: "Sports Research",
    format: "Static",
    hook: "Clinically studied collagen — see the difference",
    spendRange: "$3K–$6K",
    daysRunning: 21,
    platforms: ["Meta"],
  },
  {
    id: "ad-6",
    competitorId: "neocell",
    competitorName: "NeoCell",
    format: "Video",
    hook: "Beauty starts from within — collagen peptides daily",
    spendRange: "$2K–$4K",
    daysRunning: 18,
    platforms: ["Meta", "Instagram"],
  },
];

export const PRICING_ROWS: PricingRow[] = [
  {
    id: "p1",
    competitor: "Vital Proteins",
    product: "Collagen Peptides 20oz",
    theirPrice: 43.99,
    yourPrice: 39.99,
    lastChanged: "3d ago",
    direction: "up",
  },
  {
    id: "p2",
    competitor: "Garden of Life",
    product: "Collagen Beauty 20oz",
    theirPrice: 36.99,
    yourPrice: 39.99,
    lastChanged: "1w ago",
    direction: "flat",
  },
  {
    id: "p3",
    competitor: "Sports Research",
    product: "Collagen Peptides 16oz",
    theirPrice: 32.95,
    yourPrice: 39.99,
    lastChanged: "5d ago",
    direction: "down",
  },
  {
    id: "p4",
    competitor: "NeoCell",
    product: "Super Collagen 7oz",
    theirPrice: 24.99,
    yourPrice: 39.99,
    lastChanged: "2w ago",
    direction: "flat",
  },
  {
    id: "p5",
    competitor: "Ancient Nutrition",
    product: "Multi Collagen 16oz",
    theirPrice: 44.95,
    yourPrice: 39.99,
    lastChanged: "12d ago",
    direction: "up",
  },
];

export const SHARE_OF_VOICE: ShareOfVoice[] = [
  { name: "Vital Proteins", tiktok: 28, meta: 32, google: 24 },
  { name: "Garden of Life", tiktok: 22, meta: 18, google: 14 },
  { name: "Your Brand", tiktok: 18, meta: 15, google: 20, isYou: true },
  { name: "Sports Research", tiktok: 12, meta: 16, google: 18 },
  { name: "NeoCell", tiktok: 10, meta: 12, google: 11 },
  { name: "Ancient Nutrition", tiktok: 6, meta: 5, google: 8 },
];

export const SIDEBAR_INSIGHTS = {
  mostActive: { name: "Vital Proteins", detail: "47 active ads · $84K/wk est. spend" },
  biggestThreat: {
    name: "Vital Proteins",
    detail: "Collagen+ Energy SKU launch with rapid Meta scaling",
  },
  opportunity: {
    name: "NeoCell",
    detail: "Amazon rating decline on taste — capture switchers with texture messaging",
  },
  categoryAdSpend: { direction: "up" as const, change: "+14% WoW" },
};

export function getPriceDiff(their: number, yours: number) {
  const diff = yours - their;
  const pct = ((diff / their) * 100).toFixed(1);
  return { diff, pct, label: diff > 0 ? "overpriced" : diff < 0 ? "underpriced" : "matched" };
}

export type FormatBreakdownRow = {
  label: string;
  pct: number;
};

export type SpendRow = {
  name: string;
  spend: string;
  amountK: number;
  isYou?: boolean;
};

export type CategoryGap = {
  id: string;
  level: "high" | "medium";
  title: string;
  description: string;
  actionLabel: string;
  contentHref: string;
};

export type HookIntelRow = {
  hookType: string;
  pctWinning: number;
  avgReach: string;
  hasCoverage: boolean;
  actionLabel: string;
  contentHref: string;
};

export type LongRunningAd = {
  id: string;
  competitor: string;
  daysRunning: number;
  platforms: string[];
  hook: string;
  format: string;
  reach: string;
  whyWorking: string;
};

export const FORMAT_BREAKDOWN: FormatBreakdownRow[] = [
  { label: "Before/After UGC", pct: 54 },
  { label: "Product Demo", pct: 22 },
  { label: "Founder Story", pct: 15 },
  { label: "Tutorial/Education", pct: 9 },
];

export const FORMAT_INTEL = {
  winningFormat: "Before/After UGC",
  winningPct: 54,
  avgLength: "18-22 sec",
  topHookType: "Problem identification",
  topCta: '"Link in bio" (61%)',
  insight:
    "Morning routine integration is trending but unclaimed by any major collagen brand",
  draftReadyLabel: "Your morning routine draft is ready",
  draftHref: "/content?tab=tiktok&bucket=1",
};

export const SPEND_INTELLIGENCE: SpendRow[] = [
  { name: "Vital Proteins", spend: "$84K/wk", amountK: 84 },
  { name: "Garden of Life", spend: "$52K/wk", amountK: 52 },
  { name: "Sports Research", spend: "$38K/wk", amountK: 38 },
  { name: "NeoCell", spend: "$28K/wk", amountK: 28 },
  { name: "Ancient Nutrition", spend: "$11K/wk", amountK: 11 },
  { name: "YouTheory", spend: "$22K/wk", amountK: 22, isYou: true },
];

export const SPEND_INSIGHT =
  "Vital Proteins increased spend 220% this week — likely testing new SKU launch";

export const CATEGORY_GAPS: CategoryGap[] = [
  {
    id: "gap-1",
    level: "high",
    title: "Clinical credibility angle",
    description:
      "Only 8% of ads reference studies or clinical backing. You have a new peer-reviewed study supporting your claims.",
    actionLabel: "Draft using this angle →",
    contentHref: "/content?tab=meta&bucket=4",
  },
  {
    id: "gap-2",
    level: "high",
    title: "Mixability/dissolve demo",
    description:
      "NeoCell losing customers over taste. No competitor is showing dissolve proof. You could own this.",
    actionLabel: "Draft using this angle →",
    contentHref: "/content?tab=tiktok&bucket=2",
  },
  {
    id: "gap-3",
    level: "medium",
    title: "Collagen + coffee ritual",
    description: "#CollagenCoffee trending organically. No brand has claimed it yet.",
    actionLabel: "Draft ready — review →",
    contentHref: "/content?tab=tiktok&bucket=1",
  },
];

export const HOOK_INTELLIGENCE: HookIntelRow[] = [
  {
    hookType: "Problem identification opening",
    pctWinning: 38,
    avgReach: "47K",
    hasCoverage: true,
    actionLabel: "View yours",
    contentHref: "/content?tab=tiktok",
  },
  {
    hookType: "Before/After promise",
    pctWinning: 29,
    avgReach: "52K",
    hasCoverage: false,
    actionLabel: "Create draft",
    contentHref: "/content?tab=tiktok&bucket=2",
  },
  {
    hookType: "Authority/Clinical",
    pctWinning: 18,
    avgReach: "31K",
    hasCoverage: false,
    actionLabel: "Create draft",
    contentHref: "/content?tab=meta&bucket=4",
  },
  {
    hookType: "Trend/Sound hook",
    pctWinning: 15,
    avgReach: "89K",
    hasCoverage: true,
    actionLabel: "View yours",
    contentHref: "/content?tab=tiktok&bucket=1",
  },
];

export const LONG_RUNNING_ADS: LongRunningAd[] = [
  {
    id: "lr-1",
    competitor: "Vital Proteins",
    daysRunning: 73,
    platforms: ["Meta", "Instagram"],
    hook: "I tried collagen for 60 days...",
    format: "UGC testimonial, 22 seconds",
    reach: "890K unique users",
    whyWorking:
      "Long-form testimonial builds trust. 60-day frame sets realistic expectations.",
  },
  {
    id: "lr-2",
    competitor: "Garden of Life",
    daysRunning: 61,
    platforms: ["TikTok"],
    hook: "My morning routine changed everything",
    format: "Day-in-life, 31 seconds",
    reach: "445K unique users",
    whyWorking:
      "Lifestyle integration removes supplement stigma. Relatable setting.",
  },
  {
    id: "lr-3",
    competitor: "Sports Research",
    daysRunning: 58,
    platforms: ["Meta"],
    hook: "Doctor recommended this to me",
    format: "Authority/UGC hybrid, 18 seconds",
    reach: "312K unique users",
    whyWorking:
      "Authority hook with UGC delivery combines trust signals effectively.",
  },
];
