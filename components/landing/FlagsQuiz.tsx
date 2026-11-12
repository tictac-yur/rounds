"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { HomeContent } from "@/convex/contentTypes";
import { ArrowIcon, FlagIcon } from "./Icons";

type Verdict = "red" | "green";
type Myth = HomeContent["myths"][number];
type Phase = "intro" | "playing" | "done";
// guess is null when the time ran out.
type Result = { guess: Verdict | null; right: boolean; points: number };

// Seconds per belief in the timed game. Answering faster earns up to double.
const LIMIT = 15;
const BASE_POINTS = 100;

const VERDICTS: Record<Verdict, { label: string; meaning: string }> = {
  red: { label: "Red flag", meaning: "อย่าเชื่อ" },
  green: { label: "Green flag", meaning: "เรื่องจริง" },
};

// The reward: a rank on the way from med student to attending.
const RANKS = [
  { min: 1, en: "Attending", th: "อาจารย์แพทย์", note: "ตอบถูกทุกข้อ คุณหมอยังต้องยอม" },
  { min: 0.75, en: "Resident", th: "แพทย์ประจำบ้าน", note: "เก่งมาก อีกนิดเดียวก็เป็นอาจารย์แล้ว" },
  { min: 0.5, en: "Intern", th: "แพทย์ฝึกหัด", note: "มาถูกทางแล้ว ดูตอนเต็มแล้วลองใหม่" },
  { min: 0, en: "Med student", th: "นักศึกษาแพทย์", note: "ทุกคนเริ่มจากตรงนี้ เหมือนเรา ลองฟังคุณหมอในตอนเต็มแล้วกลับมาใหม่" },
];
function rankFor(correct: number, total: number) {
  const ratio = total === 0 ? 0 : correct / total;
  return RANKS.find((r) => ratio >= r.min) ?? RANKS[RANKS.length - 1];
}

function StartCard({ total, onStart }: { total: number; onStart: (timed: boolean) => void }) {
  return (
    <article className="flag-card flag-start" aria-labelledby="flag-start-title">
      <span className="small flag-eyebrow">เกม Red / Green flag</span>
      <p className="flag-claim" id="flag-start-title">
        ทายให้ถูก ทายให้ไว
      </p>
      <ul className="flag-rules">
        <li>{total} ความเชื่อเรื่องสุขภาพ ตอบโดยอาจารย์แพทย์ตัวจริง</li>
        <li>ข้อละ {LIMIT} วินาที ยิ่งตอบเร็ว ยิ่งได้คะแนนมาก</li>
        <li>จบเกมรับระดับของคุณ ตั้งแต่ นักศึกษาแพทย์ ถึง อาจารย์แพทย์</li>
      </ul>
      <div className="flag-actions">
        <button type="button" className="btn btn-light" onClick={() => onStart(true)}>
          เริ่มเลย
          <span className="btn-arrow">
            <ArrowIcon />
          </span>
        </button>
        <button type="button" className="btn btn-outline" onClick={() => onStart(false)}>
          เล่นแบบไม่จับเวลา
        </button>
      </div>
    </article>
  );
}

// One belief: guess before the time runs out, then the doctor's answer.
function FlagCard({
  myth,
  n,
  total,
  result,
  secondsLeft,
  onGuess,
  onNext,
}: {
  myth: Myth;
  n: number;
  total: number;
  result: Result | undefined;
  secondsLeft: number | null;
  onGuess: (v: Verdict) => void;
  onNext: () => void;
}) {
  const learnMore = myth.episodeUrl ?? (myth.answeredByPath ? `/doctors/${myth.answeredByPath}` : null);
  return (
    <article className="flag-card" data-result={result ? (result.right ? "right" : "wrong") : undefined} aria-labelledby={`flag-${myth.key}`}>
      <div className="flag-card-top">
        <span className="small">
          ความเชื่อที่ {n} / {total}
        </span>
        {secondsLeft !== null && (
          <span className="small flag-seconds" role="timer" aria-live="off">
            {Math.ceil(secondsLeft)} วิ
          </span>
        )}
      </div>
      {secondsLeft !== null && (
        <div className="flag-timer" aria-hidden="true" style={{ "--left": secondsLeft / LIMIT } as CSSProperties}>
          <span />
        </div>
      )}

      <p className="flag-claim" id={`flag-${myth.key}`}>
        “{myth.claim}”
      </p>

      {result ? (
        <div className="flag-answer" role="status">
          <div className="flag-result-row">
            <span className="flag-result" data-right={result.right}>
              {result.right ? "✓ ถูกต้อง" : result.guess === null ? "หมดเวลา" : "✕ ยังไม่ใช่"}
              {result.points > 0 && <b>+{result.points}</b>}
            </span>
            <span className="flag-verdict" data-verdict={myth.verdict}>
              <FlagIcon solid size={18} />
              <span lang="en">{VERDICTS[myth.verdict].label}</span>
              <span className="flag-verdict-th">{VERDICTS[myth.verdict].meaning}</span>
            </span>
          </div>
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
                  className="btn btn-outline btn-sm"
                  {...(myth.episodeUrl ? { target: "_blank", rel: "noopener" } : {})}
                >
                  Learn more
                </a>
              )}
              <button type="button" className="btn btn-light btn-sm" onClick={onNext} autoFocus>
                {n < total ? "ข้อต่อไป" : "ดูผลของคุณ"}
                <span className="btn-arrow">
                  <ArrowIcon />
                </span>
              </button>
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

function DoneCard({
  correct,
  total,
  score,
  timed,
  onRestart,
}: {
  correct: number;
  total: number;
  score: number;
  timed: boolean;
  onRestart: () => void;
}) {
  const rank = rankFor(correct, total);
  const [shared, setShared] = useState<string | null>(null);

  async function share() {
    const url = `${window.location.origin}/#flags`;
    const text = `ได้ระดับ ${rank.en} (${rank.th}) ทายถูก ${correct}/${total} ใน Red flag or Green flag? ของ Rounds ลองดูว่าคุณได้เท่าไร`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Rounds · Red flag or Green flag?", text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShared("คัดลอกแล้ว ส่งให้เพื่อนได้เลย");
    } catch {
      // Closing the share sheet isn't an error worth showing.
    }
  }

  return (
    <article className="flag-card flag-done" aria-labelledby="flag-rank">
      <span className="small flag-eyebrow">ผลของคุณ</span>
      <div>
        <p className="flag-rank" id="flag-rank" lang="en">
          {rank.en}
        </p>
        <p className="flag-rank-th">{rank.th}</p>
      </div>
      <p className="flag-tally">
        ทายถูก <b>{correct}</b> จาก {total}
        {timed && (
          <>
            {" "}
            · <b>{score}</b> คะแนน
          </>
        )}
      </p>
      <p className="body-lg">{rank.note}</p>
      <div className="flag-actions">
        <button type="button" className="btn btn-light" onClick={share}>
          แชร์ผล
          <span className="btn-arrow">
            <ArrowIcon />
          </span>
        </button>
        <button type="button" className="btn btn-outline" onClick={onRestart}>
          เล่นอีกครั้ง
        </button>
      </div>
      {shared && (
        <p className="small" role="status">
          {shared}
        </p>
      )}
    </article>
  );
}

export function FlagsQuiz({ myths }: { myths: Myth[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [timed, setTimed] = useState(true);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);

  const myth = myths[Math.min(index, myths.length - 1)];
  const result = results[myth.key];
  const ticking = phase === "playing" && timed && !result;
  const secondsLeft = ticking ? Math.max(0, LIMIT - (now - startedAt) / 1000) : null;
  const answered = myths.filter((m) => results[m.key]);
  const correct = answered.filter((m) => results[m.key].right).length;
  const score = answered.reduce((sum, m) => sum + results[m.key].points, 0);

  // The clock for the current belief; running out counts as a miss.
  useEffect(() => {
    if (!ticking) return;
    const key = myth.key;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t - startedAt >= LIMIT * 1000) {
        clearInterval(id);
        setResults((r) => (r[key] ? r : { ...r, [key]: { guess: null, right: false, points: 0 } }));
      }
    }, 100);
    return () => clearInterval(id);
  }, [ticking, startedAt, myth.key]);

  function startClock() {
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
  }

  function start(withTimer: boolean) {
    setTimed(withTimer);
    setResults({});
    setIndex(0);
    setPhase("playing");
    startClock();
  }

  function guess(v: Verdict) {
    if (results[myth.key]) return;
    const left = timed ? Math.max(0, LIMIT - (Date.now() - startedAt) / 1000) : 0;
    const right = v === myth.verdict;
    // Untimed games score correct answers only.
    const points = right ? (timed ? BASE_POINTS + Math.round((left / LIMIT) * BASE_POINTS) : 0) : 0;
    setResults((r) => ({ ...r, [myth.key]: { guess: v, right, points } }));
  }

  function next() {
    if (index + 1 < myths.length) {
      setIndex(index + 1);
      startClock();
    } else {
      setPhase("done");
    }
  }

  return (
    <section id="flags" className="navy" aria-labelledby="flags-title">
      <div className="wrap section flags-layout">
        <div className="flags-intro">
          <h2 className="h2" lang="en" id="flags-title">
            Red flag or Green flag?
          </h2>
          <p className="h2-th muted">ความเชื่อเรื่องสุขภาพที่ได้ยินกันบ่อย ลองทายก่อน แล้วดูว่าคุณหมอตอบว่าอะไร</p>

          {phase !== "intro" && (
            <>
              <ol className="flag-pips" aria-label="ความคืบหน้า">
                {myths.map((m, i) => {
                  const r = results[m.key];
                  return (
                    <li
                      key={m.key}
                      data-result={r ? (r.right ? "right" : "wrong") : undefined}
                      aria-current={phase === "playing" && i === index ? "step" : undefined}
                    >
                      <span className="sr-only">
                        ข้อ {i + 1}: {r ? (r.right ? "ถูก" : "ผิด") : "ยังไม่ตอบ"}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="flags-score" aria-live="polite">
                {timed ? (
                  <>
                    คะแนน <b>{score}</b>
                  </>
                ) : (
                  <span className="muted">
                    ทายถูก {correct} จาก {answered.length} ข้อ
                  </span>
                )}
              </p>
            </>
          )}
        </div>

        {phase === "intro" && <StartCard total={myths.length} onStart={start} />}
        {phase === "playing" && (
          <FlagCard
            key={myth.key}
            myth={myth}
            n={index + 1}
            total={myths.length}
            result={result}
            secondsLeft={secondsLeft}
            onGuess={guess}
            onNext={next}
          />
        )}
        {phase === "done" && (
          <DoneCard correct={correct} total={myths.length} score={score} timed={timed} onRestart={() => setPhase("intro")} />
        )}
      </div>
    </section>
  );
}
