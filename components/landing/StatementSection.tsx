import { LitWords } from "./LitWords";

// The page's one scroll moment: the promise of the show, lit word by word as
// it passes through the screen. Thai has no spaces, so words come from the
// ICU word segmenter. Words in EMPHASIS light up in navy.
const TEXT =
  "ตีตี้กับปั๊บเพิ่งเรียนแพทย์ปีหนึ่ง เลยถามทุกอย่างที่คุณก็สงสัย แล้วให้อาจารย์แพทย์ตัวจริงเป็นคนตอบ";
const EMPHASIS = ["ทุกอย่าง", "อาจารย์แพทย์ตัวจริง"];

function segment(text: string) {
  const segmenter = new Intl.Segmenter("th", { granularity: "word" });
  const words = [...segmenter.segment(text)].map((s) => s.segment);
  // Mark the words that fall inside an emphasised phrase.
  let pos = 0;
  return words.map((w) => {
    const start = pos;
    pos += w.length;
    const em = EMPHASIS.some((phrase) => {
      const at = text.indexOf(phrase);
      return at !== -1 && start >= at && start < at + phrase.length;
    });
    return { t: w, em };
  });
}

export function StatementSection() {
  return (
    <section className="statement section" aria-label="Rounds คืออะไร">
      <div className="wrap">
        <span className="eyebrow" style={{ marginBottom: "var(--space-8)", display: "inline-flex" }}>
          <span className="eyebrow-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          Why Rounds
        </span>
        <LitWords words={segment(TEXT)} />
        <p className="statement-en muted" lang="en">
          First-years ask what you&apos;d ask. Specialists answer.
        </p>
      </div>
    </section>
  );
}
