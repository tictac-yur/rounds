"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { ConvexError } from "convex/values";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Lockup } from "@/components/landing/Logo";

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
      setError(
        err instanceof ConvexError
          ? String(err.data)
          : flow === "signIn"
            ? "Wrong email or password."
            : "Couldn't create the account. Passwords need at least 8 characters.",
      );
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
