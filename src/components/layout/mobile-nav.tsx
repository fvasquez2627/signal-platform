"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForRole, isNavItemActive } from "@/lib/navigation";
import { useApp } from "@/context/app-context";

export function MobileNav() {
  const pathname = usePathname();
  const { role } = useApp();
  const items = getNavItemsForRole(role);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[var(--bg)]/95 backdrop-blur-md md:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-stretch justify-around px-1 py-1 safe-area-pb">
        {items.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          return (
            <li key={item.href} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-[var(--cyan)]" : "text-white/50"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${active ? "bg-[var(--cyan)]" : "bg-transparent"}`}
                  aria-hidden
                />
                <span className="w-full truncate text-center">
                  {item.shortLabel}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
