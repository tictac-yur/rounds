// Starter content marks unfilled values with brackets, e.g. "[XX]K" or
// "[ชื่อตอน]". The site hides values like these instead of showing them.
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || value.includes("[");
}

// The value, or null when it is still a placeholder.
export function filled(value: string | null | undefined): string | null {
  return isPlaceholder(value) ? null : (value as string);
}

// Drops placeholder parts from a "a · b · c" line, e.g. "[วันที่] · 42 นาที" → "42 นาที".
export function cleanJoin(...parts: (string | null | undefined)[]): string {
  return parts
    .flatMap((part) => (part ?? "").split(" · "))
    .map((part) => part.trim())
    .filter((part) => part && !isPlaceholder(part))
    .join(" · ");
}
