import { Dashboard } from "@/components/admin/Dashboard";

// Signed-in page, rendered per request behind the session check.
export const instant = false;

export default function DashboardPage() {
  return <Dashboard />;
}
