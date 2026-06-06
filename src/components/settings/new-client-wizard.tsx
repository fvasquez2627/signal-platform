"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import { discoverBrand } from "@/lib/ai/discover";
import { PARTIAL_ANALYSIS_WARNING } from "@/lib/ai/discovery-result";
import { guessNameFromUrl } from "@/lib/ai/fetch-page-text";
import type { BrandDiscovery } from "@/lib/ai/types";
import { normalizePlatforms } from "@/lib/config/constants";
import {
  insertAllProductsRow,
  insertClientWithAccess,
  insertProduct,
  type ClientConfigInput,
} from "@/lib/data/save-config";
import { createClient } from "@/lib/supabase/client";
import {
  AnalyzingSpinner,
  PlatformCheckboxes,
  TagInput,
  TextArea,
  TextInput,
} from "@/components/settings/settings-ui";
import {
  emptyProductDraft,
  ProductWizardStep,
  type ProductDraft,
} from "@/components/settings/product-wizard-step";

type NewClientWizardProps = {
  onClose: () => void;
};

type BrandDraft = ClientConfigInput & {
  certifications: string[];
  key_brand_claims: string[];
};

function brandFromDiscovery(data: BrandDiscovery, url: string): BrandDraft {
  return {
    name: data.name,
    brand_voice: data.brand_voice,
    compliance_notes: data.compliance_notes,
    brand_url: data.brand_url || url,
    primary_category: data.primary_category,
    target_demographic: data.target_demographic,
    primary_platforms: normalizePlatforms(data.primary_platforms ?? []),
    certifications: data.certifications ?? [],
    key_brand_claims: data.key_brand_claims ?? [],
    competitors: data.suggested_competitors ?? [],
    internal_notes: "",
  };
}

export function NewClientWizard({ onClose }: NewClientWizardProps) {
  const { refreshWorkspace, setSelectedClient, setSelectedProduct } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [brandUrl, setBrandUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeWarning, setAnalyzeWarning] = useState<string | null>(null);
  const [brandDiscovered, setBrandDiscovered] = useState(false);
  const [brand, setBrand] = useState<BrandDraft>({
    name: "",
    brand_voice: "",
    compliance_notes: "",
    brand_url: "",
    primary_category: "",
    target_demographic: "",
    primary_platforms: [],
    certifications: [],
    key_brand_claims: [],
    competitors: [],
    internal_notes: "",
  });

  const [currentProduct, setCurrentProduct] = useState<ProductDraft>(() =>
    emptyProductDraft(),
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canSave = brandDiscovered && brand.name.trim().length > 0;

  const analyzeBrand = async () => {
    const url = brandUrl.trim();
    if (!url) return;

    setAnalyzing(true);
    setAnalyzeWarning(null);
    try {
      const result = await discoverBrand(url);
      setBrand(brandFromDiscovery(result, url));
      setBrandDiscovered(true);
      if (result.incomplete || result.warning) {
        setAnalyzeWarning(result.warning ?? PARTIAL_ANALYSIS_WARNING);
      }
    } catch {
      setBrand((prev) => ({
        ...prev,
        brand_url: url,
        name: prev.name || guessNameFromUrl(url),
      }));
      setBrandDiscovered(true);
      setAnalyzeWarning(PARTIAL_ANALYSIS_WARNING);
    } finally {
      setAnalyzing(false);
    }
  };

  const goToProductStep = () => {
    setCurrentProduct(emptyProductDraft(brand.brand_url ?? brandUrl));
    setStep(2);
  };

  const saveClient = async (includeProduct: boolean) => {
    if (!canSave) return;

    setSaving(true);
    setSaveError(null);
    setSuccess(null);

    const brandPayload: BrandDraft = {
      ...brand,
      brand_url: brand.brand_url?.trim() || brandUrl.trim(),
    };

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const client = await insertClientWithAccess(brandPayload, user.id, "admin");
      const allProductsRow = await insertAllProductsRow(client.id, brandPayload);

      let selectedProduct = allProductsRow;
      if (includeProduct && currentProduct.name.trim()) {
        selectedProduct = await insertProduct(client.id, {
          ...currentProduct,
          brand_url: currentProduct.brand_url || brandPayload.brand_url,
        });
      }

      await refreshWorkspace();
      setSelectedClient(client);
      setSelectedProduct(selectedProduct);
      setSuccess(`Client added. Switching to ${client.name}…`);
      setTimeout(() => onClose(), 2000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-[#1C2530] bg-[#0A0D12] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#1C2530] px-4 py-3">
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
              Step {step} of 2
            </p>
            <h2 className="font-heading text-lg font-semibold text-white">Add New Client</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/60 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {success && (
            <p className="mb-4 rounded-lg border border-[var(--green)]/30 bg-[var(--green)]/10 px-3 py-2 text-sm text-[var(--green)]">
              {success}
            </p>
          )}
          {saveError && (
            <p className="mb-4 text-sm text-[var(--red)]">{saveError}</p>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading text-base font-semibold text-white">Brand URL</h3>
                <p className="mt-1 text-sm text-white/50">
                  Paste the brand website to auto-fill configuration with AI.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <TextInput
                  label="Brand website URL"
                  value={brandUrl}
                  onChange={setBrandUrl}
                  placeholder="https://www.youtheory.com"
                />
                <button
                  type="button"
                  onClick={() => void analyzeBrand()}
                  disabled={analyzing}
                  className="mt-3 rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
                >
                  Analyze Brand
                </button>
                {analyzing && <AnalyzingSpinner label="Analyzing brand URL..." />}
                {analyzeWarning && (
                  <p className="mt-2 text-sm text-amber-300/90">{analyzeWarning}</p>
                )}
              </div>

              {brandDiscovered && (
                <>
                  {!analyzeWarning && (
                    <p className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/5 px-3 py-2 text-sm text-[var(--cyan)]">
                      AI found the following — review and edit anything before saving
                    </p>
                  )}
                  <div className="space-y-4">
                    <TextInput
                      label="Brand Name"
                      value={brand.name}
                      onChange={(v) => setBrand({ ...brand, name: v })}
                    />
                    <TextInput
                      label="Brand URL"
                      value={brand.brand_url ?? ""}
                      onChange={(v) => setBrand({ ...brand, brand_url: v })}
                      placeholder="https://www.youtheory.com"
                    />
                    <TextArea
                      label="Brand Voice"
                      value={brand.brand_voice}
                      onChange={(v) => setBrand({ ...brand, brand_voice: v })}
                      rows={4}
                    />
                    <TextInput
                      label="Primary Category"
                      value={brand.primary_category ?? ""}
                      onChange={(v) => setBrand({ ...brand, primary_category: v })}
                    />
                    <TextArea
                      label="Compliance Notes"
                      value={brand.compliance_notes}
                      onChange={(v) => setBrand({ ...brand, compliance_notes: v })}
                      rows={3}
                    />
                    <TextInput
                      label="Target Demographic"
                      value={brand.target_demographic ?? ""}
                      onChange={(v) => setBrand({ ...brand, target_demographic: v })}
                    />
                    <TagInput
                      label="Certifications"
                      values={brand.certifications ?? []}
                      onChange={(v) => setBrand({ ...brand, certifications: v })}
                      placeholder="NSF, GMP…"
                    />
                    <TagInput
                      label="Key Brand Claims"
                      values={brand.key_brand_claims ?? []}
                      onChange={(v) => setBrand({ ...brand, key_brand_claims: v })}
                    />
                    <TagInput
                      label="Brand-Level Competitors"
                      values={brand.competitors ?? []}
                      onChange={(v) => setBrand({ ...brand, competitors: v })}
                      placeholder="Add competitor"
                    />
                    <PlatformCheckboxes
                      label="Active Platforms"
                      selected={brand.primary_platforms ?? []}
                      onChange={(v) => setBrand({ ...brand, primary_platforms: v })}
                    />
                    <TextArea
                      label="Internal Notes"
                      value={brand.internal_notes ?? ""}
                      onChange={(v) => setBrand({ ...brand, internal_notes: v })}
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <ProductWizardStep
              draft={currentProduct}
              onChange={setCurrentProduct}
              brandContext={{
                name: brand.name,
                category: brand.primary_category ?? "General",
              }}
              brandUrl={brand.brand_url ?? brandUrl}
              title="Add first product (optional)"
              subtitle="Paste a product page URL to analyze with AI, or skip and add products later."
            />
          )}
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-[#1C2530] px-4 py-3">
          {step === 1 ? (
            <>
              <div />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void saveClient(false)}
                  disabled={saving || !canSave}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Save Client Only"}
                </button>
                <button
                  type="button"
                  onClick={goToProductStep}
                  disabled={!canSave}
                  className="rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-40"
                >
                  Next: Add First Product
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={saving}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30"
              >
                Back
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void saveClient(false)}
                  disabled={saving}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/70 hover:bg-white/5 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Skip for now"}
                </button>
                <button
                  type="button"
                  onClick={() => void saveClient(true)}
                  disabled={saving || !currentProduct.name.trim()}
                  className="rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Client & Product"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
