"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/subscribe";

const initialState: SubscribeState = { status: "idle", message: "" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribe, initialState);
  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label htmlFor="email" style={{ fontSize: 14, fontWeight: 600 }}>
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        style={{
          height: 52,
          padding: "0 16px",
          border: "1px solid #5d666f",
          background: "#f7f8fa",
          font: "inherit",
          fontSize: 16,
          color: "#0a0f14",
          borderRadius: 0,
        }}
      />
      <button
        type="submit"
        disabled={pending}
        style={{
          height: 52,
          border: 0,
          background: "#1b3a5f",
          color: "#ffffff",
          font: "inherit",
          fontSize: 16,
          fontWeight: 600,
          cursor: pending ? "wait" : "pointer",
        }}
      >
        {pending ? "Subscribing…" : "Subscribe"}
      </button>
      {state.message && (
        <p role="status" style={{ margin: 0, fontSize: 14, color: state.status === "error" ? "#a12a2a" : "#1b3a5f" }}>
          {state.message}
        </p>
      )}
    </form>
  );
}
