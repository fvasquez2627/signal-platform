import type { UserRole } from "@/types/database";

export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Overview",
    shortLabel: "Home",
    description: "High-level metrics and priorities",
  },
  {
    href: "/signals",
    label: "Signal Feed",
    shortLabel: "Signals",
    description: "Incoming intelligence across sources",
  },
  {
    href: "/competitive",
    label: "Competitive Intel",
    shortLabel: "Compete",
    description: "Competitor moves and positioning",
  },
  {
    href: "/seo",
    label: "SEO + AEO",
    shortLabel: "SEO",
    description: "Search and answer-engine optimization",
  },
  {
    href: "/content",
    label: "Content Studio",
    shortLabel: "Content",
    description: "Drafts, hooks, and publishing workflow",
  },
  {
    href: "/performance",
    label: "Performance",
    shortLabel: "Perf",
    description: "Content and campaign outcomes",
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Settings",
    description: "Account, integrations, and team",
  },
];

const VIEWER_PATHS = new Set(["/dashboard"]);
const MANAGER_EXCLUDED = new Set(["/settings"]);

export function getNavItemsForRole(role: UserRole): NavItem[] {
  if (role === "viewer") {
    return NAV_ITEMS.filter((item) => VIEWER_PATHS.has(item.href));
  }
  if (role === "manager") {
    return NAV_ITEMS.filter((item) => !MANAGER_EXCLUDED.has(item.href));
  }
  return NAV_ITEMS;
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  const allowed = getNavItemsForRole(role).map((i) => i.href);
  const base = allowed.find((href) => pathname === href || pathname.startsWith(`${href}/`));
  return Boolean(base);
}
