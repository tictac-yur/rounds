# Putting a new episode on the site

About 10 minutes per episode. The site does most of it; you do three things.

## 1. Before you publish on YouTube

- **Title:** end it with `| The Consult EP.3` (the series name matters: the site files the
  episode under that series).
- **Description:** the first lines become the summary on the site. Add **chapters** as
  timestamps, one per line, starting at `00:00`, at least two:
  ```
  00:00 แนะนำตัว
  03:41 FAST: อาการสโตรก
  ```
  They show as clickable chapters on the doctor's page. If you fix them later in YouTube
  Studio, the site picks the change up by itself.

## 2. Publish, then wait (or press a button)

Within the hour the YouTube sync adds the episode with its title, thumbnail, summary and
chapters, and makes it the latest episode. To do it now: **Admin → Dashboard → Check
YouTube now**.

## 3. Get the episode kit from Claude

1. Get the transcript: **YouTube Studio → Subtitles → the episode → ⋮ → Download → .srt**
   (or export it from Descript).
2. In a Claude Code session on this repository, send the .srt with:
   *"new episode kit for EP.3"*. If you have the doctor's hospital profile link, add it.
   It helps Claude check the spelling of their name.
3. Claude sends back a block of text (the kit): the doctor's names, a short bio, the
   episode's specialty and 3–6 Red / Green flags from the conversation. Read it: you know
   the episode best.

## 4. Paste it into the admin

**Admin → Episode kit** → choose the episode → paste the kit → check the preview →
**Add to episode**. Within a minute the doctor has a profile page, the episode shows who's
in it, and the new flags are in the home page quiz. Pasting the same kit twice adds
nothing new; if you edit something in the admin afterwards, a later paste won't
overwrite it.

## 5. The finishing touches

- **Photo with the doctor** (optional): **Admin → Episodes → the episode → Photo with
  the doctor**. Crop it from the chest up with all three faces in. It shows on the
  doctor's page. Without one, the page uses the YouTube thumbnail.
- **The doctor's OK** to publish their name, bio and photo. A LINE message is enough;
  keep it.

The **Episode checklist** on the dashboard shows each episode's doctor, bio, flags,
chapters and photo, ticked when done, with **Add kit** next to anything missing.
