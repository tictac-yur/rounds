# Rounds website — structure plan

Rounds is a bilingual (TH/EN) channel following two Thammasat medical students
and the specialists they interview. The site has three jobs:

1. **Audience** — watch the latest episode, browse the back catalogue, read
   the doctors' Red flag / Green flag verdicts.
2. **Partners** — understand who watches and what can be sponsored, then get
   in touch.
3. **Team** — keep all of the above current without touching code, through the
   admin portal.

## 1. Sitemap

Status: ✅ built in this change · 🔜 next phase · 💡 later

```
/                         ✅ Home (one-page overview, all sections below)
│  #latest                   Latest episode (the featured published episode)
│  #episodes                 The Consult grid + specialty filter
│  #flags                    Red flag / Green flag: the guest doctor's verdicts
│  #audience                 Who's watching + platform handles
│  (series)                  One channel, three series
│  #partner                  Sponsorship pitch, guests, packages
│  #about                    Hosts
│
/episodes                 🔜 Full episode archive, filter by series & specialty
/episodes/[slug]          🔜 Episode page: embed, summary, guest, myths, links
/series/[slug]            💡 Series landing page
/myths                    💡 Searchable myth-buster library (SEO magnet)
/partner                  🔜 Standalone sponsor page + media kit download
/about                    💡 Hosts, mission, editorial independence, disclaimer
/th/...                   💡 Thai-language routes (see §5)

/admin/sign-in            ✅ Admin sign-in / first-time account creation
/admin                    ✅ Dashboard (+ "load starter content")
/admin/episodes           ✅ Episodes (status, featured, series, guest, links, thumbnail)
/admin/series             ✅ Series
/admin/guests             ✅ Guests (photo, Thai/English name)
/admin/myths              ✅ Red / Green flags (verdict, linked episode, publish toggle)
/admin/hosts              ✅ Hosts (photo)
/admin/audience           ✅ Audience segments
/admin/packages           ✅ Sponsor packages
/admin/settings           ✅ Hero copy, stats, social links, contact, media kit
```

The episode slugs already exist in the data model so `/episodes/[slug]` can be
added without a migration.

## 2. Content model (Convex tables)

Defined in `convex/schema.ts`. Every list table has an `order` field (lower
shows first) and a `by_order` index.

| Table | Drives | Key fields |
| --- | --- | --- |
| `siteSettings` (single row) | Hero, stats, audience intro, footer links, contact | `heroHeadline`, `heroIntro`/`heroIntroTh`, `heroImageId`, `stats[]`, `platformHandles[]`, social URLs, `contactEmail`, `mediaKitUrl` |
| `episodes` | Latest episode, episode grid | `slug` (unique), `status` (`draft`/`coming_soon`/`published`), `featured`, `seriesId`, `guestId`, `specialty`, `summary`, `releaseDate`, `runtime`, platform links, `thumbnailId` or generated thumbnail (`thumbLabel`, `thumbVariant`) |
| `series` | "One channel, three series" | `name`, `kicker`, `description`, `accentColor` |
| `guests` | Partner section, episode cards | `name`, `nameLang` (`en`/`th` → font), `field`, `affiliation`, `photoId` |
| `myths` | Red flag / Green flag section | `claim`, `answer`, `verdict` (`red`/`green`), `episodeId` (credits that episode's guest), `published` |
| `audienceSegments` | "Who's watching" | `stat`, `title`, `description` |
| `sponsorPackages` | Partner packages | `letter`, `title`, `description` |
| `hosts` | "The hosts" | `name`, `role`, `photoId` |
| `users` + Convex Auth tables | Admin accounts | `email`, `role: "admin"` |

Rules:

- **Visibility**: drafts never leave the server. `content.home` only returns
  `published` and `coming_soon` episodes and `published` myths.
- **Latest episode**: the first `published` episode marked `featured`, else the
  first `published` one by order.
- **Deleting** a series/guest detaches it from episodes; deleting an episode
  detaches its myths; replacing or deleting an image removes the stored file.

## 3. How content flows

```
Admin portal (client, Convex React)          Public site (server components)
  useQuery/useMutation ─► convex/admin/*        lib/content.ts  getHomeContent()
        │  requireAdmin() on every call            "use cache" + cacheLife("minutes")
        ▼                                          fetchQuery(api.content.home)
   Convex database  ◄──────────────────────────────┘
```

- The public home page is statically prerendered and revalidated every
  minute, so it stays fast and admin edits appear within ~1 minute.
- If `NEXT_PUBLIC_CONVEX_URL` isn't set or Convex is unreachable, the site
  falls back to the starter content in `convex/seedData.ts` (the original
  landing-page copy), so it never renders empty.

## 4. Authentication & authorization

- **Convex Auth** (`@convex-dev/auth`) with the **Password** provider.
- **Who can get in**: only emails in the `ADMIN_EMAILS` deployment env var
  (comma-separated). The check runs on sign-up *and* every sign-in, so removing
  an email revokes access at the next sign-in. Allowed users get
  `role: "admin"`.
- **Server-side enforcement**: every function in `convex/admin/*` calls
  `requireAdmin()`; the Next.js `proxy.ts` redirect is only a convenience.
- The auth provider is mounted only under `/admin`, so the public site stays
  fully static.

## 5. Roadmap

**Phase 1 — CMS foundation (this change)**
Convex schema, Convex Auth, admin portal for every section on the home page,
home page reads from Convex. Since then: Thai-first copy, Red flag / Green flag
verdicts, polaroid episode photos, newsletter removed.

**Phase 2 — Episode pages & SEO**
- `/episodes` archive and `/episodes/[slug]` pages (YouTube embed, guest card,
  linked myths, platform links), `generateMetadata` + OG images per episode.
- `sitemap.ts` / `robots.ts`, JSON-LD (`PodcastEpisode`, `VideoObject`).
- Add `@convex-dev/rate-limiter` to `content.subscribe`.

**Phase 3 — Bilingual content**
- Add optional `*Th` fields (title, summary, myth claim/answer, descriptions)
  and show TH/EN side by side in the admin forms.
- Make the existing EN/TH toggle real with `/th` routes (see
  `node_modules/next/dist/docs/01-app/02-guides/internationalization.md`).

**Phase 4 — Partners & growth**
- Upload the media kit PDF to Convex storage from the admin portal.
- Contact/partnership enquiry form stored in Convex with an admin inbox.
- Newsletter: on hold.
- "Vote for the next specialty" poll.

**Phase 5 — Team workflow**
- Editor vs. admin roles, scheduled publishing (`releaseDate` → scheduled
  mutation flips status), audit log of edits, drag-and-drop ordering.
