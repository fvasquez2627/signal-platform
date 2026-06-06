"use client";

import { AI_PROMPTS_DRAFT } from "@/components/content/mock-data";
import {
  CopyBlock,
  CopyButton,
  DraftActions,
  SignalBadges,
} from "@/components/content/content-studio-shared";

export function AiPromptsDraftTab() {
  const sceneAll = [
    `Talent: ${AI_PROMPTS_DRAFT.sceneDirection.talent}`,
    `Setting: ${AI_PROMPTS_DRAFT.sceneDirection.setting}`,
    `Mood: ${AI_PROMPTS_DRAFT.sceneDirection.mood}`,
    `Avoid: ${AI_PROMPTS_DRAFT.sceneDirection.avoid}`,
  ].join("\n");

  return (
    <div className="space-y-5">
      <SignalBadges
        signalSource={AI_PROMPTS_DRAFT.signalSource}
        bucket={AI_PROMPTS_DRAFT.bucket}
      />

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--cyan)]">
          Video Generation · {AI_PROMPTS_DRAFT.video.label}
        </p>
        <CopyBlock
          label="Scene Prompt"
          text={AI_PROMPTS_DRAFT.video.scenePrompt}
          accent="text-[var(--green)]"
          multiline
        />
        <div className="grid gap-2 sm:grid-cols-2">
          {Object.entries(AI_PROMPTS_DRAFT.video.specs).map(([key, value]) => (
            <p key={key} className="rounded-lg bg-white/[0.03] px-3 py-2 text-sm text-white/70">
              <span className="font-mono-label text-[10px] uppercase text-white/40">
                {key}
              </span>
              <br />
              {value}
            </p>
          ))}
        </div>
        <CopyBlock
          label="Negative Prompts"
          text={AI_PROMPTS_DRAFT.video.negativePrompts}
          accent="text-[var(--red)]"
        />
      </section>

      <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <p className="font-mono-label text-[10px] uppercase tracking-widest text-[var(--purple)]">
          Image Generation · {AI_PROMPTS_DRAFT.image.label}
        </p>
        <CopyBlock
          label="Product Shot Prompt"
          text={AI_PROMPTS_DRAFT.image.productShot}
          accent="text-[var(--green)]"
          multiline
        />
        <CopyBlock
          label="Lifestyle Prompt"
          text={AI_PROMPTS_DRAFT.image.lifestyle}
          accent="text-[var(--cyan)]"
          multiline
        />
        <CopyBlock
          label="Hook Frame Prompt"
          text={AI_PROMPTS_DRAFT.image.hookFrame}
          accent="text-[var(--yellow)]"
          multiline
        />
      </section>

      <section className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-white/40">
            Scene Direction
          </p>
          <CopyButton text={sceneAll} label="Copy All" />
        </div>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-mono-label text-[10px] uppercase text-[var(--green)]">Talent</dt>
            <dd className="mt-1 text-white/75">{AI_PROMPTS_DRAFT.sceneDirection.talent}</dd>
          </div>
          <div>
            <dt className="font-mono-label text-[10px] uppercase text-[var(--cyan)]">Setting</dt>
            <dd className="mt-1 text-white/75">{AI_PROMPTS_DRAFT.sceneDirection.setting}</dd>
          </div>
          <div>
            <dt className="font-mono-label text-[10px] uppercase text-[var(--purple)]">Mood</dt>
            <dd className="mt-1 text-white/75">{AI_PROMPTS_DRAFT.sceneDirection.mood}</dd>
          </div>
          <div>
            <dt className="font-mono-label text-[10px] uppercase text-[var(--red)]">Avoid</dt>
            <dd className="mt-1 text-white/75">{AI_PROMPTS_DRAFT.sceneDirection.avoid}</dd>
          </div>
        </dl>
      </section>

      <CopyBlock
        label="VO Script"
        text={AI_PROMPTS_DRAFT.voScript}
        accent="text-[var(--yellow)]"
        multiline
      />

      <DraftActions />
    </div>
  );
}
