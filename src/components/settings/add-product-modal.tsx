"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import { insertProduct } from "@/lib/data/save-config";
import type { Client } from "@/types/database";
import {
  emptyProductDraft,
  ProductWizardStep,
  type ProductDraft,
} from "@/components/settings/product-wizard-step";

type AddProductModalProps = {
  client: Client;
  onClose: () => void;
  onSaved?: () => void;
};

export function AddProductModal({ client, onClose, onSaved }: AddProductModalProps) {
  const { refreshWorkspace, setSelectedProduct } = useApp();
  const [draft, setDraft] = useState<ProductDraft>(() =>
    emptyProductDraft(client.brand_url ?? ""),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const product = await insertProduct(client.id, {
        ...draft,
        brand_url: draft.brand_url || client.brand_url || undefined,
      });
      await refreshWorkspace();
      setSelectedProduct(product);
      onSaved?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[#1C2530] bg-[#0A0D12] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#1C2530] px-4 py-3">
          <h2 className="font-heading text-lg font-semibold text-white">Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-white/50 hover:text-white"
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ProductWizardStep
            draft={draft}
            onChange={setDraft}
            brandContext={{
              name: client.name,
              category: client.primary_category ?? "General",
            }}
            brandUrl={client.brand_url ?? ""}
          />
          {error && <p className="mt-3 text-sm text-[var(--red)]">{error}</p>}
        </div>
        <div className="border-t border-[#1C2530] px-4 py-3">
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving || !draft.name.trim()}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-50 sm:w-auto"
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
