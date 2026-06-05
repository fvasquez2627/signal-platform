export const PERFORMANCE_SCORE = {
  score: 78,
  trend: "up" as const,
  change: "+6",
};

export const SUMMARY = {
  gmv: "$48,200",
  gmvChange: "+18%",
  gmvPeriod: "this week",
  topPlatform: "TikTok Shop",
  bestContent: "#CollagenCoffee hook — 340K views",
};

export const TIKTOK_SHOP = {
  gmvChart: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [4200, 5800, 6100, 7400, 8200, 9100, 7400],
  },
  metrics: {
    totalGmv: "$48,200",
    orders: "1,847",
    aov: "$26.10",
    convRate: "3.2%",
  },
  topProducts: [
    {
      id: "p1",
      name: "Collagen 290g",
      gmv: "$22,400",
      orders: 847,
      change: "+18%",
      direction: "up" as const,
    },
    {
      id: "p2",
      name: "Collagen 180g",
      gmv: "$12,800",
      orders: 492,
      change: "+12%",
      direction: "up" as const,
    },
    {
      id: "p3",
      name: "Bundle Pack",
      gmv: "$8,400",
      orders: 124,
      change: "+34%",
      direction: "up" as const,
    },
    {
      id: "p4",
      name: "Collagen Gummies",
      gmv: "$3,200",
      orders: 312,
      change: "-4%",
      direction: "down" as const,
    },
    {
      id: "p5",
      name: "Travel Pack",
      gmv: "$1,400",
      orders: 272,
      change: "+8%",
      direction: "up" as const,
    },
  ],
  topCreators: [
    {
      id: "c1",
      handle: "@creator1",
      gmv: "$8,400",
      orders: 312,
      convRate: "4.2%",
    },
    {
      id: "c2",
      handle: "@creator2",
      gmv: "$6,200",
      orders: 241,
      convRate: "3.8%",
    },
    {
      id: "c3",
      handle: "@wellnessjess",
      gmv: "$5,100",
      orders: 198,
      convRate: "3.5%",
    },
    {
      id: "c4",
      handle: "@morningritual",
      gmv: "$4,800",
      orders: 176,
      convRate: "4.0%",
    },
    {
      id: "c5",
      handle: "@collagencoffee",
      gmv: "$3,900",
      orders: 142,
      convRate: "3.9%",
    },
  ],
};

export const META_ADS = {
  roasTrend: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [4.2, 4.0, 3.9, 4.1, 3.8, 3.6, 3.8],
  },
  metrics: {
    spend: "$12,400",
    impressions: "847K",
    cpm: "$14.60",
    ctr: "2.3%",
    roas: "3.8×",
  },
  topAd: {
    title: "Before/After skin hook",
    roas: "5.2×",
    description: "UGC testimonial — 30-day skin transformation with daily collagen ritual",
  },
};

export const INSTAGRAM = {
  reach: "184K",
  reachChange: "+32%",
  engagementRate: "4.8%",
  topReel: "Morning routine collagen — 47K views",
  followerGrowth: "+1,247 this week",
  bestTimeToPost: "Tuesday 7–9am",
};

export const GOOGLE_ADS = {
  impressions: "91,400",
  impressionsChange: "+9%",
  clicks: "4,200",
  ctr: "4.6%",
  avgPosition: "3.2",
  topKeyword: {
    term: "collagen peptides",
    clicks: "1,847",
  },
};

export type ContentRow = {
  id: string;
  platform: "TikTok" | "Instagram" | "Meta" | "Google";
  hook: string;
  views: number;
  engagement: number;
  conversions: number;
  revenue: number;
};

export const CONTENT_PERFORMANCE: ContentRow[] = [
  {
    id: "1",
    platform: "TikTok",
    hook: "POV: you found out your morning coffee was missing one ingredient…",
    views: 340000,
    engagement: 8.4,
    conversions: 412,
    revenue: 10800,
  },
  {
    id: "2",
    platform: "Instagram",
    hook: "Morning routine collagen — 30 days in",
    views: 47000,
    engagement: 6.2,
    conversions: 89,
    revenue: 2340,
  },
  {
    id: "3",
    platform: "Meta",
    hook: "Before/After skin hook — real results in 30 days",
    views: 128000,
    engagement: 3.8,
    conversions: 156,
    revenue: 4680,
  },
  {
    id: "4",
    platform: "TikTok",
    hook: "I replaced my afternoon snack with this collagen blend",
    views: 89000,
    engagement: 7.1,
    conversions: 98,
    revenue: 2540,
  },
  {
    id: "5",
    platform: "Google",
    hook: "Best collagen supplement for skin — clinical grade",
    views: 42000,
    engagement: 4.6,
    conversions: 124,
    revenue: 3720,
  },
  {
    id: "6",
    platform: "TikTok",
    hook: "#CollagenCoffee trend — here's what actually works",
    views: 215000,
    engagement: 9.2,
    conversions: 287,
    revenue: 7480,
  },
  {
    id: "7",
    platform: "Instagram",
    hook: "Dermatologist explains why collagen timing matters",
    views: 62000,
    engagement: 5.4,
    conversions: 67,
    revenue: 1740,
  },
  {
    id: "8",
    platform: "Meta",
    hook: "3 reasons athletes are switching to collagen peptides",
    views: 94000,
    engagement: 2.9,
    conversions: 78,
    revenue: 2340,
  },
  {
    id: "9",
    platform: "TikTok",
    hook: "Travel pack review — gym bag essential",
    views: 38000,
    engagement: 6.8,
    conversions: 45,
    revenue: 1170,
  },
  {
    id: "10",
    platform: "Google",
    hook: "Collagen peptides powder — mixability test",
    views: 28000,
    engagement: 3.2,
    conversions: 52,
    revenue: 1560,
  },
];

export const SIDEBAR = {
  weekOverWeek: [
    { label: "GMV", value: "↑18%", direction: "up" as const },
    { label: "ROAS", value: "↓0.4×", direction: "down" as const, watch: true },
    { label: "Reach", value: "↑32%", direction: "up" as const },
  ],
  topRecommendation:
    "ROAS declining — rotate Meta creative. Agent has 3 new variants ready → Review",
  nextOpportunity:
    "TikTok Shop GMV peaks Tuesday. Schedule top creator content for Monday evening.",
};

export const PLATFORM_ACCENT = {
  cyan: "text-[var(--cyan)]",
  green: "text-[var(--green)]",
  purple: "text-[var(--purple)]",
  yellow: "text-[var(--yellow)]",
} as const;

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function formatCurrency(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}
