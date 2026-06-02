"use client";

import { useApp } from "@/context/app-context";

function formatRefreshed(date: Date) {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function TopBar() {
  const {
    clients,
    products,
    currentClient,
    currentProduct,
    setCurrentClientId,
    setCurrentProductId,
    lastRefreshed,
    agentsRunning,
    runAgents,
  } = useApp();

  const clientProducts = products.filter(
    (p) => p.client_id === currentClient?.id,
  );

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[var(--bg)]/90 px-3 backdrop-blur-md sm:gap-4 sm:px-4">
      <div className="font-heading text-sm font-bold tracking-widest text-[var(--cyan)] md:hidden">
        SIGNAL
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
        <label className="sr-only" htmlFor="client-select">
          Client
        </label>
        <select
          id="client-select"
          value={currentClient?.id ?? ""}
          onChange={(e) => setCurrentClientId(e.target.value)}
          className="max-w-[140px] truncate rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white sm:max-w-none sm:text-sm"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id} className="bg-[var(--bg)]">
              {c.name}
            </option>
          ))}
        </select>

        <span className="hidden text-white/20 sm:inline">/</span>

        <label className="sr-only" htmlFor="product-select">
          Product
        </label>
        <select
          id="product-select"
          value={currentProduct?.id ?? ""}
          onChange={(e) => setCurrentProductId(e.target.value)}
          className="max-w-[140px] truncate rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white sm:max-w-none sm:text-sm"
        >
          {clientProducts.map((p) => (
            <option key={p.id} value={p.id} className="bg-[var(--bg)]">
              {p.name}
            </option>
          ))}
        </select>

        <span className="ml-auto hidden text-xs text-white/40 lg:inline">
          Updated {formatRefreshed(lastRefreshed)}
        </span>
      </div>

      <button
        type="button"
        onClick={runAgents}
        disabled={agentsRunning}
        className="shrink-0 rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50 sm:px-4 sm:text-sm"
      >
        {agentsRunning ? "Running…" : "Run Agents"}
      </button>
    </header>
  );
}
