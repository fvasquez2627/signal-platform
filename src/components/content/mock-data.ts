export type BucketStatus = "queued" | "generated" | "approved";

export type ContentBucket = {
  id: string;
  name: string;
  signalSource: string;
  rationale: string;
  piecesSuggested: number;
  enabled: boolean;
  notes: string;
  status: BucketStatus;
  complianceNote?: string;
};

export type PlatformTab = "tiktok" | "meta" | "google" | "ai_prompts" | "spark_ad";

export type DraftStatus = "pending" | "approved" | "rejected" | "published";

export type DraftHistoryRow = {
  id: string;
  date: string;
  platform: "TikTok" | "Meta" | "Google" | "Spark Ad" | "AI Prompts";
  bucket: string;
  signalSource: string;
  status: DraftStatus;
};

export const SUMMARY = {
  draftsAwaitingReview: 12,
  lastGenerated: "Today 6:02 AM",
  topHook:
    "POV: you found out your morning coffee was missing one ingredient this whole time 👀",
  bucket: "Trend Response",
  signalSource: "TikTok Trends",
};

export const CONTENT_BUCKETS: ContentBucket[] = [
  {
    id: "1",
    name: "Trend Response — #CollagenCoffee",
    signalSource: "TikTok Trends",
    rationale: "2.4M views in 48hrs, no brand has claimed",
    piecesSuggested: 2,
    enabled: true,
    notes: "Lead with coffee ritual demo. Prioritize UGC-style hooks.",
    status: "generated",
  },
  {
    id: "2",
    name: "Competitive Counter — NeoCell weakness",
    signalSource: "Amazon Reviews",
    rationale: "47 new 1-stars citing taste, own mixability",
    piecesSuggested: 1,
    enabled: true,
    notes: "Never name competitor directly. Focus on dissolve-in-coffee proof.",
    status: "generated",
  },
  {
    id: "3",
    name: "Education — Marine vs Bovine",
    signalSource: "Google Trends",
    rationale: "Rising query +67%, no clear content winner",
    piecesSuggested: 3,
    enabled: true,
    notes: "YouTheory uses bovine peptides — position as bioavailability advantage.",
    status: "queued",
  },
  {
    id: "4",
    name: "Clinical Authority — Joint study",
    signalSource: "PubMed",
    rationale: "New peer-reviewed study supports your claim",
    piecesSuggested: 1,
    enabled: true,
    notes: "Include study citation in description. Legal review before publish.",
    status: "generated",
    complianceNote: "Compliance review required before approval",
  },
  {
    id: "5",
    name: "Seasonal — Summer skin prep",
    signalSource: "Google Trends",
    rationale: "May search spike incoming, 3 weeks early",
    piecesSuggested: 2,
    enabled: false,
    notes: "",
    status: "queued",
  },
  {
    id: "6",
    name: "Influencer Brief — Creator wave",
    signalSource: "TikTok Commercial API",
    rationale: "Garden of Life creator push detected",
    piecesSuggested: 1,
    enabled: false,
    notes: "Spark Ad brief only — hold until creator roster confirmed.",
    status: "queued",
  },
];

export const ACTIVE_DRAFT = {
  bucket: "Trend Response",
  signalSource: "TikTok Trends",
  generatedAt: "Today 6:02 AM",
};

export const TIKTOK_DRAFT = {
  hook: "POV: you found out your morning coffee was missing one ingredient this whole time 👀",
  scriptBody:
    "Collagen peptides dissolve instantly — you won't taste a thing. But your skin, joints, and hair will feel it in 30 days. I've been adding one scoop to my coffee every morning and the difference is actually insane. YouTheory Collagen, link in bio.",
  cta: "Shop the link → 20% off today only. Comment COFFEE and I'll DM you the exact one I use.",
  sound: {
    name: "Morning Routine Vibes — Lo-Fi Coffee",
    videoCount: "847K videos",
  },
};

export const META_DRAFT = {
  headlines: [
    { text: "Collagen That Dissolves in Coffee", chars: 33 },
    { text: "Your Morning Coffee, Upgraded", chars: 29 },
    { text: "YouTheory Collagen — 30 Days", chars: 30 },
  ],
  primaryText:
    "One scoop. Zero taste. Real results in 30 days. YouTheory Collagen peptides dissolve instantly in hot or iced coffee — no clumps, no weird flavor. Join 2M+ customers who've made collagen part of their morning ritual. Clinically studied peptides for skin, joints, and hair. Shop now and save 20% on your first order.",
  description: "Premium collagen peptides. Dissolves instantly. 20% off today.",
  ctaOptions: ["Shop Now", "Learn More", "Get Offer"],
  recommendedFormat: "Reels",
};

export const GOOGLE_DRAFT = {
  displayUrl: "youtheory.com/collagen",
  headlines: [
    "YouTheory Collagen Peptides",
    "Collagen for Skin & Joints",
    "Dissolves in Coffee Instantly",
    "Clinically Studied Formula",
    "20% Off Collagen Today",
    "Premium Collagen Supplement",
    "No Taste, Real Results",
    "Collagen Peptides 290g",
    "Shop YouTheory Collagen",
    "Beauty Starts From Within",
    "Joint Support Collagen",
    "Add to Your Morning Coffee",
    "Trusted Collagen Brand",
    "Feel the Difference in 30 Days",
    "Best-Selling Collagen",
  ],
  descriptions: [
    "Premium collagen peptides that dissolve instantly. Skin, joints & hair support. Shop now.",
    "Clinically studied formula. No taste in coffee. 20% off your first order today.",
    "Join 2M+ customers. YouTheory Collagen — the morning ritual that actually works.",
    "Bovine collagen peptides. Easy to mix. Visible results in as little as 30 days.",
  ],
};

export const AI_PROMPTS_DRAFT = {
  videoPrompt:
    "UGC-style vertical video, 9:16, warm morning kitchen lighting. Close-up of hands stirring a scoop of white collagen powder into steaming coffee — powder dissolves instantly with no clumps. Cut to medium shot of woman in her 30s taking first sip, genuine surprised smile. Soft natural window light, shallow depth of field. Product label visible: YouTheory Collagen Peptides. Mood: authentic, cozy, aspirational wellness. Duration 15-20 seconds. No text overlays.",
  imagePrompt:
    "Product photography, YouTheory Collagen Peptides tub beside artisan coffee cup on marble countertop, morning golden hour light, steam rising from coffee, one scoop of collagen powder mid-pour creating soft white swirl, minimalist kitchen background, premium wellness aesthetic, shot on 85mm lens, shallow depth of field --ar 4:5 --style raw",
  sceneDirection:
    "Open: extreme close-up coffee pour (0-2s). Hook reaction: direct-to-camera POV (2-5s). Demo: scoop + stir dissolve test (5-12s). Payoff: sip + smile + product hero (12-18s). End card: tub + CTA text overlay (18-20s). Camera: handheld micro-movements for UGC feel. Lighting: warm 3200K, soft shadows.",
  voScript:
    "What if I told you your morning coffee was missing one thing? YouTheory Collagen peptides dissolve instantly — you won't taste a thing. But your skin, joints, and hair? They'll feel it in thirty days. Link in bio for twenty percent off.",
};

export const SPARK_AD_DRAFT = {
  briefTitle: "YouTheory Collagen — #CollagenCoffee Spark Ad Brief",
  talkingPoints: [
    "Show your real morning coffee routine — authenticity beats polish",
    "Demonstrate one scoop dissolving instantly with zero clumps or taste",
    "Mention visible results timeline: skin, joints, hair in 30 days",
    "Highlight YouTheory as clinically studied, trusted by 2M+ customers",
    "Include personal before/after or 'why I switched' story angle",
  ],
  dos: [
    "Film in natural morning light with your actual coffee setup",
    "Use trending #CollagenCoffee sound or similar coffee-ritual audio",
    "Show product label clearly for Spark Ad compliance",
  ],
  donts: [
    "Don't make unsubstantiated medical claims",
    "Don't compare directly to competitor products by name",
    "Don't use copyrighted music outside TikTok library",
  ],
  hashtags: ["#CollagenCoffee", "#MorningRoutine", "#YouTheory", "#CollagenPeptides", "#WellnessTok"],
  productPoints: [
    "YouTheory Collagen Peptides — bovine collagen, 6g per serving",
    "Dissolves in hot or iced coffee, smoothies, or water",
    "Clinically studied peptides for skin elasticity, joint comfort, hair & nails",
    "Available at youtheory.com — 20% off first order with code COFFEE20",
  ],
};

export const DRAFT_HISTORY: DraftHistoryRow[] = [
  {
    id: "1",
    date: "Jun 5, 6:02 AM",
    platform: "TikTok",
    bucket: "Trend Response",
    signalSource: "TikTok Trends",
    status: "pending",
  },
  {
    id: "2",
    date: "Jun 5, 5:48 AM",
    platform: "Meta",
    bucket: "Trend Response",
    signalSource: "TikTok Trends",
    status: "pending",
  },
  {
    id: "3",
    date: "Jun 4, 6:01 AM",
    platform: "Google",
    bucket: "Education",
    signalSource: "Google Trends",
    status: "approved",
  },
  {
    id: "4",
    date: "Jun 4, 6:01 AM",
    platform: "TikTok",
    bucket: "Competitive Counter",
    signalSource: "Amazon Reviews",
    status: "approved",
  },
  {
    id: "5",
    date: "Jun 3, 6:00 AM",
    platform: "Meta",
    bucket: "Clinical Authority",
    signalSource: "PubMed",
    status: "approved",
  },
  {
    id: "6",
    date: "Jun 3, 6:00 AM",
    platform: "AI Prompts",
    bucket: "Trend Response",
    signalSource: "TikTok Trends",
    status: "approved",
  },
  {
    id: "7",
    date: "Jun 2, 6:03 AM",
    platform: "Spark Ad",
    bucket: "Influencer Brief",
    signalSource: "TikTok Commercial API",
    status: "pending",
  },
  {
    id: "8",
    date: "Jun 1, 6:00 AM",
    platform: "Google",
    bucket: "Education",
    signalSource: "Google Trends",
    status: "approved",
  },
  {
    id: "9",
    date: "May 31, 6:01 AM",
    platform: "TikTok",
    bucket: "Seasonal",
    signalSource: "Google Trends",
    status: "published",
  },
  {
    id: "10",
    date: "May 30, 6:00 AM",
    platform: "Meta",
    bucket: "Competitive Counter",
    signalSource: "Amazon Reviews",
    status: "approved",
  },
];

export const GENERATION_STATS = {
  draftsThisMonth: 12,
  approved: 8,
  pending: 4,
  rejected: 0,
};

export const BUCKET_HEALTH = {
  activeBuckets: 4,
  paused: 2,
  lastRun: "Today 6:02 AM",
  nextScheduled: "Tomorrow 6:00 AM",
};

export const PLATFORM_TABS: { id: PlatformTab; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "meta", label: "Meta" },
  { id: "google", label: "Google" },
  { id: "ai_prompts", label: "AI Prompts" },
  { id: "spark_ad", label: "Spark Ad" },
];

export const BUCKET_STATUS_STYLES: Record<BucketStatus, string> = {
  queued: "bg-white/10 text-white/55",
  generated: "bg-[var(--cyan)]/15 text-[var(--cyan)]",
  approved: "bg-[var(--green)]/15 text-[var(--green)]",
};

export const DRAFT_STATUS_STYLES: Record<DraftStatus, string> = {
  pending: "bg-[var(--yellow)]/15 text-[var(--yellow)]",
  approved: "bg-[var(--green)]/15 text-[var(--green)]",
  rejected: "bg-[var(--red)]/15 text-[var(--red)]",
  published: "bg-[var(--purple)]/15 text-[var(--purple)]",
};

export type HistoryPlatformFilter = "all" | DraftHistoryRow["platform"];
export type HistoryStatusFilter = "all" | DraftStatus;
