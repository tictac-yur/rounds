"use client";

import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { FormEvent, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Field, FieldValues, toArgs } from "./fields";

function ImageInput({
  name,
  value,
  previewUrl,
  onChange,
}: {
  name: string;
  value: unknown;
  previewUrl: string | null;
  onChange: (storageId: string | undefined, preview: string | null) => void;
}) {
  const generateUploadUrl = useMutation(api.admin.files.generateUploadUrl);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await response.json()) as { storageId: string };
      onChange(storageId, URL.createObjectURL(file));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="admin-image-input">
      {value && previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="" />
      ) : (
        <div className="admin-image-empty">No image</div>
      )}
      <div className="admin-image-actions">
        <input
          id={name}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        {uploading && <span className="admin-muted">Uploading…</span>}
        {Boolean(value) && (
          <button type="button" className="admin-link-button" onClick={() => onChange(undefined, null)}>
            Remove image
          </button>
        )}
      </div>
    </div>
  );
}

export function RecordForm({
  fields,
  initialValues,
  initialPreviews = {},
  submitLabel,
  onSubmit,
  onCancel,
}: {
  fields: Field[];
  initialValues: FieldValues;
  initialPreviews?: Record<string, string | null>;
  submitLabel: string;
  onSubmit: (args: FieldValues) => Promise<unknown>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<FieldValues>(initialValues);
  const [previews, setPreviews] = useState(initialPreviews);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (name: string, value: unknown) => {
    setValues((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSubmit(toArgs(fields, values));
      setSaved(true);
    } catch (err) {
      setError(err instanceof ConvexError ? String(err.data) : "Couldn't save. Check the fields and try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {fields.map((field) => {
        const value = values[field.name];
        const id = `field-${field.name}`;
        let input;
        switch (field.type) {
          case "textarea":
          case "lines":
          case "pairs":
            input = (
              <textarea
                id={id}
                rows={field.type === "textarea" ? 4 : 5}
                value={String(value ?? "")}
                placeholder={field.type === "pairs" ? field.placeholder : undefined}
                required={!field.optional && field.type === "textarea"}
                onChange={(e) => set(field.name, e.target.value)}
              />
            );
            break;
          case "number":
            input = (
              <input id={id} type="number" value={String(value ?? 0)} onChange={(e) => set(field.name, e.target.value)} />
            );
            break;
          case "checkbox":
            input = (
              <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => set(field.name, e.target.checked)} />
            );
            break;
          case "select":
            input = (
              <select id={id} value={String(value ?? "")} onChange={(e) => set(field.name, e.target.value)}>
                {field.optional && <option value="">— None —</option>}
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            );
            break;
          case "image":
            input = (
              <ImageInput
                name={id}
                value={value}
                previewUrl={previews[field.name] ?? null}
                onChange={(storageId, preview) => {
                  set(field.name, storageId);
                  setPreviews((current) => ({ ...current, [field.name]: preview }));
                }}
              />
            );
            break;
          default:
            input = (
              <input
                id={id}
                type={field.type === "url" ? "text" : field.type}
                value={String(value ?? "")}
                required={!field.optional && field.type !== "color"}
                onChange={(e) => set(field.name, e.target.value)}
              />
            );
        }
        return (
          <div key={field.name} className={`admin-field admin-field-${field.type}`}>
            <label htmlFor={id}>
              {field.label}
              {field.optional && <span className="admin-muted"> (optional)</span>}
            </label>
            {input}
            {field.help && <small className="admin-muted">{field.help}</small>}
          </div>
        );
      })}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
      <div className="admin-form-actions">
        <button className="admin-button" type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        {saved && !onCancel && <span className="admin-muted">Saved.</span>}
      </div>
    </form>
  );
}
