"use client";

import { useMutation, useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { ReactNode, useState } from "react";
import { Field, FieldValues, toFormValues } from "./fields";
import { RecordForm } from "./RecordForm";

type Row = FieldValues & { _id: string; order: number; imageUrl?: string | null };

type AnyQuery = FunctionReference<"query", "public", Record<string, never>, Row[]>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMutation = FunctionReference<"mutation", "public", any, any>;

// Generic list + create/edit/delete screen for an ordered content table.
export function ResourceManager({
  title,
  description,
  singular,
  functions,
  fields,
  defaults,
  imageField,
  summary,
}: {
  title: string;
  description: string;
  singular: string;
  functions: { list: AnyQuery; create: AnyMutation; update: AnyMutation; remove: AnyMutation };
  fields: Field[];
  defaults: FieldValues;
  imageField?: string;
  summary: (row: Row) => ReactNode;
}) {
  const rows = useQuery(functions.list, {});
  const create = useMutation(functions.create);
  const update = useMutation(functions.update);
  const remove = useMutation(functions.remove);
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  const nextOrder = rows && rows.length > 0 ? Math.max(...rows.map((r) => r.order)) + 1 : 0;
  const allFields: Field[] = [
    ...fields,
    { name: "order", label: "Display order", type: "number", help: "Lower numbers show first." },
  ];

  if (editing !== null) {
    const isNew = editing === "new";
    return (
      <section className="admin-page">
        <header className="admin-page-header">
          <div>
            <h1>{isNew ? `New ${singular}` : `Edit ${singular}`}</h1>
          </div>
        </header>
        <div className="admin-card">
          <RecordForm
            fields={allFields}
            initialValues={toFormValues(allFields, isNew ? { ...defaults, order: nextOrder } : editing)}
            initialPreviews={!isNew && imageField ? { [imageField]: editing.imageUrl ?? null } : {}}
            submitLabel={isNew ? `Create ${singular}` : "Save changes"}
            onSubmit={async (args) => {
              if (isNew) {
                await create(args);
              } else {
                await update({ id: editing._id, ...args });
              }
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1>{title}</h1>
          <p className="admin-muted">{description}</p>
        </div>
        <button className="admin-button" onClick={() => setEditing("new")}>
          Add {singular}
        </button>
      </header>
      {rows === undefined ? (
        <p className="admin-muted">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="admin-card admin-empty">Nothing here yet.</div>
      ) : (
        <ul className="admin-list">
          {rows.map((row) => (
            <li key={row._id} className="admin-list-row">
              {imageField &&
                (row.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="admin-thumb" src={row.imageUrl} alt="" />
                ) : (
                  <div className="admin-thumb admin-thumb-empty" />
                ))}
              <div className="admin-list-summary">{summary(row)}</div>
              <span className="admin-order">#{row.order}</span>
              <div className="admin-list-actions">
                <button className="admin-button admin-button-secondary" onClick={() => setEditing(row)}>
                  Edit
                </button>
                <button
                  className="admin-button admin-button-danger"
                  onClick={() => {
                    if (window.confirm(`Delete this ${singular}? This can't be undone.`)) {
                      void remove({ id: row._id });
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
