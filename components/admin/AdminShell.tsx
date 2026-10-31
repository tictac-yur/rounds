"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import { LogoMark, Wordmark } from "@/components/landing/Logo";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/episodes", label: "Episodes" },
  { href: "/admin/series", label: "Series" },
  { href: "/admin/guests", label: "Guests" },
  { href: "/admin/myths", label: "Red / Green flags" },
  { href: "/admin/hosts", label: "Hosts" },
  { href: "/admin/audience", label: "Audience" },
  { href: "/admin/packages", label: "Sponsor packages" },
  { href: "/admin/settings", label: "Site settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const viewer = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/sign-in");
  }

  if (viewer === undefined) {
    return <p className="admin-loading">Loading…</p>;
  }
  if (viewer === null || !viewer.isAdmin) {
    return (
      <main className="admin-centered">
        <div className="admin-card">
          <h1>No access</h1>
          <p>This account isn&apos;t allowed to manage the site.</p>
          <button className="admin-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-sidebar-brand">
          <LogoMark />
          <Wordmark size={16} />
        </Link>
        <nav aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          <span className="admin-sidebar-email">{viewer.email}</span>
          <button className="admin-link-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
