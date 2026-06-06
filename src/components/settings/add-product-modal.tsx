"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/app-context";
import { insertProduct } from "@/lib/data/save-config";
import {
  emptyProductDraft,
  ProductWizardStep,
  type ProductDraft,
} from "@/components/settings/product-wizard-step";
import { FieldLabel } from "@/components/settings/settings-ui";

type AddProductModalProps = {
  initialClientId?: string;
  onClose: () => void;
  onSaved?: () => void;
};

export function AddProductModal({
  initialClientId,
  onClose,
  onSaved,
}: AddProductModalProps) {
  const { clients, currentClient, refreshWorkspace, setSelectedClient, setSelectedProduct } =
    useApp();

  const [clientId, setClientId] = useState(
    () => initialClientId ?? currentClient?.id ?? clients[0]?.id ?? "",
  );
  const [draft, setDraft] = useState<ProductDraft>(() => emptyProductDraft());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === clientId) ?? currentClient ?? clients[0] ?? null,
    [clients, clientId, currentClient],
  );

  useEffect(() => {
    if (!selectedClient) return;
    setDraft(emptyProductDraft(selectedClient.brand_url ?? ""));
  }, [selectedClient?.id, selectedClient?.brand_url]);

  const save = async () => {
    if (!draft.name.trim() || !selectedClient) return;
    setSaving(true);
    setError(null);
    try {
      const product = await insertProduct(selectedClient.id, {
        ...draft,
        brand_url: draft.brand_url || selectedClient.brand_url || undefined,
      });
      await refreshWorkspace();
      setSelectedClient(selectedClient);
      setSelectedProduct(product);
      onSaved?.();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (!selectedClient) {
    return null;
  }

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
          <div className="mb-5">
            <FieldLabel>Add product to:</FieldLabel>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--cyan)]/40"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0A0D12]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <ProductWizardStep
            draft={draft}
            onChange={setDraft}
            brandContext={{
              name: selectedClient.name,
              category: selectedClient.primary_category ?? "General",
            }}
            brandUrl={selectedClient.brand_url ?? ""}
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
