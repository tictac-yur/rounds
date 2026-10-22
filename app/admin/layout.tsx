import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ConvexClientProvider } from "@/components/admin/ConvexClientProvider";
import "./admin.css";

export const metadata: Metadata = {
  title: "Rounds — Admin",
  robots: { index: false, follow: false },
};

async function AuthProviders({ url, children }: { url: string; children: ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider url={url}>{children}</ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    return (
      <main className="admin-centered">
        <div className="admin-card">
          <h1>Convex isn&apos;t configured</h1>
          <p>
            Set <code>NEXT_PUBLIC_CONVEX_URL</code> (run <code>npx convex dev</code>) to use the
            admin portal.
          </p>
        </div>
      </main>
    );
  }
  return (
    <div className="admin-root">
      {/* The auth provider reads cookies, so it renders per request. */}
      <Suspense fallback={<p className="admin-loading">Loading…</p>}>
        <AuthProviders url={url}>{children}</AuthProviders>
      </Suspense>
    </div>
  );
}
