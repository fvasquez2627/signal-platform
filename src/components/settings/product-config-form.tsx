"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/context/app-context";
import { discoverCompetitors, discoverProduct, suggestKeywords } from "@/lib/ai/discover";
import {
  applyAcceptedDiff,
  buildProductConfigDiff,
  type ConfigDiff,
  type DiffItem,
} from "@/lib/config/config-diff";
import { updateProductConfig } from "@/lib/data/save-config";
import type { Client, Product } from "@/types/database";
import { ConfigDiffPanel } from "@/components/settings/config-diff-panel";
import { productFromDiscovery, type ProductDraft } from "@/components/settings/product-wizard-step";
import {
  MonthCheckboxes,
  PlatformCheckboxes,
  ProgressOverlay,
  SaveRegenerateButton,
  simulateRegeneration,
  TagInput,
  TextArea,
  TextInput,
  Toast,
} from "@/components/settings/settings-ui";

function productToDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    product_url: product.product_url ?? "",
    brand_url: product.brand_url ?? "",
    primary_benefit: product.primary_benefit ?? "",
    key_ingredients: product.key_ingredients ?? [],
    target_demographic: product.target_demographic ?? "",
    keywords: product.keywords ?? [],
    competitors: product.competitors ?? [],
    content_angles: product.content_angles ?? [],
    seasonal_peaks: product.seasonal_peaks ?? [],
    primary_platforms: product.primary_platforms ?? [],
    approved_claims: product.approved_claims ?? [],
    restricted_claims: product.restricted_claims ?? [],
    internal_notes: product.internal_notes ?? "",
    compliance_notes: product.compliance_notes ?? "",
    price_tier: product.price_tier ?? "",
    tags: product.tags ?? [],
    competitor_sources: {},
    certifications: product.certifications ?? [],
  };
}

type ProductConfigFormProps = {
  product: Product;
  client: Client | null;
  clientProducts: Product[];
  onSelectProduct: (id: string) => void;
  onAddProduct?: () => void;
};

export function ProductConfigForm({
  product,
  client,
  clientProducts,
  onSelectProduct,
  onAddProduct,
}: ProductConfigFormProps) {
  const { refreshWorkspace } = useApp();
  const [draft, setDraft] = useState(() => productToDraft(product));
  const [diff, setDiff] = useState<ConfigDiff | null>(null);
  const [diffItems, setDiffItems] = useState<DiffItem[]>([]);
  const [competitorInput, setCompetitorInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestingKw, setSuggestingKw] = useState(false);
  const [discoveringComp, setDiscoveringComp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "info" | "error">("success");
  const [prevCompetitorCount] = useState(product.competitors?.length ?? 0);

  const brandContext = useMemo(
    () => ({
      name: client?.name ?? "Unknown",
      category: client?.primary_category ?? "General",
    }),
    [client],
  );

  const competitorBadge = (name: string) =>
    draft.competitor_sources?.[name] === "auto" ? "Auto-discovered" : "Manually added";

  const reanalyze = async () => {
    if (!draft.product_url?.trim()) return;
    setAnalyzing(true);
    try {
      const result = await discoverProduct(draft.product_url.trim(), brandContext);
      const discovered = productFromDiscovery(result, draft.brand_url ?? "");
      const built = buildProductConfigDiff(
        {
          keywords: draft.keywords ?? [],
          competitors: draft.competitors ?? [],
          content_angles: draft.content_angles ?? [],
          seasonal_peaks: draft.seasonal_peaks ?? [],
          key_ingredients: draft.key_ingredients ?? [],
          approved_claims: draft.approved_claims ?? [],
          restricted_claims: draft.restricted_claims ?? [],
          target_demographic: draft.target_demographic ?? "",
          primary_benefit: draft.primary_benefit ?? "",
        },
        discovered,
      );
      setDiff(built);
      setDiffItems(built.items);
      const newCompetitors = built.items.filter(
        (i) => i.field === "Competitors" && i.action === "add",
      ).length;
      if (newCompetitors > 0) {
        setToast(`Claude found ${newCompetitors} new competitors`);
      }
    } catch {
      setToast("Re-analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const updateDiffItem = (id: string, accepted: boolean) => {
    setDiffItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, accepted } : item)),
    );
  };

  const applyDiff = () => {
    if (!diff) return;
    const items = diffItems;
    const fieldMap: Record<string, keyof typeof draft> = {
      Keywords: "keywords",
      Competitors: "competitors",
      "Content angles": "content_angles",
      "Seasonal peaks": "seasonal_peaks",
      Ingredients: "key_ingredients",
      "Approved claims": "approved_claims",
      "Restricted claims": "restricted_claims",
    };

    const next = { ...draft };
    for (const [label, key] of Object.entries(fieldMap)) {
      const current = (next[key] as string[]) ?? [];
      next[key] = applyAcceptedDiff(current, items, label) as never;
    }

    const demoUpdate = items.find(
      (i) => i.field === "Target demographic" && i.accepted === true,
    );
    if (demoUpdate) next.target_demographic = demoUpdate.value;

    const benefitUpdate = items.find(
      (i) => i.field === "Primary benefit" && i.accepted === true,
    );
    if (benefitUpdate) next.primary_benefit = benefitUpdate.value;

    const newSources = { ...(next.competitor_sources ?? {}) };
    for (const item of items) {
      if (item.field === "Competitors" && item.action === "add" && item.accepted) {
        newSources[item.value] = "auto";
      }
    }
    next.competitor_sources = newSources;

    setDraft(next);
    setDiff(null);
    setDiffItems([]);
    setToast("Selected changes applied.");
  };

  const suggestMoreKeywords = async () => {
    setSuggestingKw(true);
    try {
      const { keywords } = await suggestKeywords(
        draft.name,
        draft.keywords ?? [],
        brandContext,
      );
      setDraft({ ...draft, keywords: [...(draft.keywords ?? []), ...keywords] });
      setToast(`Added ${keywords.length} suggested keywords.`);
    } catch {
      setToast("Keyword suggestion failed.");
    } finally {
      setSuggestingKw(false);
    }
  };

  const discoverMoreCompetitors = async () => {
    setDiscoveringComp(true);
    try {
      const { competitors } = await discoverCompetitors(
        draft.name,
        draft.competitors ?? [],
        brandContext,
        draft.product_url,
      );
      const sources = { ...(draft.competitor_sources ?? {}) };
      for (const c of competitors) sources[c] = "auto";
      setDraft({
        ...draft,
        competitors: [...(draft.competitors ?? []), ...competitors],
        competitor_sources: sources,
      });
      setToast(`Discovered ${competitors.length} competitors.`);
    } catch {
      setToast("Competitor discovery failed.");
    } finally {
      setDiscoveringComp(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setShowProgress(true);
    setProgress(0);
    setToast(null);
    try {
      await updateProductConfig(product.id, draft);
      setToastVariant("success");
      setToast("Saved. Regenerating with new config…");
      await simulateRegeneration(setProgress);
      await refreshWorkspace();
      const newCount = (draft.competitors?.length ?? 0) - prevCompetitorCount;
      if (newCount > 0) {
        setToast(
          `Saved. ${newCount} new competitors added to tracking. Dashboard updated with new context.`,
        );
      } else {
        setToast("Saved. Dashboard updated with new context.");
      }
    } catch (err) {
      setToastVariant("error");
      setToast(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
      setShowProgress(false);
    }
  };

  const addCompetitor = () => {
    const trimmed = competitorInput.trim();
    if (!trimmed) return;
    const sources = { ...(draft.competitor_sources ?? {}), [trimmed]: "manual" as const };
    setDraft({
      ...draft,
      competitors: [...(draft.competitors ?? []), trimmed],
      competitor_sources: sources,
    });
    setCompetitorInput("");
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={product.id}
          onChange={(e) => onSelectProduct(e.target.value)}
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        >
          {clientProducts.map((p) => (
            <option key={p.id} value={p.id} className="bg-[var(--bg)]">
              {p.name}
            </option>
          ))}
        </select>
        {onAddProduct && (
          <button
            type="button"
            onClick={onAddProduct}
            className="rounded-lg border border-[var(--cyan)]/40 px-3 py-2 text-sm text-[var(--cyan)] hover:bg-[var(--cyan)]/10"
          >
            + Add New Product
          </button>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase text-white/40">Discovery</p>
        <TextInput
          label="Product URL"
          value={draft.product_url ?? ""}
          onChange={(v) => setDraft({ ...draft, product_url: v })}
        />
        <button
          type="button"
          onClick={() => void reanalyze()}
          disabled={analyzing}
          className="mt-2 rounded-lg border border-[var(--cyan)]/40 px-4 py-2 text-sm text-[var(--cyan)] hover:bg-[var(--cyan)]/10 disabled:opacity-40"
        >
          {analyzing ? "Analyzing…" : "Re-analyze from URL"}
        </button>
      </div>

      {diff && (
        <ConfigDiffPanel
          diff={{ ...diff, items: diffItems }}
          onUpdateItem={updateDiffItem}
          onApply={applyDiff}
        />
      )}

      <TextInput label="Product Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
      <TextInput
        label="Brand URL"
        value={draft.brand_url ?? ""}
        onChange={(v) => setDraft({ ...draft, brand_url: v })}
      />
      <TextArea
        label="Primary Benefit"
        value={draft.primary_benefit ?? ""}
        onChange={(v) => setDraft({ ...draft, primary_benefit: v })}
        rows={3}
      />
      <TextInput
        label="Target Demographic"
        value={draft.target_demographic ?? ""}
        onChange={(v) => setDraft({ ...draft, target_demographic: v })}
      />
      <TagInput
        label="Key Ingredients"
        values={draft.key_ingredients ?? []}
        onChange={(v) => setDraft({ ...draft, key_ingredients: v })}
      />

      <div className="space-y-2 rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono-label text-[10px] uppercase text-white/40">Keywords</p>
          <button
            type="button"
            onClick={() => void suggestMoreKeywords()}
            disabled={suggestingKw}
            className="text-xs text-[var(--cyan)] hover:underline disabled:opacity-40"
          >
            {suggestingKw ? "Suggesting…" : "Suggest more keywords"}
          </button>
        </div>
        <TagInput
          label=""
          values={draft.keywords ?? []}
          onChange={(v) => setDraft({ ...draft, keywords: v })}
          placeholder="Add keyword"
        />
      </div>

      <div className="space-y-2 rounded-xl border border-white/10 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono-label text-[10px] uppercase text-white/40">Competitors</p>
          <button
            type="button"
            onClick={() => void discoverMoreCompetitors()}
            disabled={discoveringComp}
            className="text-xs text-[var(--cyan)] hover:underline disabled:opacity-40"
          >
            {discoveringComp ? "Discovering…" : "Discover competitors"}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(draft.competitors ?? []).map((c) => (
            <span
              key={c}
              className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-xs text-white/70"
            >
              {c}
              <span className="font-mono-label text-[9px] text-white/35">
                {competitorBadge(c)}
              </span>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    competitors: draft.competitors?.filter((x) => x !== c),
                  })
                }
                className="text-white/40 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            value={competitorInput}
            onChange={(e) => setCompetitorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCompetitor();
              }
            }}
            placeholder="Add competitor"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--cyan)]/40"
          />
          <button
            type="button"
            onClick={addCompetitor}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
          >
            Add
          </button>
        </div>
      </div>

      <TagInput
        label="Content Angles"
        values={draft.content_angles ?? []}
        onChange={(v) => setDraft({ ...draft, content_angles: v })}
      />
      <MonthCheckboxes
        label="Seasonal Peaks"
        selected={draft.seasonal_peaks ?? []}
        onChange={(v) => setDraft({ ...draft, seasonal_peaks: v })}
      />
      <PlatformCheckboxes
        label="Active Platforms"
        selected={draft.primary_platforms ?? []}
        onChange={(v) => setDraft({ ...draft, primary_platforms: v })}
      />

      <div className="rounded-xl border border-white/10 p-4 space-y-4">
        <p className="font-mono-label text-[10px] uppercase text-white/40">Compliance</p>
        <TagInput
          label="Approved Claims"
          values={draft.approved_claims ?? []}
          onChange={(v) => setDraft({ ...draft, approved_claims: v })}
          variant="green"
        />
        <TagInput
          label="Restricted Claims"
          values={draft.restricted_claims ?? []}
          onChange={(v) => setDraft({ ...draft, restricted_claims: v })}
          variant="red"
        />
        <TextArea
          label="Compliance Notes"
          value={draft.compliance_notes ?? ""}
          onChange={(v) => setDraft({ ...draft, compliance_notes: v })}
          rows={2}
        />
      </div>

      <TagInput label="Tags" values={draft.tags ?? []} onChange={(v) => setDraft({ ...draft, tags: v })} />
      <TextArea
        label="Internal Notes"
        value={draft.internal_notes ?? ""}
        onChange={(v) => setDraft({ ...draft, internal_notes: v })}
        rows={3}
      />

      <ProgressOverlay
        visible={showProgress}
        message="Regenerating intelligence with updated config…"
        progress={progress}
      />
      {toast && (
        <Toast message={toast} variant={toastVariant} onDismiss={() => setToast(null)} />
      )}
      <SaveRegenerateButton onClick={() => void save()} saving={saving} />
    </div>
  );
}
