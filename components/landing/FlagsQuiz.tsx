"use client";

import { useState } from "react";
import type { HomeContent } from "@/convex/contentTypes";
import { ArrowIcon, FlagIcon } from "./Icons";

type Verdict = "red" | "green";
type Myth = HomeContent["myths"][number];

// The palette has no red or green, so the two verdicts differ by fill
// (solid vs outline), by their flag icon and by their words.
const VERDICTS: Record<Verdict, { label: string; meaning: string }> = {
  red: { label: "Red flag", meaning: "อย่าเชื่อ" },
  green: { label: "Green flag", meaning: "เรื่องจริง" },
};

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const v = VERDICTS[verdict];
  return (
    <span className="verdict-badge" data-verdict={verdict}>
      <FlagIcon solid={verdict === "red"} />
      {v.label}
      <span>{v.meaning}</span>
    </span>
  );
}

function QuizCard({ myth, n, guess, onGuess }: { myth: Myth; n: number; guess: Verdict | undefined; onGuess: (v: Verdict) => void }) {
  const right = guess === myth.verdict;
  return (
    <article className="quiz-card" data-answered={!!guess}>
      <span className="eyebrow eyebrow-th">ความเชื่อที่ {n}</span>
      <p className="quiz-claim">“{myth.claim}”</p>
      {guess ? (
        <div className="quiz-result" role="status">
          <div className="quiz-verdict">
            <VerdictBadge verdict={myth.verdict} />
            <span className="quiz-mark">{right ? "✓ ทายถูก" : "✕ ไม่ใช่นะ"}</span>
          </div>
          <p className="body" style={{ color: "#d6dee7", fontFamily: "var(--font-thai)" }}>
            {myth.answer}
          </p>
          {myth.answeredBy && <span className="small muted">ตอบโดย {myth.answeredBy}</span>}
        </div>
      ) : (
        <div className="quiz-choices" role="group" aria-label={`ความเชื่อที่ ${n}: Red flag หรือ Green flag`}>
          {(["red", "green"] as const).map((v) => (
            <button key={v} type="button" className="quiz-choice" data-verdict={v} onClick={() => onGuess(v)}>
              <span>
                <FlagIcon solid={v === "red"} />
                {VERDICTS[v].label}
              </span>
              <span>{VERDICTS[v].meaning}</span>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

// Red flag / Green flag: guess first, then read the guest doctor's verdict.
export function FlagsQuiz({ myths }: { myths: Myth[] }) {
  const [guesses, setGuesses] = useState<Record<string, Verdict>>({});
  const answered = myths.filter((m) => guesses[m.key]);
  const correct = answered.filter((m) => guesses[m.key] === m.verdict).length;
  const done = answered.length === myths.length;
  const sourceSpecialty = myths.find((m) => m.episodeSpecialty)?.episodeSpecialty;

  return (
    <section id="flags" className="navy" aria-labelledby="flags-title">
      <div className="wrap section">
        <div className="quiz-head">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              03 · Quiz
            </span>
            <h2 className="h2" lang="en" id="flags-title">
              Red flag or Green flag?
            </h2>
            <p className="h2-th muted">เชื่อแบบนี้ได้ไหม ลองทายก่อน แล้วดูว่าคุณหมอตอบว่าอะไร</p>
          </div>
          <div className="score" aria-live="polite">
            <span>
              ทายถูก <b>{correct}</b>
              <span className="muted"> / {myths.length}</span>
            </span>
            {answered.length > 0 ? (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setGuesses({})}>
                เล่นใหม่
              </button>
            ) : (
              <span className="small muted" style={{ paddingRight: "var(--space-4)" }}>
                แตะเพื่อทาย
              </span>
            )}
          </div>
        </div>

        <div className="quiz-grid">
          {myths.map((myth, i) => (
            <QuizCard
              key={myth.key}
              myth={myth}
              n={i + 1}
              guess={guesses[myth.key]}
              onGuess={(v) => setGuesses((g) => ({ ...g, [myth.key]: v }))}
            />
          ))}
        </div>

        {(done || sourceSpecialty) && (
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-4)", marginTop: "var(--space-8)" }}>
            {done && (
              <p className="title" style={{ fontFamily: "var(--font-thai)" }}>
                {correct === myths.length ? "ทายถูกหมดเลย เก่งมาก" : `ทายถูก ${correct} จาก ${myths.length} ข้อ`}
              </p>
            )}
            {sourceSpecialty && (
              <a href="#episodes" className="text-link">
                ฟังคำอธิบายเต็มๆ ในตอน{sourceSpecialty} <ArrowIcon />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
