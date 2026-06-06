"use client";

import { useState } from "react";
import { useApp } from "@/context/app-context";
import { discoverBrand } from "@/lib/ai/discover";
import { PARTIAL_ANALYSIS_WARNING } from "@/lib/ai/discovery-result";
import type { BrandDiscovery } from "@/lib/ai/types";
import { normalizePlatforms } from "@/lib/config/constants";
import { updateClientConfig } from "@/lib/data/save-config";
import type { Client } from "@/types/database";
import {
  AnalyzingSpinner,
  PlatformCheckboxes,
  ProgressOverlay,
  SaveRegenerateButton,
  simulateRegeneration,
  TagInput,
  TextArea,
  TextInput,
  Toast,
} from "@/components/settings/settings-ui";

export function ClientConfigForm({ client }: { client: Client }) {
  const { refreshWorkspace } = useApp();

  const [name, setName] = useState(client.name);
  const [brandUrl, setBrandUrl] = useState(client.brand_url ?? "");
  const [brandVoice, setBrandVoice] = useState(client.brand_voice ?? "");
  const [compliance, setCompliance] = useState(client.compliance_notes ?? "");
  const [primaryCategory, setPrimaryCategory] = useState(client.primary_category ?? "");
  const [certifications, setCertifications] = useState(client.certifications ?? []);
  const [keyClaims, setKeyClaims] = useState(client.key_brand_claims ?? []);
  const [competitors, setCompetitors] = useState(client.suggested_competitors ?? []);
  const [demographic, setDemographic] = useState(client.target_demographic ?? "");
  const [platforms, setPlatforms] = useState(client.primary_platforms ?? []);
  const [internalNotes, setInternalNotes] = useState(client.internal_notes ?? "");

  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<"success" | "info" | "error">("success");

  const applyDiscovery = (data: BrandDiscovery) => {
    setName(data.name || name);
    setBrandVoice(data.brand_voice || brandVoice);
    setCompliance(data.compliance_notes || compliance);
    setPrimaryCategory(data.primary_category || primaryCategory);
    setCertifications(data.certifications ?? certifications);
    setKeyClaims(data.key_brand_claims ?? keyClaims);
    setCompetitors(data.suggested_competitors ?? competitors);
    setDemographic(data.target_demographic || demographic);
    setPlatforms(normalizePlatforms(data.primary_platforms ?? platforms));
    setBrandUrl(data.brand_url || brandUrl);
  };

  const reanalyze = async () => {
    if (!brandUrl.trim()) return;
    setAnalyzing(true);
    setToast(null);
    try {
      const result = await discoverBrand(brandUrl.trim());
      applyDiscovery(result);
      if (result.incomplete || result.warning) {
        setToastVariant("info");
        setToast(result.warning ?? PARTIAL_ANALYSIS_WARNING);
      } else {
        setToastVariant("success");
        setToast("Brand re-analyzed — review updated fields before saving.");
      }
    } catch {
      setToastVariant("info");
      setToast(PARTIAL_ANALYSIS_WARNING);
    } finally {
      setAnalyzing(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setShowProgress(true);
    setProgress(0);
    setToast(null);
    try {
      await updateClientConfig(client.id, {
        name,
        brand_voice: brandVoice,
        compliance_notes: compliance,
        brand_url: brandUrl,
        primary_category: primaryCategory,
        target_demographic: demographic,
        primary_platforms: platforms,
        certifications,
        key_brand_claims: keyClaims,
        competitors,
        internal_notes: internalNotes,
      });
      setToastVariant("success");
      setToast("Saved. Regenerating with new config…");
      await simulateRegeneration(setProgress);
      await refreshWorkspace();
      setToast("Saved. Dashboard updated with new context.");
    } catch (err) {
      setToastVariant("error");
      setToast(err instanceof Error ? err.message : "Save failed. Please try again.");
    } finally {
      setSaving(false);
      setShowProgress(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase text-white/40">Discovery</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            value={brandUrl}
            onChange={(e) => setBrandUrl(e.target.value)}
            placeholder="https://www.youtheory.com"
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--cyan)]/40"
          />
          <button
            type="button"
            onClick={() => void reanalyze()}
            disabled={analyzing || !brandUrl.trim()}
            className="shrink-0 rounded-lg border border-[var(--cyan)]/40 px-4 py-2 text-sm text-[var(--cyan)] hover:bg-[var(--cyan)]/10 disabled:opacity-40"
          >
            Re-analyze from URL
          </button>
        </div>
        {analyzing && <AnalyzingSpinner label="Analyzing brand URL..." />}
      </div>

      <TextInput label="Brand Name" value={name} onChange={setName} />
      <TextArea
        label="Brand Voice"
        value={brandVoice}
        onChange={setBrandVoice}
        rows={4}
        placeholder="Clean, science-backed, approachable…"
      />
      <TextInput label="Primary Category" value={primaryCategory} onChange={setPrimaryCategory} />
      <TextArea label="Compliance Notes" value={compliance} onChange={setCompliance} rows={3} />
      <TagInput label="Certifications" values={certifications} onChange={setCertifications} />
      <TagInput label="Key Brand Claims" values={keyClaims} onChange={setKeyClaims} />
      <TagInput
        label="Brand-Level Competitors"
        values={competitors}
        onChange={setCompetitors}
        hint="Product configs can override these"
      />
      <TextInput label="Target Demographic" value={demographic} onChange={setDemographic} />
      <PlatformCheckboxes
        label="Active Platforms (brand-wide default)"
        selected={platforms}
        onChange={setPlatforms}
      />
      <TextArea
        label="Internal Notes"
        value={internalNotes}
        onChange={setInternalNotes}
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
