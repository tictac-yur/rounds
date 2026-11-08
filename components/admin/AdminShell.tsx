"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Lockup } from "@/components/landing/Logo";

const NAV = [
  { group: null, items: [{ href: "/admin", label: "Dashboard" }] },
  {
    group: "Content",
    items: [
      { href: "/admin/episodes", label: "Episodes" },
      { href: "/admin/myths", label: "Red / Green flags" },
      { href: "/admin/series", label: "Series" },
      { href: "/admin/guests", label: "Guests" },
      { href: "/admin/hosts", label: "Hosts" },
    ],
  },
  {
    group: "For brands",
    items: [
      { href: "/admin/audience", label: "Audience" },
      { href: "/admin/packages", label: "Sponsor packages" },
    ],
  },
  { group: "Site", items: [{ href: "/admin/settings", label: "Site settings" }] },
];

// The logo's three discs, used as decoration across the admin.
export function Discs({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 900 420" aria-hidden="true">
      <circle cx={210} cy={210} r={210} fill="#16283d" />
      <circle cx={450} cy={210} r={210} fill="#1b3a5f" />
      <circle cx={690} cy={210} r={210} fill="#2b5c91" />
    </svg>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const viewer = useQuery(api.users.viewer);
  const { signOut } = useAuthActions();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace("/admin/sign-in");
  }

  if (viewer === undefined) {
    return <p className="admin-loading">Loading…</p>;
  }
  if (viewer === null || !viewer.isAdmin) {
    return (
      <main className="admin-centered admin-dark">
        <Discs className="admin-signin-discs" />
        <div className="admin-card admin-signin">
          <Lockup height={22} reverse={false} />
          <h1>No access</h1>
          <p className="admin-muted">This account isn&apos;t allowed to manage the site.</p>
          <button className="admin-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar" data-open={menuOpen}>
        <div className="admin-sidebar-top">
          <Link href="/admin" className="admin-sidebar-brand" aria-label="Rounds admin home">
            <Lockup height={20} />
            <span className="admin-badge-tag">Admin</span>
          </Link>
          <button
            type="button"
            className="admin-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="admin-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <div id="admin-nav" className="admin-sidebar-body">
          <nav aria-label="Admin">
            {NAV.map((section) => (
              <div key={section.group ?? "main"} className="admin-nav-group">
                {section.group && <span className="admin-nav-label">{section.group}</span>}
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
          <div className="admin-sidebar-footer">
            <a href="/" target="_blank" rel="noreferrer" className="admin-button admin-button-light">
              View site ↗
            </a>
            <span className="admin-sidebar-email">{viewer.email}</span>
            <button className="admin-link-button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
        <Discs className="admin-sidebar-discs" />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

// Page title block: small label, big title, one line under it, actions on the right.
export function AdminPageHeader({
  label,
  title,
  description,
  actions,
}: {
  label?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="admin-page-header">
      <div>
        {label && (
          <span className="admin-eyebrow">
            <span className="admin-eyebrow-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {label}
          </span>
        )}
        <h1>{title}</h1>
        {description && <p className="admin-muted">{description}</p>}
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </header>
  );
}
