"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { discoverBrand } from "@/lib/ai/discover";
import type { BrandDiscovery } from "@/lib/ai/types";
import { normalizePlatforms } from "@/lib/config/constants";
import { ROUTES } from "@/lib/navigation";
import {
  insertAllProductsRow,
  insertClientWithAccess,
  insertProduct,
  type ClientConfigInput,
} from "@/lib/data/save-config";
import { createClient } from "@/lib/supabase/client";
import {
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

function brandFromDiscovery(data: BrandDiscovery): BrandDraft {
  return {
    name: data.name,
    brand_voice: data.brand_voice,
    compliance_notes: data.compliance_notes,
    brand_url: data.brand_url,
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
  const router = useRouter();
  const { runAgents, refreshWorkspace, setSelectedClient, setSelectedProduct } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [brandUrl, setBrandUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
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

  const [products, setProducts] = useState<ProductDraft[]>([]);
  const [currentProduct, setCurrentProduct] = useState<ProductDraft>(() =>
    emptyProductDraft(),
  );
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const analyzeBrand = async () => {
    if (!brandUrl.trim()) return;
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const result = await discoverBrand(brandUrl.trim());
      setBrand(brandFromDiscovery(result));
      setBrandDiscovered(true);
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Brand analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const addProductToList = () => {
    if (!currentProduct.name.trim()) return;
    setProducts((prev) => [...prev, currentProduct]);
    setCurrentProduct(emptyProductDraft(brand.brand_url ?? ""));
  };

  const totalKeywords = products.reduce((n, p) => n + (p.keywords?.length ?? 0), 0);
  const totalCompetitors = new Set(
    products.flatMap((p) => p.competitors ?? []).concat(brand.competitors ?? []),
  ).size;

  const saveAll = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const client = await insertClientWithAccess(brand, user.id, "admin");
      const allProductsRow = await insertAllProductsRow(client.id, brand);

      const productList =
        products.length > 0 ? products : currentProduct.name ? [currentProduct] : [];

      for (const p of productList) {
        await insertProduct(client.id, {
          ...p,
          brand_url: p.brand_url || brand.brand_url,
        });
      }

      await refreshWorkspace();
      setSelectedClient(client);
      setSelectedProduct(allProductsRow);
      runAgents();
      setSuccess(`${brand.name} configured. Generating first intelligence brief…`);
      setTimeout(() => {
        router.push(ROUTES.dashboard);
        onClose();
      }, 1800);
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
              Step {step} of 3
            </p>
            <h2 className="font-heading text-lg font-semibold text-white">New Client</h2>
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
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-heading text-base font-semibold text-white">
                  Brand URL Discovery
                </h3>
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
                  disabled={analyzing || !brandUrl.trim()}
                  className="mt-3 rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
                >
                  {analyzing ? "Analyzing brand…" : "Analyze Brand"}
                </button>
                {analyzeError && (
                  <p className="mt-2 text-sm text-[var(--red)]">{analyzeError}</p>
                )}
              </div>

              {brandDiscovered && (
                <>
                  <p className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/5 px-3 py-2 text-sm text-[var(--cyan)]">
                    AI found the following — review and edit anything before saving
                  </p>
                  <div className="space-y-4">
                    <TextInput
                      label="Brand Name"
                      value={brand.name}
                      onChange={(v) => setBrand({ ...brand, name: v })}
                    />
                    <TextArea
                      label="Brand Voice"
                      value={brand.brand_voice}
                      onChange={(v) => setBrand({ ...brand, brand_voice: v })}
                      rows={4}
                    />
                    <TextArea
                      label="Compliance Notes"
                      value={brand.compliance_notes}
                      onChange={(v) => setBrand({ ...brand, compliance_notes: v })}
                      rows={3}
                    />
                    <TextInput
                      label="Primary Category"
                      value={brand.primary_category ?? ""}
                      onChange={(v) => setBrand({ ...brand, primary_category: v })}
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
                      label="Competitors"
                      values={brand.competitors ?? []}
                      onChange={(v) => setBrand({ ...brand, competitors: v })}
                      placeholder="Add competitor"
                    />
                    <TextInput
                      label="Target Demographic"
                      value={brand.target_demographic ?? ""}
                      onChange={(v) => setBrand({ ...brand, target_demographic: v })}
                    />
                    <PlatformCheckboxes
                      label="Active Platforms"
                      selected={brand.primary_platforms ?? []}
                      onChange={(v) => setBrand({ ...brand, primary_platforms: v })}
                    />
                    <TextArea
                      label="Notes (internal only)"
                      value={brand.internal_notes ?? ""}
                      onChange={(v) => setBrand({ ...brand, internal_notes: v })}
                      rows={2}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <ProductWizardStep
                draft={currentProduct}
                onChange={setCurrentProduct}
                brandContext={{
                  name: brand.name,
                  category: brand.primary_category ?? "General",
                }}
                brandUrl={brand.brand_url ?? brandUrl}
                title="Add your first product"
                subtitle="Now let's add your first product — paste a product page URL."
              />

              {products.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="font-mono-label text-[10px] uppercase text-white/40">
                    Products queued ({products.length})
                  </p>
                  <ul className="mt-2 space-y-1">
                    {products.map((p, i) => (
                      <li key={`${p.name}-${i}`} className="text-sm text-white/70">
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addProductToList}
                  disabled={!currentProduct.name.trim()}
                  className="rounded-lg border border-[var(--cyan)]/40 px-4 py-2 text-sm text-[var(--cyan)] hover:bg-[var(--cyan)]/10 disabled:opacity-40"
                >
                  Add Another Product
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-heading text-base font-semibold text-white">
                Confirm & Save
              </h3>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
                <p>
                  <span className="text-white/40">Client:</span> {brand.name}
                </p>
                <p className="mt-2">
                  <span className="text-white/40">Products:</span>{" "}
                  {products.length > 0
                    ? products.map((p) => p.name).join(", ")
                    : currentProduct.name || "None yet"}
                </p>
                <p className="mt-2">
                  <span className="text-white/40">Competitors tracked:</span> {totalCompetitors}
                </p>
                <p className="mt-2">
                  <span className="text-white/40">Keywords monitored:</span> {totalKeywords}
                </p>
              </div>
              {success && (
                <p className="text-sm text-[var(--green)]">{success}</p>
              )}
              {saveError && <p className="text-sm text-[var(--red)]">{saveError}</p>}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-2 border-t border-[#1C2530] px-4 py-3">
          <button
            type="button"
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
            disabled={step === 1}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/60 hover:bg-white/5 disabled:opacity-30"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !brandDiscovered) return;
                if (step === 2 && products.length === 0 && currentProduct.name) {
                  addProductToList();
                }
                setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
              }}
              disabled={step === 1 && !brandDiscovered}
              className="rounded-lg bg-[var(--cyan)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void saveAll()}
              disabled={saving}
              className="rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-4 py-2 text-sm font-semibold text-[var(--bg)] hover:opacity-90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save & Generate First Brief"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
