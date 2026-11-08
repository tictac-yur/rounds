import { ReactNode } from "react";

// Section title: a small label, the English keyword as the headline, the Thai line under it.
export function SectionHeader({
  label,
  en,
  th,
  action,
  id,
}: {
  label: string;
  en: string;
  th: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">
          <span className="eyebrow-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {label}
        </span>
        <h2 className="h2" lang="en" id={id}>
          {en}
        </h2>
        <p className="h2-th muted">{th}</p>
      </div>
      {action}
    </div>
  );
}
