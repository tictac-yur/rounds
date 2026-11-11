// Display helpers for the live YouTube numbers.

export function compactNumber(n: number): string {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function percent(n: number): string {
  return `${Math.round(n)}%`;
}

const GENDERS: Record<string, string> = { female: "ผู้หญิง", male: "ผู้ชาย", user_specified: "ไม่ระบุ" };
export function genderLabel(gender: string): string {
  return GENDERS[gender] ?? gender;
}

export function countryLabel(code: string): string {
  try {
    return new Intl.DisplayNames(["th"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
