# Rounds

Website for **Rounds** — medical school, as it happens. Next.js 16 front end,
[Convex](https://convex.dev) backend, [Convex Auth](https://labs.convex.dev/auth)
for the admin portal.

- Public site: `/`
- Admin portal: `/admin` (content management for every section of the site)
- Site structure: [`docs/SITE_PLAN.md`](docs/SITE_PLAN.md)
- Plan to finish and polish the site: [`docs/LAUNCH_PLAN.md`](docs/LAUNCH_PLAN.md)
- Design system: [Rounds design system](https://claude.ai/artifact/2ZTEdNhmkLWw4oTarazXXZ).
  Its tokens live in `app/globals.css` (colours, spacing, type styles such as
  `.ds-headline` and `.ds-label`) and its logo files in `public/brand/`.

## Getting started

```bash
bun install
npx convex dev        # creates a deployment, writes NEXT_PUBLIC_CONVEX_URL to .env.local
bun dev               # http://localhost:3000
```

Without a Convex deployment the public site still runs, using the starter
content in `convex/seedData.ts`.

### One-time auth setup

Convex Auth needs a signing key pair and the admin allowlist on the Convex
deployment:

```bash
# 1. Generate JWT_PRIVATE_KEY and JWKS
node -e 'import("jose").then(async({generateKeyPair,exportPKCS8,exportJWK})=>{const k=await generateKeyPair("RS256",{extractable:true});const priv=await exportPKCS8(k.privateKey);const pub=await exportJWK(k.publicKey);process.stdout.write(JSON.stringify({JWT_PRIVATE_KEY:priv.trimEnd().replace(/\n/g," "),JWKS:JSON.stringify({keys:[{use:"sig",...pub}]})}))})' > .auth-keys.json

# 2. Set them (NAME=VALUE form; the key starts with "-----")
npx convex env set "JWT_PRIVATE_KEY=$(node -p 'require("./.auth-keys.json").JWT_PRIVATE_KEY')"
npx convex env set "JWKS=$(node -p 'require("./.auth-keys.json").JWKS')"
npx convex env set SITE_URL http://localhost:3000
rm .auth-keys.json

# 3. Who may use the admin portal (comma-separated)
npx convex env set ADMIN_EMAILS "titi@example.com,pup@example.com"
```

Then open `/admin/sign-in`, choose **Create an account** with an allowlisted
email, and on the dashboard click **Load starter content** to copy the current
site copy into the database.

## Deploying to Vercel

1. In the Convex dashboard, open the **production** deployment → Settings →
   **Generate Production Deploy Key**.
2. In Vercel → Project → Settings → Environment Variables, add
   `CONVEX_DEPLOY_KEY` with that key, scoped to **Production** only.
   For preview deployments (any branch other than `main`), generate a
   **Preview Deploy Key** in Convex and add it scoped to **Preview**.
3. Build command: `bunx convex deploy --cmd 'bun run build'`. It deploys the
   Convex functions, sets `NEXT_PUBLIC_CONVEX_URL`, then builds the site.
4. On the production Convex deployment, set `JWT_PRIVATE_KEY`, `JWKS`,
   `ADMIN_EMAILS`, and `SITE_URL` (the Vercel URL, later
   `https://roundsmed.com`), as in "One-time auth setup" above.

## Project layout

```
app/                    Next.js routes (public site + /admin portal)
  admin/(portal)/       Admin pages, one per content type
components/landing/     Public site sections (render Convex content)
components/admin/       Admin shell, generic list/edit screen, forms
convex/                 Backend: schema, auth, public content query, admin CRUD
lib/content.ts          Cached server-side fetch of home page content
proxy.ts                Convex Auth proxy + /admin redirects
```
