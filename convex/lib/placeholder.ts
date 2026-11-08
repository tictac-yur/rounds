// Starter values like "[EMAIL]" or "[XX]K" mark fields nobody has filled in yet.
export function isPlaceholderValue(value: string | undefined | null): boolean {
  return !value || value.includes("[");
}
