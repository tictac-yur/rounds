import { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

// Signed-in pages: rendered per request behind the session check.
export const instant = false;

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
