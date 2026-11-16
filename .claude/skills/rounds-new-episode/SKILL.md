---
name: rounds-new-episode
description: "Turn a new Rounds episode's transcript into an episode kit: the guest doctor (names checked), a short bio, the episode's specialty and its Red / Green flags, as JSON the hosts paste into Admin → Episode kit. TRIGGER when the user sends an episode transcript (.srt or text), says there's a new episode (EP.3, EP.4, …), or asks for a guest bio or flags for an episode."
---

# New episode → episode kit

The site does most of a new episode by itself: the hourly YouTube sync imports the
title, thumbnail, summary and chapters (from timestamps in the description), and makes
it the latest episode. What it can't know is in the conversation, so that's your part:
read the transcript and produce one **episode kit**. The hosts paste it into
**Admin → Episode kit**, check the preview and press **Add to episode**. No code change
and no deploy: don't edit `convex/seedData.ts` for a new episode.

The full human workflow is in `docs/NEW_EPISODE.md`. Point the user there if they ask
what to do next.

## Steps

1. **Read the whole transcript.** For an .srt, keep only the spoken lines, with the
   timestamp of each, and read every page: the bio facts are near the start and middle,
   and the myth-or-fact round is usually at the very end. It's Thai, auto-captioned:
   names and medical terms may be misspelled.
2. **The guest's name.** Take the title and name from their self-introduction, then
   **check the spelling** (Thai and English) against a public source: their hospital
   or faculty profile. Search the web for it. Use the title as the profile has it
   (ศ.นพ., รศ.พญ., ผศ.นพ., …). If you can't confirm it, say so and mark it as needing
   the user's check. Don't put a hospital link in the kit; the hosts add one in the admin
   if they want it.
3. **The bio.** One or two sentences in Thai, in the style of the existing ones:
   what they are, then their training, then why they chose the field. **Only facts the
   doctor says in the episode** (or that the profile confirms); never invent awards,
   positions or years. Leave out where they work now unless they say it or the user
   tells you. Example (EP.2):
   > อายุรแพทย์ระบบประสาทและสมอง ผู้เชี่ยวชาญโรคหลอดเลือดสมอง (stroke) จบ fellowship ด้าน cerebrovascular and critical care neurology จาก Saint Louis University สหรัฐอเมริกา อาจารย์เลือกสายนิวโรเพราะชอบแก้ปัญหาด้วย critical thinking มากกว่าการท่องจำ …
4. **`field`** is the guest's field for their card, e.g. `ประสาทวิทยา · โรคหลอดเลือดสมอง`.
   **`specialty`** is the episode's short filter label, matching the existing ones:
   `โรคหัวใจ`, `สมองและระบบประสาท`.
5. **The flags, 3–6 of them.** Prefer the episode's own myth-or-fact round. Otherwise
   use beliefs the doctor clearly rules on.
   - `claim`: the belief as people say it, in Thai, no quotation marks.
   - `verdict`: `"red"` for อย่าเชื่อ (false or harmful), `"green"` for เรื่องจริง.
   - `answer`: one or two sentences giving the doctor's reasoning in plain Thai. It's a
     paraphrase, not a quote, and adds nothing the doctor didn't say. Where it's an
     emergency, end with what to do (e.g. โทร 1669).
   - Skip anything the doctor answers with "it depends". The verdict must be clear.
   - Don't repeat a claim already on the site (`seedMyths`, `ep1TranscriptFlags` and the
     kits in `convex/seedData.ts` show what's there); the admin skips exact duplicates anyway.
6. **Send the kit** as one ```json block, then a short list of anything the user should
   check (an unconfirmed spelling, a flag you weren't sure about). End with the next
   steps: Admin → Episode kit → choose the episode → paste → check → Add to episode.
   Then the photo with the doctor, and the doctor's OK to publish.

## Kit format

The admin reads exactly this shape (validator: `convex/lib/episodeKit.ts`):

```json
{
  "guest": {
    "name": "ศ.นพ.สมบัติ มุ่งทวีพงษา",
    "nameAlt": "Prof. Dr. Sombat Muengtaweepongsa",
    "nameLang": "th",
    "slug": "sombat-muengtaweepongsa",
    "field": "ประสาทวิทยา · โรคหลอดเลือดสมอง",
    "bio": "…"
  },
  "specialty": "สมองและระบบประสาท",
  "flags": [
    { "claim": "สโตรกเป็นโรคของคนแก่เท่านั้น คนหนุ่มสาวเป็นไม่ได้", "verdict": "red", "answer": "…" },
    { "claim": "คุณภาพการนอนสำคัญกว่าจำนวนชั่วโมง", "verdict": "green", "answer": "…" }
  ]
}
```

- `name`, `nameLang` (`"th"` or `"en"`, the language of `name`) and `field` are
  required. `nameAlt`, `slug`, `affiliation` and `bio` are optional.
- `slug` is the profile address `/doctors/<slug>`: the English name, lowercase, with
  dashes.
- Applying a kit only fills what's empty. An existing guest (matched by `name`) keeps
  their edited details, and flags with the same claim aren't added twice. A corrected
  kit can be pasted again safely.
