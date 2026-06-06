"use client";

import { useState } from "react";
import { PARTIAL_ANALYSIS_WARNING } from "@/lib/ai/discovery-result";
import { guessNameFromUrl } from "@/lib/ai/fetch-page-text";
import type { BrandContext, DiscoveryResponse, ProductDiscovery } from "@/lib/ai/types";
import { normalizePlatforms } from "@/lib/config/constants";
import type { ProductConfigInput } from "@/lib/data/save-config";
import {
  AnalyzingSpinner,
  MonthCheckboxes,
  PlatformCheckboxes,
  TagInput,
  TextArea,
  TextInput,
} from "@/components/settings/settings-ui";

export type ProductDraft = ProductConfigInput & {
  certifications: string[];
};

export function emptyProductDraft(brandUrl = ""): ProductDraft {
  return {
    name: "",
    product_url: "",
    brand_url: brandUrl,
    primary_benefit: "",
    key_ingredients: [],
    target_demographic: "",
    keywords: [],
    competitors: [],
    content_angles: [],
    seasonal_peaks: [],
    primary_platforms: [],
    approved_claims: [],
    restricted_claims: [],
    certifications: [],
    compliance_notes: "",
    internal_notes: "",
    price_tier: "",
    tags: [],
    competitor_sources: {},
  };
}

export function productFromDiscovery(
  data: ProductDiscovery,
  brandUrl: string,
): ProductDraft {
  const sources = Object.fromEntries(
    (data.competitors ?? []).map((c) => [c, "auto" as const]),
  );
  return {
    name: data.name,
    product_url: data.product_url,
    brand_url: data.brand_url || brandUrl,
    primary_benefit: data.primary_benefit,
    key_ingredients: data.key_ingredients ?? [],
    target_demographic: data.target_demographic,
    keywords: data.keywords ?? [],
    competitors: data.competitors ?? [],
    content_angles: data.content_angles ?? [],
    seasonal_peaks: data.seasonal_peaks ?? [],
    primary_platforms: normalizePlatforms(data.primary_platforms ?? []),
    approved_claims: data.approved_claims ?? [],
    restricted_claims: data.restricted_claims ?? [],
    certifications: data.certifications ?? [],
    price_tier: data.price_tier,
    internal_notes: "",
    tags: [],
    competitor_sources: sources,
  };
}

type ProductWizardStepProps = {
  draft: ProductDraft;
  onChange: (draft: ProductDraft) => void;
  brandContext: BrandContext;
  brandUrl: string;
  title?: string;
  subtitle?: string;
};

export function ProductWizardStep({
  draft,
  onChange,
  brandContext,
  brandUrl,
  title = "Add product",
  subtitle = "Paste a product URL to analyze with AI, then review and edit all fields.",
}: ProductWizardStepProps) {
  const [productUrl, setProductUrl] = useState(draft.product_url ?? "");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeWarning, setAnalyzeWarning] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState(false);

  const patch = (partial: Partial<ProductDraft>) => onChange({ ...draft, ...partial });

  const showFormWithPartial = (url: string) => {
    onChange({
      ...draft,
      product_url: url,
      brand_url: draft.brand_url || brandUrl,
      name: draft.name || guessNameFromUrl(url),
    });
    setDiscovered(true);
    setAnalyzeWarning(PARTIAL_ANALYSIS_WARNING);
  };

  const analyze = async () => {
    const url = productUrl.trim();
    console.log("Analyze clicked", url);

    if (!url) {
      console.warn("Analyze aborted: product URL is empty");
      return;
    }

    setAnalyzing(true);
    setAnalyzeWarning(null);

    try {
      console.log("Calling API...", { url, brandContext, brandUrl });

      const response = await fetch("/api/discover/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, brandContext, brandUrl }),
      });

      console.log("API response status:", response.status);

      const raw = await response.text();
      let result: DiscoveryResponse<ProductDiscovery>;
      try {
        result = JSON.parse(raw) as DiscoveryResponse<ProductDiscovery>;
      } catch {
        const preview = raw.trim().slice(0, 80);
        throw new Error(
          preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")
            ? `Server returned HTML (${response.status})`
            : `Invalid JSON response (${response.status})`,
        );
      }

      if (!response.ok && !result.incomplete) {
        throw new Error(result.error ?? `Request failed (${response.status})`);
      }

      console.log("API result:", result);

      const next = {
        ...draft,
        ...productFromDiscovery(result, brandUrl),
        product_url: url,
      };
      onChange(next);
      setDiscovered(true);

      if (result.incomplete || result.warning) {
        setAnalyzeWarning(result.warning ?? PARTIAL_ANALYSIS_WARNING);
      }
    } catch (error) {
      console.error("Analyze Product failed:", error);
      showFormWithPartial(url);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-lg font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/50">{subtitle}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <TextInput
          label="Product URL"
          value={productUrl}
          onChange={setProductUrl}
          placeholder="https://www.youtheory.com/collections/hyaluronic-acid/products/hyaluronic-acid"
        />
        <button
          type="button"
          onClick={() => {
            console.log("Analyze button onClick fired");
            void analyze();
          }}
          disabled={analyzing}
          className="mt-3 rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
        >
          Analyze Product
        </button>
        {analyzing && <AnalyzingSpinner label="Analyzing product URL..." />}
        {analyzeWarning && (
          <p className="mt-2 text-sm text-amber-300/90">{analyzeWarning}</p>
        )}
      </div>

      {discovered && !analyzeWarning && (
        <p className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/5 px-3 py-2 text-sm text-[var(--cyan)]">
          AI found the following — review and edit anything before saving
        </p>
      )}

      {(discovered || draft.name) && (
        <div className="space-y-4">
          <TextInput label="Product Name" value={draft.name} onChange={(v) => patch({ name: v })} />
          <TextArea
            label="Primary Benefit"
            value={draft.primary_benefit ?? ""}
            onChange={(v) => patch({ primary_benefit: v })}
            rows={3}
          />
          <TagInput
            label="Key Ingredients"
            values={draft.key_ingredients ?? []}
            onChange={(v) => patch({ key_ingredients: v })}
            placeholder="Add ingredient"
          />
          <TextInput
            label="Target Demographic"
            value={draft.target_demographic ?? ""}
            onChange={(v) => patch({ target_demographic: v })}
          />
          <TagInput
            label="Keywords"
            values={draft.keywords ?? []}
            onChange={(v) => patch({ keywords: v })}
            placeholder="Add keyword"
          />
          <TagInput
            label="Competitors"
            values={draft.competitors ?? []}
            onChange={(v) => {
              const sources = { ...(draft.competitor_sources ?? {}) };
              for (const c of v) {
                if (!sources[c]) sources[c] = "manual";
              }
              for (const key of Object.keys(sources)) {
                if (!v.includes(key)) delete sources[key];
              }
              patch({ competitors: v, competitor_sources: sources });
            }}
            placeholder="Add competitor"
            hint="These differ from brand competitors — product-level only"
          />
          <TagInput
            label="Content Angles"
            values={draft.content_angles ?? []}
            onChange={(v) => patch({ content_angles: v })}
            placeholder="Add angle"
          />
          <MonthCheckboxes
            label="Seasonal Peaks"
            selected={draft.seasonal_peaks ?? []}
            onChange={(v) => patch({ seasonal_peaks: v })}
          />
          <PlatformCheckboxes
            label="Active Platforms"
            selected={draft.primary_platforms ?? []}
            onChange={(v) => patch({ primary_platforms: v })}
          />
          <TagInput
            label="Approved Claims"
            values={draft.approved_claims ?? []}
            onChange={(v) => patch({ approved_claims: v })}
            variant="green"
            placeholder="Add approved claim"
          />
          <TagInput
            label="Restricted Claims"
            values={draft.restricted_claims ?? []}
            onChange={(v) => patch({ restricted_claims: v })}
            variant="red"
            placeholder="Add restricted claim"
          />
          <TextArea
            label="Internal Notes"
            value={draft.internal_notes ?? ""}
            onChange={(v) => patch({ internal_notes: v })}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
