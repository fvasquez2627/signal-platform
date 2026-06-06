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
  signalSource: "TikTok Trends → Meta",
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
  signalSource: "TikTok Trends → Meta",
  bucket: "Trend Response",
  variantA: {
    label: "Variant A — Reels Format",
    primaryText:
      "Your morning coffee ritual is missing something. YouTheory Collagen peptides dissolve instantly — no taste, no clumps. Just results you'll feel in 30 days. Skin, joints, hair. All of it.\nShop now → link in bio",
    headlines: [
      "The Morning Upgrade You're Missing",
      "Collagen That Actually Works",
      "30 Days to Visible Results",
    ],
    description: "Type 1, 2 & 3 Collagen Peptides. Unflavored. Dissolves instantly.",
    cta: "Shop Now",
    format: "Reels (9:16)",
    audience: "Women 28-45, US",
  },
  variantB: {
    label: "Variant B — Carousel Format",
    primaryText: "5 signs your body needs more collagen (most people miss #3) 👇",
    slides: [
      "Your skin feels less firm",
      "Joint stiffness in the morning",
      "Hair feels thinner or breaks",
      "Nails chip and break constantly",
      "You're over 25 — collagen drops 1% per year after this age",
    ],
    headline: "Fix It From Within",
    cta: "Learn More",
  },
  abTest:
    "Test Reels vs Carousel this week. Reels predicted higher reach. Carousel predicted higher CTR. Run both with $50/day for 3 days.",
};

export const GOOGLE_DRAFT = {
  signalSource: "Google Trends → Search",
  bucket: "Trend Response",
  campaignLabel: "Collagen Peptides — Brand + Category",
  displayUrl: "youtheory.com/collagen-peptides",
  adStrength: "Excellent",
  headlines: [
    "YouTheory Collagen Peptides",
    "Best Collagen Supplement",
    "Type 1 2 & 3 Collagen",
    "Dissolves Instantly",
    "No Taste No Clumps",
    "See Results in 30 Days",
    "Skin Joints Hair Support",
    "Free Shipping Over $35",
    "Shop YouTheory Today",
    "Collagen Coffee Ready",
    "Unflavored Formula",
    "Marine + Bovine Blend",
    "30 Day Supply",
    "Subscribe and Save 20%",
    "Clinical Grade Collagen",
  ],
  descriptions: [
    "YouTheory Collagen Peptides dissolve in any drink. Type 1, 2 & 3 for full-body support.",
    "Support skin elasticity, joint comfort and hair with one scoop. Unflavored formula.",
    "The collagen supplement that works. 5-star reviews. Free shipping on orders over $35.",
    "Feel the difference in 30 days or your money back. Shop YouTheory Collagen today.",
  ],
  display: {
    shortHeadline: "Feel Better From Within",
    longHeadline:
      "YouTheory Collagen — Skin, Joints & Hair Support in One Daily Scoop",
    description: "Dissolves instantly. Unflavored. Type 1, 2 & 3 Collagen.",
  },
  keywords: [
    { term: "collagen peptides", match: "Exact" as const, volume: "High" as const },
    { term: "collagen supplement", match: "Phrase" as const, volume: "High" as const },
    { term: "best collagen powder", match: "Broad" as const, volume: "High" as const },
    { term: "collagen for skin", match: "Phrase" as const, volume: "Medium" as const },
    { term: "collagen coffee", match: "Exact" as const, volume: "Medium" as const },
    { term: "youtheory collagen", match: "Exact" as const, volume: "Medium" as const },
    { term: "type 1 2 3 collagen", match: "Phrase" as const, volume: "Low" as const },
    { term: "collagen for joints", match: "Broad" as const, volume: "Medium" as const },
    { term: "unflavored collagen", match: "Phrase" as const, volume: "Low" as const },
    { term: "collagen peptides powder", match: "Broad" as const, volume: "High" as const },
  ],
};

export const AI_PROMPTS_DRAFT = {
  signalSource: "TikTok Trends → AI",
  bucket: "Trend Response",
  video: {
    label: "Veo / Runway / Sora",
    scenePrompt:
      "A bright minimal kitchen at golden hour. Woman in early 30s, athletic build, natural makeup, pours one scoop of white powder into morning coffee. Powder dissolves instantly — she watches with satisfied smile. Takes a sip, closes eyes briefly. Cut to: skin glowing in natural light, close up. Warm aspirational tone. No voiceover. Trending audio underneath.",
    specs: {
      format: "9:16 vertical",
      duration: "15-18 seconds",
      style: "UGC aesthetic, handheld feel",
      lighting: "Natural, warm, golden hour",
    },
    negativePrompts:
      "No text overlays, no studio lighting, no obvious ad feel, no male talent",
  },
  image: {
    label: "Midjourney / Flux / Firefly",
    productShot:
      "YouTheory white collagen powder container, minimalist flat lay, marble surface, morning light from left, small coffee cup beside it, fresh flowers background, editorial lifestyle photography, high-end supplement brand aesthetic, --ar 4:5 --style raw --v 6",
    lifestyle:
      "Woman holding collagen supplement container, bright kitchen background, natural light, genuine smile, athletic casual outfit, skin looks hydrated and glowing, authentic UGC style, not stock photo aesthetic, --ar 9:16 --style raw --v 6",
    hookFrame:
      "Split screen: left dull tired skin, right glowing hydrated skin, clean minimal design, soft gradient background cream and white, subtle text space at bottom, --ar 9:16",
  },
  sceneDirection: {
    talent: "Woman early 30s, athletic-casual, natural makeup, relatable not model-perfect",
    setting: "Bright minimal kitchen, morning golden hour, real coffee setup",
    mood: "Warm, aspirational, authentic UGC — cozy wellness ritual",
    avoid: "Studio lighting, obvious ad feel, medical claims, competitor mentions",
  },
  voScript:
    "I've been adding one scoop to my coffee every morning for 30 days. My skin, my joints, my hair — I actually noticed a difference. YouTheory Collagen. Link in bio.",
};

export const SPARK_AD_DRAFT = {
  signalSource: "TikTok Trends → Spark",
  bucket: "Trend Response",
  brand: "YouTheory",
  product: "Collagen Peptides 290g",
  campaign: "#CollagenCoffee Trend Response",
  budgetGuidance: "$500-2000 per creator",
  contentDirection:
    "We're seeing #CollagenCoffee trending organically with 2.4M views. We want authentic creator content showing collagen as part of morning coffee routine. Keep it real — we don't want it to look like an ad.",
  talkingPoints: [
    "Dissolves instantly, no taste",
    "Type 1, 2 & 3 collagen",
    "Results in 30 days",
    "One scoop in coffee or any drink",
    "Skin + joints + hair benefits",
  ],
  dos: [
    "Show the actual mixing/dissolving",
    "Morning routine context",
    "Genuine reaction/testimonial",
    "Mention specific benefits noticed",
    "Use trending audio if possible",
  ],
  donts: [
    "No disease or medical claims",
    "Don't say \"cures\" or \"treats\"",
    "No before/after medical comparisons",
    "Don't compare to competitors by name",
    "No exaggerated results claims",
  ],
  hashtags: [
    "#YouTheoryCollagen",
    "#CollagenCoffee",
    "#MorningRoutine",
    "#CollagenPeptides",
    "#SkinFromWithin",
    "#WellnessRoutine",
  ],
  deliverables: [
    "1 x TikTok video (15-30 sec)",
    "Optional: 1 x Reels version",
    "Usage rights: 30 days paid amplification",
  ],
  ftcDisclosure: "Must include: #ad or #sponsored or \"paid partnership with YouTheory\"",
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
    status: "rejected",
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
export type HistoryStatusFilter = "all" | "approved" | "pending" | "rejected";
