"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useApp } from "@/context/app-context";
import {
  ACTIVE_DRAFT,
  AI_PROMPTS_DRAFT,
  BUCKET_HEALTH,
  BUCKET_STATUS_STYLES,
  CONTENT_BUCKETS,
  DRAFT_HISTORY,
  DRAFT_STATUS_STYLES,
  GENERATION_STATS,
  GOOGLE_DRAFT,
  META_DRAFT,
  PLATFORM_TABS,
  SPARK_AD_DRAFT,
  SUMMARY,
  TIKTOK_DRAFT,
  type ContentBucket,
  type HistoryPlatformFilter,
  type HistoryStatusFilter,
  type PlatformTab,
} from "@/components/content/mock-data";

type ContentStudioProps = {
  variant: "summary" | "detail";
};

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-white/[0.02] ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <h2 className="font-heading text-sm font-semibold tracking-wide text-white">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-white/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
    >
      {copied ? "Copied" : label}
    </button>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-[var(--cyan)]" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function SummaryView() {
  const [approved, setApproved] = useState(false);
  const { selectedProduct, selectedClient, currentBenefit } = useApp();
  const productName = selectedProduct?.name ?? "All Products";
  const clientName = selectedClient?.name ?? "YouTheory";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Draft pipeline
        </p>
        <p className="mt-2 font-heading text-2xl font-bold text-white">
          {SUMMARY.draftsAwaitingReview}
          <span className="text-base font-normal text-white/45"> drafts awaiting review</span>
        </p>
        <p className="mt-1 font-mono-label text-xs text-white/45">
          Last generated · {SUMMARY.lastGenerated}
        </p>
      </div>

      <Panel
        title="Top Draft Preview"
        action={
          <span className="rounded-md bg-[var(--cyan)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-[var(--cyan)]">
            {SUMMARY.bucket}
          </span>
        }
      >
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
          Hook
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-white/80">
          {personalizeCopy(SUMMARY.topHook, clientName, productName, currentBenefit)}
        </p>
        <p className="mt-3 font-mono-label text-[10px] text-white/35">
          Source · {SUMMARY.signalSource}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setApproved(true)}
            disabled={approved}
            className="rounded-lg bg-[var(--green)] px-4 py-2 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {approved ? "Approved ✓" : "Quick Approve"}
          </button>
        </div>
      </Panel>
    </div>
  );
}

function BucketCard({
  bucket,
  onToggle,
  onNotesChange,
}: {
  bucket: ContentBucket;
  onToggle: (id: string, enabled: boolean) => void;
  onNotesChange: (id: string, notes: string) => void;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 transition-colors ${
        bucket.enabled
          ? "border-[var(--cyan)]/25 bg-[var(--cyan)]/5"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading text-sm font-semibold text-white">{bucket.name}</p>
            <span
              className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${BUCKET_STATUS_STYLES[bucket.status]}`}
            >
              {bucket.status}
            </span>
          </div>
          <p className="mt-1 font-mono-label text-[10px] uppercase tracking-wide text-white/40">
            {bucket.signalSource}
          </p>
          <p className="mt-1.5 text-sm text-white/60">{bucket.rationale}</p>
          <p className="mt-1 font-mono-label text-xs text-white/45">
            {bucket.piecesSuggested} piece{bucket.piecesSuggested !== 1 ? "s" : ""} suggested
          </p>
          {bucket.complianceNote && (
            <p className="mt-2 rounded-md border border-[var(--yellow)]/30 bg-[var(--yellow)]/10 px-2 py-1 text-xs text-[var(--yellow)]">
              {bucket.complianceNote}
            </p>
          )}
        </div>
        <ToggleSwitch
          checked={bucket.enabled}
          onChange={(next) => onToggle(bucket.id, next)}
          label={`Toggle ${bucket.name}`}
        />
      </div>
      <label className="mt-3 block">
        <span className="font-mono-label text-[10px] uppercase tracking-widest text-white/35">
          Direction notes
        </span>
        <textarea
          value={bucket.notes}
          onChange={(e) => onNotesChange(bucket.id, e.target.value)}
          placeholder="Add creative direction…"
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/25 focus:border-[var(--cyan)]/40 focus:outline-none"
        />
      </label>
    </div>
  );
}

function ContentAnglesSection() {
  const { currentAngles, selectedProduct } = useApp();

  if (currentAngles.length === 0) return null;

  return (
    <Panel title="Content Angles">
      <p className="mb-3 text-sm text-white/50">
        Recommended angles for {selectedProduct?.name ?? "this product"}
      </p>
      <div className="flex flex-wrap gap-2">
        {currentAngles.map((angle) => (
          <span
            key={angle}
            className="rounded-lg border border-[var(--cyan)]/25 bg-[var(--cyan)]/10 px-3 py-1.5 text-sm text-[var(--cyan)]"
          >
            {angle}
          </span>
        ))}
      </div>
    </Panel>
  );
}

function personalizeCopy(
  text: string,
  clientName: string,
  productName: string,
  benefit: string,
): string {
  const product = productName === "All Products" ? "wellness supplements" : productName;
  return text
    .replace(/YouTheory/g, clientName)
    .replace(/Collagen Peptides/g, product)
    .replace(/collagen peptides/gi, product.toLowerCase())
    .replace(
      /Skin elasticity, joint support, hair and nail strength/g,
      benefit,
    );
}

function ContentBucketsSection() {
  const { selectedProduct } = useApp();
  const [buckets, setBuckets] = useState(CONTENT_BUCKETS);

  const handleToggle = (id: string, enabled: boolean) => {
    setBuckets((prev) => prev.map((b) => (b.id === id ? { ...b, enabled } : b)));
  };

  const handleNotesChange = (id: string, notes: string) => {
    setBuckets((prev) => prev.map((b) => (b.id === id ? { ...b, notes } : b)));
  };

  return (
    <Panel title="Content Buckets">
      <p className="mb-4 text-sm text-white/50">
        AI-recommended content buckets for {selectedProduct?.name ?? "your product"} based on
        current signals. Toggle buckets on to include in the next agent run.
      </p>
      <div className="space-y-3">
        {buckets.map((bucket) => (
          <BucketCard
            key={bucket.id}
            bucket={bucket}
            onToggle={handleToggle}
            onNotesChange={handleNotesChange}
          />
        ))}
      </div>
    </Panel>
  );
}

function DraftMetaBadges() {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <span className="rounded-md bg-white/5 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-white/55">
        {ACTIVE_DRAFT.signalSource}
      </span>
      <span className="rounded-md bg-[var(--purple)]/15 px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide text-[var(--purple)]">
        {ACTIVE_DRAFT.bucket}
      </span>
      <span className="font-mono-label text-[10px] text-white/35">
        Generated {ACTIVE_DRAFT.generatedAt}
      </span>
    </div>
  );
}

function CopyBlock({
  label,
  text,
  accent,
}: {
  label: string;
  text: string;
  accent: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className={`font-mono-label text-[10px] uppercase tracking-widest ${accent}`}>
          {label}
        </p>
        <CopyButton text={text} />
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-white/75">{text}</p>
    </div>
  );
}

function TikTokTab() {
  const { selectedClient, selectedProduct, currentBenefit } = useApp();
  const clientName = selectedClient?.name ?? "YouTheory";
  const productName = selectedProduct?.name ?? "Collagen Peptides";

  return (
    <div className="space-y-4">
      <DraftMetaBadges />
      <CopyBlock
        label="Hook (0–3 sec)"
        text={personalizeCopy(TIKTOK_DRAFT.hook, clientName, productName, currentBenefit)}
        accent="text-[var(--green)]"
      />
      <CopyBlock
        label="Script body (3–25 sec)"
        text={personalizeCopy(TIKTOK_DRAFT.scriptBody, clientName, productName, currentBenefit)}
        accent="text-[var(--cyan)]"
      />
      <CopyBlock
        label="CTA"
        text={personalizeCopy(TIKTOK_DRAFT.cta, clientName, productName, currentBenefit)}
        accent="text-[var(--purple)]"
      />

      {/* INTEGRATION: tiktok_creative_center
          Toggle: Settings > Integrations > TikTok Creative Center
          When OFF: hide this entire section
          When ON: replace mock data with real API data */}
      <div className="rounded-lg border border-[var(--cyan)]/20 bg-[var(--cyan)]/5 px-4 py-3">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Trending sound pairing
        </p>
        <p className="mt-2 text-sm text-white/75">
          🎵 Suggested:{" "}
          <span className="font-medium text-white">{TIKTOK_DRAFT.sound.name}</span>
          {" — "}
          {TIKTOK_DRAFT.sound.videoCount}
        </p>
      </div>

      <DraftActions />
    </div>
  );
}

function MetaTab() {
  return (
    <div className="space-y-4">
      <DraftMetaBadges />
      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
          Headlines
        </p>
        <ul className="mt-2 space-y-2">
          {META_DRAFT.headlines.map((h, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2"
            >
              <span className="text-sm text-white/75">{h.text}</span>
              <span className="shrink-0 font-mono-label text-[10px] text-white/35">
                {h.chars} chars
              </span>
            </li>
          ))}
        </ul>
      </div>
      <CopyBlock
        label="Primary text"
        text={META_DRAFT.primaryText}
        accent="text-[var(--cyan)]"
      />
      <CopyBlock label="Description" text={META_DRAFT.description} accent="text-[var(--purple)]" />
      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          CTA button options
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {META_DRAFT.ctaOptions.map((cta) => (
            <span
              key={cta}
              className="rounded-md border border-white/15 px-3 py-1 text-xs text-white/70"
            >
              {cta}
            </span>
          ))}
        </div>
      </div>
      <p className="font-mono-label text-xs text-white/45">
        Recommended format ·{" "}
        <span className="text-[var(--cyan)]">{META_DRAFT.recommendedFormat}</span>
      </p>
      <DraftActions showSaveDraft={false} />
    </div>
  );
}

function GoogleTab() {
  const headlineLimit = 30;
  const descLimit = 90;

  return (
    <div className="space-y-4">
      <DraftMetaBadges />
      <p className="font-mono-label text-xs text-white/45">
        Display URL ·{" "}
        <span className="text-[var(--cyan)]">{GOOGLE_DRAFT.displayUrl}</span>
      </p>
      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
          Headlines ({headlineLimit} char max)
        </p>
        <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
          {GOOGLE_DRAFT.headlines.map((h, i) => {
            const len = h.length;
            const over = len > headlineLimit;
            return (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded bg-white/[0.03] px-2 py-1.5 text-sm"
              >
                <span className={over ? "text-[var(--red)]" : "text-white/75"}>{h}</span>
                <span
                  className={`shrink-0 font-mono-label text-[10px] ${over ? "text-[var(--red)]" : "text-white/35"}`}
                >
                  {len}/{headlineLimit}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Descriptions ({descLimit} char max)
        </p>
        <ul className="mt-2 space-y-2">
          {GOOGLE_DRAFT.descriptions.map((d, i) => {
            const len = d.length;
            const over = len > descLimit;
            return (
              <li
                key={i}
                className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-white/75"
              >
                <p className={over ? "text-[var(--red)]" : undefined}>{d}</p>
                <p
                  className={`mt-1 font-mono-label text-[10px] ${over ? "text-[var(--red)]" : "text-white/35"}`}
                >
                  {len}/{descLimit}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <DraftActions showSaveDraft={false} />
    </div>
  );
}

function AiPromptsTab() {
  return (
    <div className="space-y-4">
      <DraftMetaBadges />
      <CopyBlock
        label="Video prompt (Veo / Runway)"
        text={AI_PROMPTS_DRAFT.videoPrompt}
        accent="text-[var(--green)]"
      />
      <CopyBlock
        label="Image prompt (Midjourney / Flux)"
        text={AI_PROMPTS_DRAFT.imagePrompt}
        accent="text-[var(--cyan)]"
      />
      <CopyBlock
        label="Scene direction"
        text={AI_PROMPTS_DRAFT.sceneDirection}
        accent="text-[var(--purple)]"
      />
      <CopyBlock
        label="VO script"
        text={AI_PROMPTS_DRAFT.voScript}
        accent="text-[var(--yellow)]"
      />
      <DraftActions showSaveDraft={false} />
    </div>
  );
}

function SparkAdTab() {
  const fullBrief = [
    SPARK_AD_DRAFT.briefTitle,
    "",
    "KEY TALKING POINTS",
    ...SPARK_AD_DRAFT.talkingPoints.map((p) => `• ${p}`),
    "",
    "DO'S",
    ...SPARK_AD_DRAFT.dos.map((d) => `✓ ${d}`),
    "",
    "DON'TS",
    ...SPARK_AD_DRAFT.donts.map((d) => `✗ ${d}`),
    "",
    "HASHTAGS",
    SPARK_AD_DRAFT.hashtags.join(" "),
    "",
    "PRODUCT TALKING POINTS",
    ...SPARK_AD_DRAFT.productPoints.map((p) => `• ${p}`),
  ].join("\n");

  return (
    <div className="space-y-4">
      <DraftMetaBadges />
      <p className="font-heading text-sm font-semibold text-white">{SPARK_AD_DRAFT.briefTitle}</p>

      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
          Key talking points
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/75">
          {SPARK_AD_DRAFT.talkingPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
            Do&apos;s
          </p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {SPARK_AD_DRAFT.dos.map((d) => (
              <li key={d}>✓ {d}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--red)]">
            Don&apos;ts
          </p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {SPARK_AD_DRAFT.donts.map((d) => (
              <li key={d}>✗ {d}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Hashtag recommendations
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SPARK_AD_DRAFT.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] text-[var(--cyan)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--purple)]">
          Product talking points
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/75">
          {SPARK_AD_DRAFT.productPoints.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>

      <CopyButton text={fullBrief} label="Copy Full Brief" />
      <DraftActions showSaveDraft={false} />
    </div>
  );
}

function DraftActions({ showSaveDraft = true }: { showSaveDraft?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
      <button
        type="button"
        className="rounded-lg bg-[var(--green)] px-3 py-1.5 text-xs font-semibold text-[var(--bg)] hover:opacity-90"
      >
        Approve
      </button>
      <button
        type="button"
        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
      >
        Regenerate
      </button>
      <button
        type="button"
        className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
      >
        Edit
      </button>
      {showSaveDraft && (
        <button
          type="button"
          className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/5"
        >
          Save Draft
        </button>
      )}
    </div>
  );
}

function DraftCreativeSection() {
  const [tab, setTab] = useState<PlatformTab>("tiktok");

  const tabContent: Record<PlatformTab, ReactNode> = {
    tiktok: <TikTokTab />,
    meta: <MetaTab />,
    google: <GoogleTab />,
    ai_prompts: <AiPromptsTab />,
    spark_ad: <SparkAdTab />,
  };

  return (
    <Panel title="Draft Creative">
      <div className="mb-4 flex flex-wrap gap-1 border-b border-white/10 pb-3">
        {PLATFORM_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-md px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
              tab === t.id
                ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabContent[tab]}
    </Panel>
  );
}

function DraftHistorySection() {
  const [platformFilter, setPlatformFilter] = useState<HistoryPlatformFilter>("all");
  const [statusFilter, setStatusFilter] = useState<HistoryStatusFilter>("all");

  const platforms: HistoryPlatformFilter[] = [
    "all",
    "TikTok",
    "Meta",
    "Google",
    "AI Prompts",
    "Spark Ad",
  ];
  const statuses: HistoryStatusFilter[] = [
    "all",
    "pending",
    "approved",
    "rejected",
    "published",
  ];

  const filtered = useMemo(() => {
    return DRAFT_HISTORY.filter((row) => {
      if (platformFilter !== "all" && row.platform !== platformFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      return true;
    });
  }, [platformFilter, statusFilter]);

  return (
    <Panel
      title="Draft History"
      action={
        <span className="font-mono-label text-[10px] text-white/35">
          {filtered.length} of {DRAFT_HISTORY.length}
        </span>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap gap-1">
          {platforms.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlatformFilter(p)}
              className={`rounded-md px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
                platformFilter === p
                  ? "bg-[var(--cyan)]/20 text-[var(--cyan)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {p === "all" ? "All platforms" : p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide transition-colors ${
                statusFilter === s
                  ? "bg-[var(--purple)]/20 text-[var(--purple)]"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {s === "all" ? "All statuses" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 font-mono-label text-[10px] uppercase tracking-wide text-white/40">
              <th className="pb-2 pr-4 font-medium">Date</th>
              <th className="pb-2 pr-4 font-medium">Platform</th>
              <th className="pb-2 pr-4 font-medium">Bucket</th>
              <th className="pb-2 pr-4 font-medium">Signal</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-white/5 text-white/75">
                <td className="py-2.5 pr-4 font-mono-label text-xs text-white/50">{row.date}</td>
                <td className="py-2.5 pr-4">{row.platform}</td>
                <td className="py-2.5 pr-4">{row.bucket}</td>
                <td className="py-2.5 pr-4 text-white/55">{row.signalSource}</td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`rounded px-2 py-0.5 font-mono-label text-[10px] uppercase tracking-wide ${DRAFT_STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-2.5">
                  <button
                    type="button"
                    className="font-mono-label text-[10px] uppercase tracking-wide text-[var(--cyan)] hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function DetailSidebar() {
  const { runAgents, agentsRunning } = useApp();

  return (
    <aside className="flex flex-col gap-4 lg:gap-6">
      <Panel title="Generation Stats">
        <dl className="space-y-3">
          {[
            { label: "Drafts this month", value: GENERATION_STATS.draftsThisMonth },
            { label: "Approved", value: GENERATION_STATS.approved, accent: "text-[var(--green)]" },
            { label: "Pending", value: GENERATION_STATS.pending, accent: "text-[var(--yellow)]" },
            { label: "Rejected", value: GENERATION_STATS.rejected, accent: "text-[var(--red)]" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <dt className="text-sm text-white/55">{item.label}</dt>
              <dd className={`font-mono-label text-lg font-semibold ${item.accent ?? "text-white"}`}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="Bucket Health">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/55">Active buckets</dt>
            <dd className="font-mono-label font-semibold text-[var(--cyan)]">
              {BUCKET_HEALTH.activeBuckets}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Paused</dt>
            <dd className="font-mono-label font-semibold text-white/45">
              {BUCKET_HEALTH.paused}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Last run</dt>
            <dd className="font-mono-label text-xs text-white/60">{BUCKET_HEALTH.lastRun}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/55">Next scheduled</dt>
            <dd className="font-mono-label text-xs text-white/60">
              {BUCKET_HEALTH.nextScheduled}
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel title="Quick Actions">
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={runAgents}
            disabled={agentsRunning}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--green)] px-4 py-2.5 text-xs font-semibold text-[var(--bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {agentsRunning ? "Running agents…" : "Run agents now"}
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70 transition-colors hover:bg-white/5"
          >
            View all approved
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-white/15 px-4 py-2 text-xs text-white/70 transition-colors hover:bg-white/5"
          >
            Export approved drafts
          </button>
        </div>
      </Panel>
    </aside>
  );
}

function DetailView() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
      <div className="space-y-4 lg:col-span-2 lg:space-y-6">
        <ContentAnglesSection />
        <ContentBucketsSection />
        <DraftCreativeSection />
        <DraftHistorySection />
      </div>
      <DetailSidebar />
    </div>
  );
}

export function ContentStudio({ variant }: ContentStudioProps) {
  return variant === "summary" ? <SummaryView /> : <DetailView />;
}
