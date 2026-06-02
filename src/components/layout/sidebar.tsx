"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForRole } from "@/lib/navigation";
import { useApp } from "@/context/app-context";

const navIcons: Record<string, string> = {
  "/dashboard": "◉",
  "/signals": "◎",
  "/competitive": "⚔",
  "/seo": "⌕",
  "/content": "✎",
  "/performance": "▲",
  "/settings": "⚙",
};

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useApp();
  const items = getNavItemsForRole(role);

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:border-r md:border-white/10 md:bg-[var(--bg)] lg:w-64">
      <div className="flex h-14 items-center gap-2 border-b border-white/10 px-4">
        <span className="font-heading text-lg font-bold tracking-widest text-[var(--cyan)]">
          SIGNAL
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
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
