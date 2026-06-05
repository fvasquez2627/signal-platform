export const INTEGRATIONS = {
  // FREE — always on
  google_trends: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "Google Trends",
    subtitle: "pytrends",
    provides: "Search volume shifts, rising queries, seasonal patterns",
  },
  google_news: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "Google News RSS",
    provides: "PR mentions, category news, funding announcements",
  },
  reddit: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "Reddit API",
    provides: "Community discussion themes, sentiment clusters",
  },
  pubmed: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "PubMed API",
    provides: "Clinical studies, ingredient research publications",
  },
  youtube: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "YouTube Data API v3",
    provides: "Video trend velocity, creator format patterns",
  },
  meta_ad_library_basic: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "Meta Ad Library",
    subtitle: "Public, limited access",
    provides: "Competitor ad copy, format tags, days running",
  },
  tiktok_creative_center: {
    enabled: true,
    free: true,
    alwaysOn: true,
    label: "TikTok Creative Center",
    provides: "Trending sounds, hashtags, creative inspiration",
  },

  // FREE WITH OAUTH
  google_search_console: {
    enabled: false,
    free: false,
    oauth: true,
    label: "Google Search Console",
    price: "Free",
    unlocks: [
      "Real rankings for your domain",
      "Clicks and impressions",
      "CTR by query",
    ],
  },
  meta_ad_library_full: {
    enabled: false,
    free: false,
    oauth: true,
    label: "Meta Ad Library (Full)",
    price: "Free",
    unlocks: [
      "Spend ranges and impressions",
      "Demographic targeting data",
      "Full creative metadata",
    ],
  },
  tiktok_commercial_api: {
    enabled: false,
    free: false,
    oauth: true,
    label: "TikTok Commercial Content API",
    price: "Free",
    approved: true,
    unlocks: [
      "Competitor ad video URLs",
      "Reach and demographics",
      "Ad longevity tracking",
    ],
  },
  tiktok_shop: {
    enabled: false,
    free: false,
    oauth: true,
    label: "TikTok Shop Seller Center",
    price: "Free",
    unlocks: ["Real GMV", "Order volume", "Product performance"],
  },
  meta_business: {
    enabled: false,
    free: false,
    oauth: true,
    label: "Meta Business Manager",
    price: "Free",
    unlocks: ["Real ROAS", "Spend data", "Campaign performance"],
  },
  google_ads: {
    enabled: false,
    free: false,
    oauth: true,
    label: "Google Ads",
    price: "Free",
    unlocks: ["Real impressions", "CTR data", "Keyword performance"],
  },

  // PAID — API key
  apify: {
    enabled: false,
    free: false,
    paid: true,
    label: "Apify",
    price: "$29/mo",
    unlocks: [
      "Instagram reels performance data",
      "Amazon BSR automated tracking",
      "Deeper TikTok organic post history",
    ],
  },
  dataforseo: {
    enabled: false,
    free: false,
    paid: true,
    label: "DataForSEO",
    price: "~$50/mo",
    unlocks: [
      "Competitor keyword rankings",
      "Keyword search volumes",
      "People Also Ask clusters",
      "AI Overview tracking",
      "Google Shopping data",
    ],
  },
  pipiads: {
    enabled: false,
    free: false,
    paid: true,
    label: "PiPiADS",
    price: "$49/mo",
    unlocks: [
      "50M TikTok ad database",
      "TikTok Shop product trends",
      "Historical ad archive",
    ],
  },

  // AI ANALYSIS
  ai_analysis: {
    enabled: true,
    free: false,
    ai: true,
    label: "Claude AI Ad Analysis",
    price: "~$0.002/ad",
    unlocks: [
      "Hook type, creative format, offer type",
      "Emotional angle, video length, CTA text",
      "Primary benefit, sound type, opening line",
      "Pattern analysis across ad sets",
    ],
  },
} as const;

export type IntegrationKey = keyof typeof INTEGRATIONS;

export type IntegrationConfig = (typeof INTEGRATIONS)[IntegrationKey];

export const ALWAYS_ON_KEYS = (
  Object.keys(INTEGRATIONS) as IntegrationKey[]
).filter((key) => "alwaysOn" in INTEGRATIONS[key] && INTEGRATIONS[key].alwaysOn);

export const OAUTH_INTEGRATION_KEYS = (
  Object.keys(INTEGRATIONS) as IntegrationKey[]
).filter((key) => "oauth" in INTEGRATIONS[key] && INTEGRATIONS[key].oauth);

export const PAID_INTEGRATION_KEYS = (
  Object.keys(INTEGRATIONS) as IntegrationKey[]
).filter((key) => "paid" in INTEGRATIONS[key] && INTEGRATIONS[key].paid);

export const AI_INTEGRATION_KEYS: IntegrationKey[] = ["ai_analysis"];

export function isIntegrationKey(key: string): key is IntegrationKey {
  return key in INTEGRATIONS;
}

export function integrationSettingsLabel(key: IntegrationKey): string {
  return INTEGRATIONS[key].label;
}
