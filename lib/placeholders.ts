// Starter content marks unfilled values with brackets, e.g. "[XX]K" or
// "[ชื่อตอน]". The site hides values like these instead of showing them.
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || value.includes("[");
}
