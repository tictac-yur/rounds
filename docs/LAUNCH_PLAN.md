# Rounds website — plan to finish and polish

Where things stand: the site has one page, a working admin portal and a
newsletter form, but it isn't deployed, it still shows 17 `[PLACEHOLDER]`
values, has no real photos, and the EN/TH switch does nothing. Most of what's
left is **content the team has to supply**, not code.

Sizes: **S** = an hour or two, **M** = about a day, **L** = several days.

---

## Phase 0 — Go live (blockers)

Nothing else matters until a real person can visit the site on a phone and see
real information.

### Team: content to gather

| What | Where it shows | Notes |
| --- | --- | --- |
| Follower total, monthly views | Hero stats | Real numbers, with a date you can update monthly |
| Audience split (pre-med / med students / public %) | Who's watching | From YouTube/TikTok analytics |
| Contact email | Partner, footer | Use a shared inbox, e.g. hello@ |
| Spotify and Apple Podcasts links | Latest episode, footer | |
| Media kit PDF | Audience, partner, footer | |
| Name of the vlog series | Series section | Currently `[SERIES NAME]` |
| ER guest's name and title | Latest episode, guests | Currently "name pending" |
| OB-GYN episode title | Episode grid | |
| Release date and runtime for each episode | Episode cards | |
| Photos: Titi & Pup on set, each host, each guest, episode thumbnails | Hero, hosts, guests, episodes | Landscape 16:9 for episodes, 4:5 for people |
| Guests' OK to use their name and photo | Everywhere | Get it in writing |

All of this is entered in `/admin`. No code changes needed.

### Code

| Task | Size |
| --- | --- |
| Merge the admin branch into `main` | S |
| Create the production Convex deployment and set the auth env vars (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`, `ADMIN_EMAILS`) | S |
| Deploy the site to Vercel and connect the domain | S |
| **Mobile menu.** Below 820px the nav links are hidden and there's no menu to replace them, so phone visitors can't navigate | S |
| Real favicon, app icon and default share image (currently the Next.js defaults); delete the unused starter SVGs in `public/` | S |
| **Privacy notice and consent on the newsletter form.** Thailand's PDPA requires telling people what you collect and why before taking their email | S |
| Rate-limit newsletter sign-ups so bots can't spam the list | S |
| Branded 404 page | S |

**Done when:** the site is live on its own domain, works on a phone, and has no
`[PLACEHOLDER]` text left.

---

## Phase 1 — Make it good

### 1. A page for every episode — M

Right now episode cards link out to YouTube or back to the top of the page.
Each episode needs its own page at `/episodes/[slug]`:

- YouTube player embedded on the page
- Show notes and timestamps (chapters)
- Guest card with photo and title
- The myths answered in that episode
- **Sources** for medical claims, plus a "Reviewed by" line naming the
  specialist. For health content this is what makes people trust it, and
  what Google rewards
- Links to listen on Spotify and Apple, and an "up next" episode

Also add an `/episodes` archive page with the specialty filter.

### 2. Real Thai and English — L

The audience is mainly Thai, yet the site is English with Thai added in a few
spots, and the language switch doesn't work.

- Add Thai versions of every text field in the admin (side by side with English)
- `/th/...` and `/en/...` routes so the toggle actually switches language
- Decide which language is the default (see decisions below)

### 3. Pull episode data from YouTube automatically — M

A scheduled job fetches the latest uploads, thumbnails, runtimes and view
counts from the YouTube Data API. The team picks which videos become
episodes; dates and runtimes fill themselves in, and the follower stats stop
going out of date.

### 4. Search and sharing — M

- Page titles and descriptions for every page
- Share images generated for each episode (title, guest, specialty)
- `sitemap.xml`, `robots.txt`, and structured data (`PodcastEpisode`,
  `VideoObject`) so episodes can appear in Google results

### 5. Design and accessibility polish — M

- Move the repeated inline styles into shared components and design tokens,
  so every section is consistent and quicker to change
- Check every screen at phone, tablet and desktop widths
- Accessibility pass: colour contrast, keyboard navigation, alt text on every
  photo (add an alt-text field in the admin), Thai `lang` attributes
- Lighthouse scores of 90+ for performance, accessibility and SEO

**Done when:** every episode has a shareable page with sources, the site works
fully in Thai and English, and Lighthouse is 90+ on mobile.

---

## Phase 2 — Grow the audience and sponsors

| Task | Why | Size |
| --- | --- | --- |
| Send the newsletter (e.g. Resend), with double opt-in and an unsubscribe link | Sign-ups are collected but nothing is ever sent | M |
| "Vote for the next specialty" poll | Promised in the newsletter pitch; gives people a reason to come back | S |
| "Ask the specialist" form for audience questions | Content ideas, and the audience feels involved | S |
| Standalone `/partner` page with an enquiry form that lands in the admin | Sponsors can find and contact you easily | M |
| Live stats in the media kit | The numbers stay current | S |
| Searchable `/myths` library | Every myth becomes something people can find through Google | M |
| Privacy-friendly analytics (Vercel Analytics or Plausible) | Learn which episodes and pages work | S |

---

## Phase 3 — Team workflow

| Task | Size |
| --- | --- |
| Editor role (can edit content) vs admin role (can manage people and settings) | M |
| Preview drafts before publishing | M |
| Scheduled publishing: an episode goes live on its release date automatically | S |
| Edit history (who changed what, when) | M |
| Drag-and-drop ordering instead of typing order numbers | S |
| Automated tests for the admin permissions and content queries | M |

---

## Decisions needed

1. **Domain name.** What will the site live at?
2. **Default language.** Thai first (matches the audience) or English first
   (matches sponsors and the current design)?
3. **Medical review.** Who signs off on episode notes and myth answers before
   they're published, e.g. the guest or a faculty member?
4. **Newsletter tool.** Send from the site (Resend; simple, cheap) or use an
   existing tool like Mailchimp or Substack?
5. **Hosting accounts.** Who owns the Vercel and Convex accounts? Ideally a
   shared team account, not one person's.

## Suggested order

1. Phase 0 code tasks and content gathering, at the same time
2. Launch
3. Episode pages, then SEO, then Thai/English
4. YouTube sync and newsletter sending
5. Everything else as needed
