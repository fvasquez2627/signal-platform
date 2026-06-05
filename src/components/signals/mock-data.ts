export type SignalType = "opportunity" | "threat" | "awareness" | "competitor";

export type SignalChannel = "search" | "social" | "retail" | "pr";

export type SignalSource =
  | "TikTok Trends"
  | "Meta Ad Library"
  | "Google Trends"
  | "Amazon Reviews"
  | "Reddit"
  | "PubMed"
  | "Google News"
  | "Instagram Signals"
  | "People Also Ask";

export type DetailFilter =
  | "all"
  | "opportunity"
  | "threat"
  | "awareness"
  | "competitor"
  | "search"
  | "social"
  | "retail"
  | "pr";

export type FeedSignal = {
  id: string;
  type: SignalType;
  source: SignalSource;
  channels: SignalChannel[];
  timestamp: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  score: number;
  priority: "high" | "medium" | "low";
};

export const LAST_UPDATED = "Today, 2:14 PM";

export const QUICK_STATS = {
  totalToday: 47,
  highPriority: 8,
  newSinceLastRun: 14,
};

export const TRENDING_KEYWORDS = [
  { term: "adaptogen stack", change: "+124%" },
  { term: "morning ritual powder", change: "+89%" },
  { term: "gut health gummies", change: "+67%" },
  { term: "clean label supplements", change: "+41%" },
  { term: "tiktok shop bundle", change: "+38%" },
];

export const SIGNAL_BORDER: Record<SignalType, string> = {
  opportunity: "border-l-[var(--green)]",
  threat: "border-l-[var(--red)]",
  awareness: "border-l-[var(--cyan)]",
  competitor: "border-l-[#FF8C42]",
};

export const TYPE_TAG: Record<SignalType, { label: string; className: string }> = {
  opportunity: {
    label: "Opportunity",
    className: "bg-[var(--green)]/15 text-[var(--green)]",
  },
  threat: {
    label: "Threat",
    className: "bg-[var(--red)]/15 text-[var(--red)]",
  },
  awareness: {
    label: "Awareness",
    className: "bg-[var(--cyan)]/15 text-[var(--cyan)]",
  },
  competitor: {
    label: "Competitor",
    className: "bg-[#FF8C42]/15 text-[#FF8C42]",
  },
};

export const SOURCE_BADGE: Record<SignalSource, string> = {
  "TikTok Trends": "bg-[var(--cyan)]/15 text-[var(--cyan)]",
  "Meta Ad Library": "bg-[var(--purple)]/15 text-[var(--purple)]",
  "Google Trends": "bg-[var(--yellow)]/15 text-[var(--yellow)]",
  "Amazon Reviews": "bg-[var(--green)]/10 text-[var(--green)]",
  Reddit: "bg-[#FF8C42]/15 text-[#FF8C42]",
  PubMed: "bg-white/10 text-white/70",
  "Google News": "bg-[var(--red)]/10 text-[var(--red)]",
  "Instagram Signals": "bg-[var(--purple)]/10 text-[var(--purple)]",
  "People Also Ask": "bg-[var(--cyan)]/10 text-[var(--cyan)]",
};

export const DETAIL_FILTERS: { id: DetailFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "opportunity", label: "Opportunity" },
  { id: "threat", label: "Threat" },
  { id: "awareness", label: "Awareness" },
  { id: "competitor", label: "Competitor" },
  { id: "search", label: "Search" },
  { id: "social", label: "Social" },
  { id: "retail", label: "Retail" },
  { id: "pr", label: "PR" },
];

export const FEED_SIGNALS: FeedSignal[] = [
  {
    id: "sig-01",
    type: "competitor",
    source: "Meta Ad Library",
    channels: ["social"],
    timestamp: "8m ago",
    title: "RivalCo scaled UGC ad spend 3.2× in 72 hours",
    summary: "47 new active creatives detected; hook patterns mirror your top-performing TikTok format.",
    body: "Meta Ad Library shows RivalCo launched 47 new video creatives across US/CA in the last 72 hours. Primary hooks use problem-agitate-solution structure with creator-style UGC. Estimated weekly spend up 220% vs prior period. Three ads reuse your branded hashtag phrasing.",
    tags: ["competitor", "paid-social", "ugc", "high-priority"],
    score: 94,
    priority: "high",
  },
  {
    id: "sig-02",
    type: "opportunity",
    source: "Google Trends",
    channels: ["search"],
    timestamp: "22m ago",
    title: "Breakout query: “best adaptogen morning stack”",
    summary: "Search interest up 340% WoW; low paid competition on core variant keywords.",
    body: "Google Trends flags “best adaptogen morning stack” crossing breakout threshold in US wellness segment. Related queries show purchase intent (“where to buy”, “powder vs capsule”). Current top SERP is editorial listicles — weak brand-owned content. Window estimated 10–14 days before competitors publish.",
    tags: ["seo", "breakout", "content-gap"],
    score: 91,
    priority: "high",
  },
  {
    id: "sig-03",
    type: "competitor",
    source: "Google News",
    channels: ["pr"],
    timestamp: "41m ago",
    title: "NovaBrand closes $18M Series B — expansion into TikTok Shop",
    summary: "Press coverage positions them as category leader in ritual-based supplements.",
    body: "TechCrunch and industry trades report NovaBrand’s Series B with explicit TikTok Shop expansion plans. Messaging emphasizes “daily ritual” positioning overlapping your hero SKU narrative. Expect increased creator spend and bundle promos within 30 days.",
    tags: ["competitor", "funding", "pr", "tiktok-shop"],
    score: 89,
    priority: "high",
  },
  {
    id: "sig-04",
    type: "opportunity",
    source: "TikTok Trends",
    channels: ["social"],
    timestamp: "1h ago",
    title: "Hashtag #MorningRitualStack velocity +280% WoW",
    summary: "12 top creators in category using demo + testimonial hybrid format.",
    body: "TikTok Trends reports #MorningRitualStack entering top 50 wellness hashtags. Sound “Soft Start 02” paired in 34% of top-performing posts. Median view-to-save ratio 2.1× category average. Agent matched 3 draft templates to dominant edit pacing (hook <2s, product at 4s).",
    tags: ["tiktok", "hashtag", "trend", "content"],
    score: 88,
    priority: "high",
  },
  {
    id: "sig-05",
    type: "opportunity",
    source: "Instagram Signals",
    channels: ["social"],
    timestamp: "1h ago",
    title: "Reel saves up 52% on carousel-to-reel migration test",
    summary: "Your account’s reel format outperforming static posts for hero SKU.",
    body: "Instagram Signals shows reels featuring product-in-use sequences driving 52% more saves vs carousel benchmarks over 7 days. Top hook: “What I wish I knew before…” format. Comments skew toward dosage/timing questions — FAQ content opportunity.",
    tags: ["instagram", "reels", "engagement"],
    score: 85,
    priority: "medium",
  },
  {
    id: "sig-06",
    type: "threat",
    source: "Amazon Reviews",
    channels: ["retail"],
    timestamp: "2h ago",
    title: "Competitor SKU review velocity spike — sentiment improving",
    summary: "PeakLabs 4.6★ average on 240 new reviews in 14 days; “taste” complaints down.",
    body: "Amazon Reviews monitor detected 240 new reviews on PeakLabs flagship powder (14 days), average 4.6★ up from 4.2★. Negative “taste” mentions dropped 31%. Review text highlights “mixes easily” and “subscription value” — messaging you can counter with texture/sourcing proof points.",
    tags: ["amazon", "competitor", "reviews", "retail"],
    score: 81,
    priority: "medium",
  },
  {
    id: "sig-07",
    type: "threat",
    source: "Meta Ad Library",
    channels: ["social"],
    timestamp: "2h ago",
    title: "Category CPM benchmark up 18% on Meta",
    summary: "Wellness DTC cohort seeing compressed ROAS on broad targeting.",
    body: "Aggregated Meta Ad Library benchmarks for wellness DTC show median CPM up 18% QoQ. Creative fatigue signals on static product-on-white formats. Recommendation: rotate UGC hooks and tighten lookalike stacks; test advantage+ shopping campaigns.",
    tags: ["meta", "cpm", "paid", "benchmark"],
    score: 83,
    priority: "medium",
  },
  {
    id: "sig-08",
    type: "opportunity",
    source: "PubMed",
    channels: ["search", "pr"],
    timestamp: "3h ago",
    title: "New RCT on ashwagandha + L-theanine stack for stress markers",
    summary: "Peer-reviewed study supports hero ingredient pairing; citeable for content.",
    body: "PubMed indexed a 12-week RCT (n=186) showing statistically significant cortisol reduction with ashwagandha + L-theanine stack — matches your hero formulation narrative. Study not yet widely cited in consumer content. Opportunity for science-led landing page and creator brief footnotes.",
    tags: ["clinical", "ingredient", "content", "credibility"],
    score: 78,
    priority: "medium",
  },
  {
    id: "sig-09",
    type: "awareness",
    source: "People Also Ask",
    channels: ["search"],
    timestamp: "3h ago",
    title: "New PAA cluster: “adaptogens while breastfeeding”",
    summary: "12 related questions emerged on high-volume head terms.",
    body: "People Also Ask expansion detected on “adaptogen supplements” head terms — new cluster around safety, breastfeeding, and timing. No authoritative brand content in top answers. Compliance-sensitive topic; legal review recommended before content production.",
    tags: ["paa", "seo", "compliance"],
    score: 76,
    priority: "medium",
  },
  {
    id: "sig-10",
    type: "opportunity",
    source: "Amazon Reviews",
    channels: ["retail"],
    timestamp: "4h ago",
    title: "Your SKU “texture/mixability” praise up 24%",
    summary: "Review theme alignment with upcoming TikTok creative angle.",
    body: "Your flagship SKU shows 24% increase in positive mentions of “mixes easily” and “no grit” over 30 days. Frequently co-mentioned with “morning routine”. Aligns with drafted TikTok hook emphasizing blender-free prep.",
    tags: ["amazon", "sentiment", "owned-sku"],
    score: 74,
    priority: "low",
  },
  {
    id: "sig-11",
    type: "awareness",
    source: "Reddit",
    channels: ["social"],
    timestamp: "5h ago",
    title: "r/Supplements thread: “stacking adaptogens — what actually works?”",
    summary: "1.2k upvotes; comment sentiment neutral-to-curious on category.",
    body: "Reddit monitor flagged high-engagement thread in r/Supplements discussing adaptogen stacking efficacy. Top comments request third-party testing and transparent dosing. Brand mentions: 2 competitors by name, your brand not mentioned — insertion opportunity via educational comment strategy or AMA-style content.",
    tags: ["reddit", "community", "sentiment"],
    score: 65,
    priority: "low",
  },
  {
    id: "sig-12",
    type: "threat",
    source: "TikTok Trends",
    channels: ["social"],
    timestamp: "5h ago",
    title: "Trending sound saturation — “Soft Start 02” overused",
    summary: "Same sound in 40% of category top posts; differentiation risk rising.",
    body: "TikTok Trends indicates “Soft Start 02” now appears in 40% of top 100 category posts (up from 12% two weeks ago). Early creative using this sound still performs but marginal CTR declining. Recommend alternate sound pool from Trend Analyzer queue.",
    tags: ["tiktok", "sound", "creative-fatigue"],
    score: 79,
    priority: "medium",
  },
  {
    id: "sig-13",
    type: "awareness",
    source: "Google News",
    channels: ["pr"],
    timestamp: "6h ago",
    title: "Industry trade piece: FTC scrutiny on supplement claims",
    summary: "Category-wide compliance mention; no brand-specific callouts.",
    body: "Google News aggregated trade coverage on FTC increased scrutiny of structure/function claims in supplement advertising. Article references category broadly without naming your brand. Review active ad copy and landing page claims against updated compliance checklist.",
    tags: ["compliance", "ftc", "industry"],
    score: 70,
    priority: "medium",
  },
  {
    id: "sig-14",
    type: "threat",
    source: "Reddit",
    channels: ["social"],
    timestamp: "7h ago",
    title: "Negative thread theme: “subscription trap” for powder brands",
    summary: "Viral comment chain references category; 3 competitor names cited.",
    body: "Reddit sentiment monitor detected rising “subscription trap” narrative in r/Wellness and r/Frugal. Your brand not primary target but category language may spill into ad comments. Consider proactive FAQ on cancel policy in creative and landing footers.",
    tags: ["reddit", "sentiment", "subscription"],
    score: 77,
    priority: "medium",
  },
  {
    id: "sig-15",
    type: "awareness",
    source: "Google Trends",
    channels: ["search"],
    timestamp: "8h ago",
    title: "Seasonal lift: “immune support powder” queries rising",
    summary: "Pre-season search curve mirrors last year’s week 38 inflection.",
    body: "Google Trends shows “immune support powder” entering early seasonal ramp (US), consistent with prior-year week 38 pattern. Opportunity to prep SEO content and email capture 3 weeks ahead of peak. Competitor content calendars likely aligning.",
    tags: ["seasonal", "seo", "planning"],
    score: 72,
    priority: "low",
  },
];

export function getTopSignals(count = 3, signals: FeedSignal[] = FEED_SIGNALS): FeedSignal[] {
  return [...signals].sort((a, b) => b.score - a.score).slice(0, count);
}

export function countByType(signals: FeedSignal[] = FEED_SIGNALS) {
  const counts = { opportunity: 0, threat: 0, awareness: 0, competitor: 0 };
  for (const s of signals) {
    counts[s.type] += 1;
  }
  return counts;
}

export function topSourcesByCount(signals: FeedSignal[] = FEED_SIGNALS, limit = 5) {
  const map = new Map<string, number>();
  for (const s of signals) {
    map.set(s.source, (map.get(s.source) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([source, count]) => ({ source, count }));
}

export function signalAction(type: SignalType): "Generate Brief" | "Add to Content Queue" {
  return type === "opportunity" ? "Add to Content Queue" : "Generate Brief";
}

export function matchesFilter(signal: FeedSignal, filter: DetailFilter): boolean {
  if (filter === "all") return true;
  if (filter === "opportunity" || filter === "threat" || filter === "awareness" || filter === "competitor") {
    return signal.type === filter;
  }
  return signal.channels.includes(filter);
}
