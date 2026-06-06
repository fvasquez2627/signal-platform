"use client";

import { useState } from "react";
import { SPARK_AD_DRAFT } from "@/components/content/mock-data";
import {
  CopyBlock,
  CopyButton,
  DraftActions,
  SignalBadges,
} from "@/components/content/content-studio-shared";

export function SparkAdDraftTab() {
  const [approved, setApproved] = useState(false);

  const fullBrief = [
    `Brand: ${SPARK_AD_DRAFT.brand}`,
    `Product: ${SPARK_AD_DRAFT.product}`,
    `Campaign: ${SPARK_AD_DRAFT.campaign}`,
    `Budget guidance: ${SPARK_AD_DRAFT.budgetGuidance}`,
    "",
    "CONTENT DIRECTION",
    SPARK_AD_DRAFT.contentDirection,
    "",
    "KEY TALKING POINTS (must include 2+)",
    ...SPARK_AD_DRAFT.talkingPoints.map((p) => `✓ ${p}`),
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
    "DELIVERABLES",
    ...SPARK_AD_DRAFT.deliverables.map((d) => `• ${d}`),
    "",
    "FTC DISCLOSURE",
    SPARK_AD_DRAFT.ftcDisclosure,
  ].join("\n");

  return (
    <div className="space-y-5">
      <SignalBadges signalSource={SPARK_AD_DRAFT.signalSource} bucket={SPARK_AD_DRAFT.bucket} />

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Brief Header
        </p>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-white/40">Brand</dt>
            <dd className="text-white/80">{SPARK_AD_DRAFT.brand}</dd>
          </div>
          <div>
            <dt className="text-white/40">Product</dt>
            <dd className="text-white/80">{SPARK_AD_DRAFT.product}</dd>
          </div>
          <div>
            <dt className="text-white/40">Campaign</dt>
            <dd className="text-white/80">{SPARK_AD_DRAFT.campaign}</dd>
          </div>
          <div>
            <dt className="text-white/40">Budget guidance</dt>
            <dd className="text-white/80">{SPARK_AD_DRAFT.budgetGuidance}</dd>
          </div>
        </dl>
      </div>

      <CopyBlock
        label="Content Direction"
        text={SPARK_AD_DRAFT.contentDirection}
        accent="text-[var(--cyan)]"
        multiline
      />

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--green)]">
            Key Talking Points
          </p>
          <CopyButton
            text={SPARK_AD_DRAFT.talkingPoints.join("\n")}
            label="Copy All"
          />
        </div>
        <p className="mb-2 text-xs text-white/45">Must include 2+</p>
        <ul className="space-y-2">
          {SPARK_AD_DRAFT.talkingPoints.map((p) => (
            <li
              key={p}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-white/75"
            >
              <span>✓ {p}</span>
              <CopyButton text={p} />
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-[var(--green)]/20 bg-[var(--green)]/5 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-mono-label text-[10px] uppercase text-[var(--green)]">Do&apos;s</p>
            <CopyButton text={SPARK_AD_DRAFT.dos.map((d) => `✓ ${d}`).join("\n")} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPARK_AD_DRAFT.dos.map((d) => (
              <span
                key={d}
                className="rounded-full border border-[var(--green)]/30 bg-[var(--green)]/10 px-2.5 py-1 text-xs text-[var(--green)]"
              >
                ✓ {d}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[var(--red)]/20 bg-[var(--red)]/5 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-mono-label text-[10px] uppercase text-[var(--red)]">Don&apos;ts</p>
            <CopyButton text={SPARK_AD_DRAFT.donts.map((d) => `✗ ${d}`).join("\n")} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SPARK_AD_DRAFT.donts.map((d) => (
              <span
                key={d}
                className="rounded-full border border-[var(--red)]/30 bg-[var(--red)]/10 px-2.5 py-1 text-xs text-[var(--red)]"
              >
                ✗ {d}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
            Hashtags
          </p>
          <CopyButton text={SPARK_AD_DRAFT.hashtags.join(" ")} label="Copy All" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SPARK_AD_DRAFT.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-white/5 px-2 py-0.5 font-mono-label text-[10px] text-[var(--cyan)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
          Deliverables
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-white/75">
          {SPARK_AD_DRAFT.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <div className="rounded-xl border border-[var(--yellow)]/30 bg-[var(--yellow)]/10 p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--yellow)]">
          FTC Disclosure
        </p>
        <p className="mt-2 text-sm text-white/75">{SPARK_AD_DRAFT.ftcDisclosure}</p>
      </div>

      <CopyButton text={fullBrief} label="Copy Full Brief" />

      <DraftActions
        approveLabel="Approve"
        onApprove={() => setApproved(true)}
        approved={approved}
      />
    </div>
  );
}
