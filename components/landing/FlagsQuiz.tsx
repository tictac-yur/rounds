"use client";

import { useState } from "react";
import type { HomeContent } from "@/convex/contentTypes";
import { ArrowIcon, FlagIcon } from "./Icons";

type Verdict = "red" | "green";
type Myth = HomeContent["myths"][number];

const VERDICTS: Record<Verdict, { label: string; meaning: string }> = {
  red: { label: "Red flag", meaning: "อย่าเชื่อ" },
  green: { label: "Green flag", meaning: "เรื่องจริง" },
};

// One belief at a time: guess, the card lights up in the doctor's verdict,
// then the answer, who gave it, and where to hear the rest.
function FlagCard({
  myth,
  n,
  total,
  guess,
  onGuess,
  onNext,
}: {
  myth: Myth;
  n: number;
  total: number;
  guess: Verdict | undefined;
  onGuess: (v: Verdict) => void;
  onNext: (() => void) | null;
}) {
  const right = guess === myth.verdict;
  const learnMore = myth.episodeUrl ?? (myth.answeredByPath ? `/doctors/${myth.answeredByPath}` : null);
  return (
    <article className="flag-card" data-verdict={guess ? myth.verdict : undefined} aria-labelledby={`flag-${myth.key}`}>
      <div className="flag-card-top">
        <span className="small">
          ความเชื่อที่ {n} / {total}
        </span>
        {guess && <span className="flag-mark">{right ? "ทายถูก ✓" : "ไม่ใช่นะ ✕"}</span>}
      </div>

      <p className="flag-claim" id={`flag-${myth.key}`}>
        “{myth.claim}”
      </p>

      {guess ? (
        <div className="flag-answer" role="status">
          <p className="flag-verdict">
            <FlagIcon solid size={28} />
            <span lang="en">{VERDICTS[myth.verdict].label}</span>
            <span className="flag-verdict-th">{VERDICTS[myth.verdict].meaning}</span>
          </p>
          <p className="body-lg">{myth.answer}</p>
          <div className="flag-foot">
            {myth.answeredBy &&
              (myth.answeredByPath ? (
                <a href={`/doctors/${myth.answeredByPath}`} className="text-link">
                  ตอบโดย {myth.answeredBy}
                </a>
              ) : (
                <span className="small">ตอบโดย {myth.answeredBy}</span>
              ))}
            <span className="flag-actions">
              {learnMore && (
                <a
                  href={learnMore}
                  className="btn btn-light btn-sm"
                  {...(myth.episodeUrl ? { target: "_blank", rel: "noopener" } : {})}
                >
                  Learn more
                  <span className="btn-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              )}
              {onNext && (
                <button type="button" className="btn btn-outline btn-sm" onClick={onNext}>
                  ข้อต่อไป
                </button>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="flag-choices" role="group" aria-label="Red flag หรือ Green flag">
          {(["red", "green"] as const).map((v) => (
            <button key={v} type="button" className="flag-choice" data-verdict={v} onClick={() => onGuess(v)}>
              <FlagIcon solid={v === "red"} size={22} />
              <span lang="en">{VERDICTS[v].label}</span>
              <small>{VERDICTS[v].meaning}</small>
            </button>
          ))}
        </div>
      )}
    </article>
  );
}

export function FlagsQuiz({ myths }: { myths: Myth[] }) {
  const [guesses, setGuesses] = useState<Record<string, Verdict>>({});
  const [index, setIndex] = useState(0);
  const myth = myths[Math.min(index, myths.length - 1)];
  const answered = myths.filter((m) => guesses[m.key]);
  const correct = answered.filter((m) => guesses[m.key] === m.verdict).length;
  const done = answered.length === myths.length;
  const next = myths.findIndex((m, i) => i > index && !guesses[m.key]);

  return (
    <section id="flags" className="navy" aria-labelledby="flags-title">
      <div className="wrap section flags-layout">
        <div className="flags-intro">
          <h2 className="h2" lang="en" id="flags-title">
            Red flag or Green flag?
          </h2>
          <p className="h2-th muted">ความเชื่อเรื่องสุขภาพที่ได้ยินกันบ่อย ลองทายก่อน แล้วดูว่าคุณหมอตอบว่าอะไร</p>

          <ol className="flag-pips" aria-label="ความเชื่อทั้งหมด">
            {myths.map((m, i) => (
              <li key={m.key}>
                <button
                  type="button"
                  aria-label={`ความเชื่อที่ ${i + 1}${guesses[m.key] ? ` · ${VERDICTS[m.verdict].label}` : ""}`}
                  aria-current={i === index ? "step" : undefined}
                  data-verdict={guesses[m.key] ? m.verdict : undefined}
                  onClick={() => setIndex(i)}
                />
              </li>
            ))}
          </ol>

          <p className="flags-score" aria-live="polite">
            {done ? (
              <>
                ทายถูก <b>{correct}</b> จาก {myths.length}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setGuesses({});
                    setIndex(0);
                  }}
                >
                  เล่นใหม่
                </button>
              </>
            ) : (
              <span className="muted">
                ทายแล้ว {answered.length} จาก {myths.length} ข้อ
              </span>
            )}
          </p>
        </div>

        <FlagCard
          key={myth.key}
          myth={myth}
          n={index + 1}
          total={myths.length}
          guess={guesses[myth.key]}
          onGuess={(v) => setGuesses((g) => ({ ...g, [myth.key]: v }))}
          onNext={next === -1 ? null : () => setIndex(next)}
        />
      </div>
    </section>
  );
}
