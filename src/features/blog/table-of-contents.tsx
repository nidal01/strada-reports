"use client";

import { useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TocHeading } from "./types";

type Props = {
  headings: TocHeading[];
  labels: { title: string; toggle: string };
};

export function BlogTableOfContents({ headings, labels }: Props) {
  const [open, setOpen] = useState(false);

  if (headings.length === 0) return null;

  const nav = (
    <nav aria-label={labels.title}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{labels.title}</p>
      <ol className="mt-3 space-y-2 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={cn(h.level === 3 && "pl-4")}>
            <a
              href={`#${h.id}`}
              className="text-slate-400 transition-colors hover:text-brand-300"
              onClick={() => setOpen(false)}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <>
      {/* Mobil: açılır kapanır */}
      <div className="mb-8 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-surface/40 px-4 py-3 text-sm font-medium text-slate-300"
          aria-expanded={open}
        >
          <span className="inline-flex items-center gap-2">
            <List className="size-4" />
            {labels.title}
          </span>
          <span className="text-xs text-slate-500">{open ? "−" : "+"}</span>
        </button>
        {open ? (
          <div className="mt-3 rounded-xl border border-[var(--border)] bg-surface/40 p-4">{nav}</div>
        ) : null}
      </div>

      {/* Masaüstü: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-xl border border-[var(--border)] bg-surface/40 p-5">{nav}</div>
      </aside>
    </>
  );
}
