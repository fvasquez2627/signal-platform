"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForRole, isNavItemActive, ROUTES } from "@/lib/navigation";
import { useApp } from "@/context/app-context";

const navIcons: Record<string, string> = {
  [ROUTES.dashboard]: "◉",
  [ROUTES.signals]: "◎",
  [ROUTES.competitive]: "⚔",
  [ROUTES.seo]: "⌕",
  [ROUTES.content]: "✎",
  [ROUTES.performance]: "▲",
  [ROUTES.settings]: "⚙",
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useApp();
  const items = getNavItemsForRole(role);

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-white/10 md:bg-[var(--bg)] lg:w-64">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
        <Link
          href={ROUTES.dashboard}
          className="font-heading text-lg font-bold tracking-widest text-[var(--cyan)] transition-opacity hover:opacity-80"
        >
          SIGNAL
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 p-3" aria-label="Main navigation">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base opacity-80" aria-hidden>
                {navIcons[item.href]}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="text-xs text-white/30">Content Intelligence</p>
      </div>
    </aside>
  );
}
