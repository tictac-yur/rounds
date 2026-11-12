"use client";

import { ArrowIcon } from "@/components/landing/Icons";

// Opens the browser's print dialog, where "Save as PDF" makes the file.
export function PrintButton() {
  return (
    <button type="button" className="btn btn-light btn-sm" onClick={() => window.print()}>
      บันทึกเป็น PDF
      <span className="btn-arrow">
        <ArrowIcon />
      </span>
    </button>
  );
}
