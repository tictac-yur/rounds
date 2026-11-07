import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";
import { DataModel } from "./_generated/dataModel";

// Only emails listed in the ADMIN_EMAILS env var (comma-separated) can
// create an account or sign in. Everyone who can sign in is an admin.
function allowedEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password<DataModel>({
      profile(params) {
        const email = String(params.email ?? "").trim().toLowerCase();
        if (!allowedEmails().has(email)) {
          throw new ConvexError("This email is not allowed to access the admin portal.");
        }
        return { email, role: "admin" as const };
      },
    }),
  ],
});
