"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Lockup } from "@/components/landing/Logo";

// Errors from the auth action arrive through the Next.js proxy as plain
// messages like "[CONVEX A(auth:signIn)] ... Uncaught Error: <reason>".
function describeAuthError(err: unknown, flow: "signIn" | "signUp"): string {
  if (err instanceof ConvexError) return String(err.data);
  const raw = err instanceof Error ? err.message : String(err);
  const reason = raw.match(/Uncaught (?:ConvexError|Error): ([^\n]+)/)?.[1] ?? raw;
  if (/InvalidSecret|InvalidAccountId|Invalid credentials/.test(reason)) {
    return flow === "signIn" ? "Wrong email or password." : "That account doesn't exist yet.";
  }
  if (/already exists/i.test(reason)) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (/Invalid password/i.test(reason)) {
    return "Passwords need at least 8 characters.";
  }
  if (/JWT_PRIVATE_KEY|JWKS|SITE_URL|pkcs8|Missing environment variable/i.test(reason)) {
    return `The server's login settings aren't right: ${reason}`;
  }
  return reason || "Something went wrong. Please try again.";
}

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const formData = new FormData(event.currentTarget);
    formData.set("flow", flow);
    try {
      await signIn("password", formData);
      router.replace("/admin");
    } catch (err) {
      setError(describeAuthError(err, flow));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="admin-centered admin-dark">
      <form className="admin-card admin-signin" onSubmit={onSubmit}>
        <div className="admin-brand">
          <Lockup height={22} reverse={false} />
        </div>
        <h1>{flow === "signIn" ? "Sign in to the admin portal" : "Create your admin account"}</h1>
        <p className="admin-muted">
          Only approved team emails can {flow === "signIn" ? "sign in" : "register"}.
        </p>
        <label className="admin-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="admin-field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            autoComplete={flow === "signIn" ? "current-password" : "new-password"}
            minLength={8}
            required
          />
        </label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="admin-button" type="submit" disabled={pending}>
          {pending ? "Please wait…" : flow === "signIn" ? "Sign in" : "Create account"}
        </button>
        <button
          type="button"
          className="admin-link-button"
          onClick={() => {
            setFlow(flow === "signIn" ? "signUp" : "signIn");
            setError(null);
          }}
        >
          {flow === "signIn" ? "First time here? Create an account" : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
