import type { UserRole } from "@/types/database";

export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
};

/** Canonical app routes — keep in sync with src/app/(app) route pages. */
export const ROUTES = {
  dashboard: "/dashboard",
  signals: "/signals",
  competitive: "/competitive",
  seo: "/seo",
  content: "/content",
  performance: "/performance",
  settings: "/settings",
} as const;

export const NAV_ITEMS: NavItem[] = [
  {
    href: ROUTES.dashboard,
    label: "Overview",
    shortLabel: "Home",
    description: "High-level metrics and priorities",
  },
  {
    href: ROUTES.signals,
    label: "Market Feed",
    shortLabel: "Market",
    description: "Incoming intelligence across sources",
  },
  {
    href: ROUTES.competitive,
    label: "Competitive Intel",
    shortLabel: "Compete",
    description: "Competitor moves and positioning",
  },
  {
    href: ROUTES.seo,
    label: "SEO + AEO",
    shortLabel: "SEO",
    description: "Search and answer-engine optimization",
  },
  {
    href: ROUTES.content,
    label: "Content Studio",
    shortLabel: "Content",
    description: "Drafts, hooks, and publishing workflow",
  },
  {
    href: ROUTES.performance,
    label: "Performance",
    shortLabel: "Perf",
    description: "Content and campaign outcomes",
  },
  {
    href: ROUTES.settings,
    label: "Settings",
    shortLabel: "Settings",
    description: "Account, integrations, and team",
  },
];

const SETTINGS_PATH = ROUTES.settings;

/** App pages for viewer and manager (excludes Settings-only admin areas in the UI, not routing). */
const OPERATOR_PATHS = new Set(
  NAV_ITEMS.filter((item) => item.href !== SETTINGS_PATH).map((item) => item.href),
);

/** Settings is reachable by all roles (integrations / platform connections). */
const PATHS_WITH_SETTINGS = new Set([...OPERATOR_PATHS, SETTINGS_PATH]);

export function normalizePathname(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0];
  if (path !== "/" && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

/** Active nav highlight — Overview is exact match on /dashboard only. */
export function isNavItemActive(pathname: string, href: string): boolean {
  const path = normalizePathname(pathname);
  const base = normalizePathname(href);

  if (base === ROUTES.dashboard) {
    return path === ROUTES.dashboard;
  }

  return path === base || path.startsWith(base + "/");
}

export function getNavItemsForRole(role: UserRole): NavItem[] {
  if (role === "admin") {
    return NAV_ITEMS;
  }
  return NAV_ITEMS.filter((item) => PATHS_WITH_SETTINGS.has(item.href));
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const path = normalizePathname(pathname);
  const allowed = getNavItemsForRole(role).map((item) => item.href);
  return allowed.some((href) => isNavItemActive(path, href));
}
