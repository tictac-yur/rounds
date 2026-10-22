"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function SubscribersPage() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.admin.subscribers.list,
    {},
    { initialNumItems: 50 },
  );
  const remove = useMutation(api.admin.subscribers.remove);

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>Subscribers</h1>
          <p className="admin-muted">People who signed up for the newsletter, newest first.</p>
        </div>
        {results.length > 0 && (
          <button
            className="admin-button admin-button-secondary"
            onClick={() => void navigator.clipboard.writeText(results.map((r) => r.email).join("\n"))}
          >
            Copy loaded emails
          </button>
        )}
      </header>
      {status === "LoadingFirstPage" ? (
        <p className="admin-muted">Loading…</p>
      ) : results.length === 0 ? (
        <div className="admin-card admin-empty">No subscribers yet.</div>
      ) : (
        <ul className="admin-list">
          {results.map((row) => (
            <li key={row._id} className="admin-list-row">
              <div className="admin-list-summary">
                <strong>{row.email}</strong>
                <span className="admin-muted">{new Date(row._creationTime).toLocaleString()}</span>
              </div>
              <div className="admin-list-actions">
                <button
                  className="admin-button admin-button-danger"
                  onClick={() => {
                    if (window.confirm(`Remove ${row.email}?`)) void remove({ id: row._id });
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {status === "CanLoadMore" && (
        <button className="admin-button admin-button-secondary" onClick={() => loadMore(50)}>
          Load more
        </button>
      )}
    </section>
  );
}
