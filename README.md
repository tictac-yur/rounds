# Rounds

Website for **Rounds** — medical school, as it happens. Next.js 16 front end,
[Convex](https://convex.dev) backend, [Convex Auth](https://labs.convex.dev/auth)
for the admin portal.

- Public site: `/`
- Admin portal: `/admin` (content management for every section of the site)
- Site structure: [`docs/SITE_PLAN.md`](docs/SITE_PLAN.md)
- Plan to finish and polish the site: [`docs/LAUNCH_PLAN.md`](docs/LAUNCH_PLAN.md)

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
