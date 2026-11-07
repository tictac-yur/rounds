export type FieldValues = Record<string, unknown>;

type BaseField = { name: string; label: string; help?: string; optional?: boolean };

export type Field = BaseField &
  (
    | { type: "text" | "textarea" | "url" | "color" }
    | { type: "number" }
    | { type: "checkbox" }
    | { type: "select"; options: { value: string; label: string }[] }
    | { type: "image" }
    | { type: "lines" }
    | { type: "pairs"; placeholder: string }
  );

// Turns form state into the shape Convex expects: optional blanks become
// undefined and numbers are parsed.
export function toArgs(fields: Field[], values: FieldValues): FieldValues {
  const args: FieldValues = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.type === "number") {
      args[field.name] = Number(value ?? 0);
    } else if (field.type === "checkbox") {
      args[field.name] = Boolean(value);
    } else if (field.type === "lines") {
      args[field.name] = String(value ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (field.type === "pairs") {
      args[field.name] = String(value ?? "")
        .split("\n")
        .map((line) => line.split("|").map((part) => part.trim()))
        .filter(([first]) => first)
        .map(([value, label]) => ({ value, label: label ?? "" }));
    } else if (value === "" || value === undefined || value === null) {
      args[field.name] = field.optional ? undefined : "";
    } else {
      args[field.name] = value;
    }
  }
  return args;
}

// The inverse of toArgs, for loading a stored document into the form.
export function toFormValues(fields: Field[], doc: FieldValues): FieldValues {
  const values: FieldValues = {};
  for (const field of fields) {
    const value = doc[field.name];
    if (field.type === "lines") {
      values[field.name] = ((value as string[] | undefined) ?? []).join("\n");
    } else if (field.type === "pairs") {
      values[field.name] = ((value as { value: string; label: string }[] | undefined) ?? [])
        .map((pair) => `${pair.value} | ${pair.label}`)
        .join("\n");
    } else {
      values[field.name] = value ?? (field.type === "checkbox" ? false : "");
    }
  }
  return values;
}
