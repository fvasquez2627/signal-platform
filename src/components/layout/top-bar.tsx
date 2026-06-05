"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/context/app-context";
import {
  getClientColor,
  getProductColor,
  sortClientProducts,
} from "@/lib/product-utils";

function formatRefreshed(date: Date) {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;

    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onClose, enabled]);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`shrink-0 text-white/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="M2.5 4.5L6 8L9.5 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopBar() {
  const {
    clients,
    selectedClient,
    selectedProduct,
    setSelectedClient,
    setSelectedProduct,
    products,
    lastRefreshed,
    mounted,
    agentsRunning,
    runAgents,
  } = useApp();

  const [clientOpen, setClientOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const clientRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  useOutsideClick(clientRef, () => setClientOpen(false), clientOpen);
  useOutsideClick(productRef, () => setProductOpen(false), productOpen);

  const clientProducts = sortClientProducts(
    products.filter((p) => p.client_id === selectedClient?.id),
  );

  // Stable SSR/hydration fallbacks — persisted selection applies after mount in context.
  const clientLabel = selectedClient?.name ?? "Select client";
  const productLabel = selectedProduct?.name ?? "Select product";
  const clientInitial = selectedClient?.name?.charAt(0) ?? "?";
  const productColor = getProductColor(selectedProduct?.name ?? "");
  const showRefreshed = mounted && lastRefreshed;

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-[#1C2530] bg-[#0A0D12]/95 px-3 backdrop-blur-md sm:gap-4 sm:px-4">
      <div className="font-heading text-sm font-bold tracking-widest text-[var(--cyan)] md:hidden">
        SIGNAL
      </div>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
        {/* Client dropdown */}
        <div ref={clientRef} className="relative min-w-0 flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setClientOpen((o) => !o);
              setProductOpen(false);
            }}
            className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-[#1C2530] bg-[#0A0D12] px-3 py-2 text-left text-sm text-white transition-colors hover:border-[var(--cyan)]/40 sm:min-w-[160px]"
            aria-expanded={clientOpen}
            aria-haspopup="listbox"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[var(--bg)]"
              style={{
                backgroundColor: getClientColor(
                  clients.findIndex((c) => c.id === selectedClient?.id),
                ),
              }}
            >
              {clientInitial}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium" suppressHydrationWarning>
              {clientLabel}
            </span>
            <Chevron open={clientOpen} />
          </button>

          {clientOpen && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-[#1C2530] bg-[#0A0D12] py-1 shadow-xl transition-all duration-200 sm:right-auto sm:min-w-[220px]"
            >
              {clients.map((client, index) => {
                const selected = client.id === selectedClient?.id;
                return (
                  <button
                    key={client.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setSelectedClient(client);
                      setClientOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors ${
                      selected
                        ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                        : "text-white/80 hover:bg-[var(--cyan)]/10 hover:text-[var(--cyan)]"
                    }`}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[var(--bg)]"
                      style={{ backgroundColor: getClientColor(index) }}
                    >
                      {client.name.charAt(0)}
                    </span>
                    <span className="truncate font-medium">{client.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <span className="hidden text-white/20 sm:inline">/</span>

        {/* Product dropdown */}
        <div ref={productRef} className="relative min-w-0 flex-1 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setProductOpen((o) => !o);
              setClientOpen(false);
            }}
            className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-[#1C2530] bg-[#0A0D12] px-3 py-2 text-left text-sm text-white transition-colors hover:border-[var(--cyan)]/40 sm:min-w-[180px]"
            aria-expanded={productOpen}
            aria-haspopup="listbox"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: productColor }}
            />
            <span className="min-w-0 flex-1 truncate font-medium" suppressHydrationWarning>
              {productLabel}
            </span>
            <Chevron open={productOpen} />
          </button>

          {productOpen && (
            <div
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-[#1C2530] bg-[#0A0D12] py-1 shadow-xl transition-all duration-200 sm:right-auto sm:min-w-[280px]"
            >
              {clientProducts.map((product) => {
                const selected = product.id === selectedProduct?.id;
                const isAll = product.name === "All Products";
                return (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      setSelectedProduct(product);
                      setProductOpen(false);
                    }}
                    className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors ${
                      selected
                        ? "bg-[var(--cyan)]/15 text-[var(--cyan)]"
                        : "text-white/80 hover:bg-[var(--cyan)]/10 hover:text-[var(--cyan)]"
                    }`}
                  >
                    {isAll ? (
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs text-[var(--cyan)]">
                        ✦
                      </span>
                    ) : (
                      <span
                        className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: getProductColor(product.name) }}
                      />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {product.name}
                      </span>
                      {product.target_demographic && (
                        <span className="mt-0.5 block truncate text-[11px] text-white/40">
                          {product.target_demographic}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {showRefreshed && (
          <span className="ml-auto hidden text-xs text-white/40 lg:inline">
            Updated {formatRefreshed(lastRefreshed)}
          </span>
        )}
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
