import { ReactNode } from "react";

// Section title: mono number, English keyword as the headline, Thai line under it.
export function SectionHeader({
  number,
  en,
  th,
  action,
}: {
  number: string;
  en: string;
  th: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-head" style={{ alignItems: "flex-end" }}>
      <div style={{ flexDirection: "column", alignItems: "flex-start", gap: "var(--space-1)" }}>
        <span className="ds-label">{number}</span>
        <h2 className="ds-headline" lang="en">
          {en}
        </h2>
        <p className="ds-body-lg muted">{th}</p>
      </div>
      {action}
    </div>
  );
}
